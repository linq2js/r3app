import React from 'react';
import NameTextbox from './NameTextbox';
import app from './app';

export default app.connect(
  ({ count, lazyValue }, { startCountTimer, resetCount, newAction, loadModule, lazyCall }) => ({
    count,
    lazyValue,
    startCountTimer,
    resetCount,
    newAction,
    loadModule,
    lazyCall,
    loading: loadModule.executing,
    executing: lazyCall.executing
  }),
  ({ name, count, lazyValue, startCountTimer, resetCount, newAction, loadModule, lazyCall, executing, loading }) => (
    <div>
      {console.log('render', name, count)}
      <h1>
        Hello {name} {count}!
      </h1>
      <NameTextbox />
      <h3 onClick={lazyCall} style={{ cursor: 'pointer' }}>
        {lazyValue} {(executing && 'executing') || 'not executed'}
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
  )
);
