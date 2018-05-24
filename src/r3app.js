import React from 'react';
import { connect } from 'react-redux';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import { forEachObjIndexed as each, set, view, lensPath, equals, map } from 'ramda';

const noop = () => {};
const cancellationToken = {};

function parsePath(path) {
  return path.split(/[.[\]]/);
}

/**
 * create lens from path
 */
function pathToLens(path) {
  return lensPath(parsePath(path));
}

function createCancellablePromise(promise) {
  let ct;

  const cancellablePromise = promise.then(
    result => {
      if (ct) {
        return Promise.reject(ct);
      }
      return result;
    },
    reason => {
      return ct || reason;
    }
  );

  cancellablePromise.cancel = function(value = cancellationToken) {
    if (ct) return this;
    console.log('cancelled');
    ct = value;
    return this;
  };

  return cancellablePromise;
}

export function create(initialState = {}) {
  // create random action key
  const actionKey = new Date().getTime().toString();
  const store = createStore((state = initialState, action) => {
    // extract action info
    const { [actionKey]: key, payload } = action;
    if (key) {
      // is merge action, merge state and payload
      // need to improve this logic, avoid update call if state is not changed
      if (key === '@') {
        // extract properties to compare
        const stateToCompare = map((v, k) => state[k], payload);
        if (equals(stateToCompare, payload)) {
          return state;
        }

        return {
          ...state,
          ...payload
        };
      }

      // if there is any change with this key/prop, clone current state and apply the changes
      if (equals(view(pathToLens(key), state), payload)) return state;

      //console.log(action);

      return set(pathToLens(key), payload, state);
    }

    // call custom reducers if any
    return customReducers ? customReducers(state, action) : state;
  });
  let actionWrappers = {
    /**
     * update state
     */
    $(changes = {}) {
      store.dispatch({
        type: 'merge',
        [actionKey]: '@',
        payload: changes
      });
    }
  };

  let customReducers = null;

  function registerActions(parentKey, model) {
    each((x, k) => {
      const originalKey = k;
      let options = {};
      if (parentKey) {
        k = parentKey + '.' + k;
      }

      // action setting can be Function or Array
      // prop: Function
      // prop: [actionName, Function]
      if (x instanceof Function || x instanceof Array) {
        let name = x.name || originalKey;

        if (x instanceof Array) {
          options = x[1] || options;
          if (typeof options === 'string') {
            options = { name: options };
          }

          name = options.name || name;

          x = x[0];
        }

        const actionPath = (parentKey ? parentKey + '.' : '') + name;
        // create action wrapper
        const actionWrapper = (...args) => {
          const currentOptions = actionWrapper.options || options;
          delete actionWrapper.options;

          // cancel prev executing
          if (currentOptions.single && actionWrapper.lastResult && actionWrapper.lastResult.cancel) {
            actionWrapper.lastResult.cancel();
          }

          delete actionWrapper.lastResult;

          const dispatchStatus = !currentOptions.dispatchStatus
            ? noop
            : () => {
                store.dispatch({
                  type: actionPath,
                  [actionKey]: actionKey,
                  payload: Math.random() * new Date().getTime()
                });
              };

          let actionResult;
          delete actionWrapper.error;
          actionWrapper.executing = true;
          actionWrapper.success = false;
          actionWrapper.failed = false;

          try {
            actionResult = x(...args);

            // is lazy call, (...args) => (getState, actions) => actionBody
            if (actionResult instanceof Function) {
              actionResult = actionResult(store.getState, actionWrappers);
            }
          } catch (ex) {
            actionWrapper.failed = true;
            actionWrapper.error = ex;
            throw ex;
          } finally {
            actionWrapper.executing = false;
          }

          // is then-able object
          if (actionResult && actionResult.then) {
            actionWrapper.executing = true;

            actionWrapper.lastResult = actionResult = createCancellablePromise(actionResult);

            dispatchStatus();

            // handle async action call
            actionResult.then(
              asyncResult => {
                actionWrapper.success = true;
                actionWrapper.executing = false;

                store.dispatch({
                  type: actionPath,
                  [actionKey]: k,
                  payload: asyncResult
                });
              },
              ex => {
                if (ex === cancellationToken) return;

                actionWrapper.executing = false;
                actionWrapper.failed = true;
                actionWrapper.error = ex;
                dispatchStatus();
              }
            );
          } else {
            actionWrapper.success = true;

            // handle sync action call
            store.dispatch({
              type: actionPath,
              [actionKey]: k,
              payload: actionResult
            });
          }

          return actionResult;
        };

        Object.assign(actionWrapper, {
          success: undefined,
          failed: undefined,
          executing: false,
          with: options => (...args) => {
            actionWrapper.options = options;
            return actionWrapper(...args);
          }
        });

        actionWrappers = set(pathToLens(actionPath), actionWrapper, actionWrappers);
      } else {
        registerActions(k, x);
      }
    }, model);
  }

  const app = {
    /**
     * create provider
     */
    Provider: props => <Provider store={store}>{props.children}</Provider>,
    /**
     * connect component
     */
    connect(component, mapper = noop) {
      return connect(state => ({ state }), null, ({ state }, dispatchProps, ownProps) => mapper(state, actionWrappers, ownProps) || ownProps)(component);
    },
    /**
     * register single action
     */
    action(key, action, options) {
      registerActions(null, set(pathToLens(key), [action, options], {}));
      return app;
    },
    /**
     * add custom reducers. This is helpful for 3rd lib which need reducer (Router, Log...)
     */
    reducers(value) {
      customReducers = combineReducers(value);
      return app;
    },
    /**
     * dispatch custom action
     */
    dispatch(...args) {
      store.dispatch(...args);
      return app;
    },
    subscribe(...args) {
      store.subscribe(...args);
      return app;
    },
    /**
     * register multiple actions
     */
    actions(model) {
      registerActions(null, model);
      return app;
    }
  };

  return app;
}
