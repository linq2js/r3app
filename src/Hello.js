import React from 'react';
import NameTextbox from './NameTextbox';
import app from './app';

const mapper = ({ count, lazyValue }, { startCountTimer, resetCount, newAction, loadModule, lazyCall }) => ({
  count,
  lazyValue,
  startCountTimer,
  resetCount,
  newAction,
  loadModule,
  lazyCall,
  loading: loadModule.executing,
  executing: lazyCall.executing,
  test: ['aaaaaaaaaaa', {}]
});

const prefetch = [({ lazyValue }) => lazyValue, value => (value % 2 === 0 ? import('./ModuleA') : import('./ModuleB'))];

const view = ({
  $fetch,
  name,
  count,
  lazyValue,
  startCountTimer,
  resetCount,
  newAction,
  loadModule,
  lazyCall,
  executing,
  loading
}) => (
  <div>
    {$fetch.status}
    <hr />
    {JSON.stringify($fetch.payload)}
    {console.log('[render]', name, count)}
    <h1>
      Hello {name} {count}!
    </h1>
    <NameTextbox />
    <h3 onClick={lazyCall} style={{ cursor: 'pointer' }}>
      ({lazyValue}) {(executing && 'Increasing...') || 'Click to increase'}
    </h3>
    <button className="btn btn-primary" onClick={startCountTimer}>
      Count Timer
    </button>{' '}
    <button className="btn btn-warning" onClick={resetCount}>
      Reset Count
    </button>{' '}
    {newAction ? (
      <button className="btn btn-success" onClick={newAction}>
        New Action
      </button>
    ) : loading ? (
      <button className="btn btn-default" disabled={true}>
        Loading ...
      </button>
    ) : (
      <button className="btn btn-default" onClick={loadModule}>
        Load Module
      </button>
    )}
  </div>
);

export default app.connect(mapper, prefetch, view);
