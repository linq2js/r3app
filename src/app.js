import * as r3app from './r3app';

function loadState() {}

function saveState() {}

export default r3app
  .create({
    name: 'Hung',
    count: 0,
    lazyValue: 1
  })
  .actions({
    name: [value => value, 'changeName'],

    resetCount: () => (getState, actions) => actions.$({ count: 0 }),

    loadModule: [
      () =>
        new Promise(resolve =>
          setTimeout(() => import(/* webpackPrefetch: true */ './LazyLoadModule').then(resolve), 3000)
        ),
      {
        single: true,
        dispatchStatus: true
      }
    ],

    startCountTimer: () => (getState, actions) => {
      if (getState().startCountTimer) {
        clearInterval(getState().startCountTimer);
        return;
      }
      return setInterval(() => actions.$({ count: getState().count + 1 }), 10);
    }
  })
  .action(
    'lazyValue',
    () => (getState, actions) =>
      new Promise((resolve, reject) =>
        setTimeout(() => {
          resolve(getState().lazyValue + 1);
        }, 2000)
      ),
    {
      name: 'lazyCall',
      single: true,
      dispatchStatus: true
    }
  );
