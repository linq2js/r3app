import app from './app';
import React from 'react';

export default app.connect(
  ({ name }, { changeName }) => ({
    name,
    changeName
  }),
  ({ name, changeName }) => (
    <div className="form-group">
      <input
        className="form-control"
        style={{ width: 200, backgroundColor: name.length > 10 ? 'red' : '' }}
        onChange={e => changeName(e.target.value)}
        value={name}
      />
      <hr />
      <b>{name}</b>
    </div>
  )
);
