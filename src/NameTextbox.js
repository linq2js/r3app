import app from './app';
import React from 'react';

const mapper = ({ name }, { changeName }) => ({
  name,
  changeName
});

const view = ({ name, changeName }) => (
  <div className="form-group">
    <input className="form-control" onChange={e => changeName(e.target.value)} value={name} />
    <hr />
    <h3>
      Textbox value ({name.length}) : <span style={{ color: 'yellow' }}>{name}</span>
    </h3>
  </div>
);

export default app.connect(mapper, view);
