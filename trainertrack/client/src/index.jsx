import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// Removed the CSS import that was causing errors

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);