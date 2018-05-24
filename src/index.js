import React from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import app from './app';

render(
  <app.Provider>
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <Hello name="CodeSandbox" />
        </div>
      </div>
    </div>
  </app.Provider>,
  document.getElementById('root')
);
