import React from 'react';
import { render } from 'react-dom';
import Hello from './Hello';
import app from './app';

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center'
};

const Startup = () => (
  <app.Provider>
    <div style={styles}>
      <Hello name="CodeSandbox" />
      <h2>Start editing to see some magic happen {'\u2728'}</h2>
    </div>
  </app.Provider>
);

render(<Startup />, document.getElementById('root'));
