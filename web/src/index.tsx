import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


ReactDOM.render(
  <React.StrictMode> 
    <App /> {/* a função da app.tsx virou uma tag  */}
  </React.StrictMode>,
  document.getElementById('root') 
);
/* root == do index.html  */