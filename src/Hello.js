import React from "react";
import NameTextbox from "./NameTextbox";
import app from "./app";

export default app.connect(
  ({
    name,
    count,
    lazyValue,
    startCountTimer,
    resetCount,
    newAction,
    loadModule,
    lazyCall,
    executing
  }) => (
    <div>
      {console.log("render", name, count)}
      Hello {name} {count}!
      <NameTextbox />
      <h3 onClick={lazyCall} style={{ cursor: "pointer" }}>
        {lazyValue} {(executing && "executing") || "not executed"}
      </h3>
      <button onClick={startCountTimer}>Count Timer</button>
      <button onClick={resetCount}>Reset Count</button>
      {newAction ? (
        <button onClick={newAction}>New Action</button>
      ) : (
        <button onClick={loadModule}>Load Module</button>
      )}
    </div>
  ),
  (
    { count, lazyValue },
    { startCountTimer, resetCount, newAction, loadModule, lazyCall }
  ) => ({
    count,
    lazyValue,
    startCountTimer,
    resetCount,
    newAction,
    loadModule,
    lazyCall,
    executing: lazyCall.executing
  })
);
