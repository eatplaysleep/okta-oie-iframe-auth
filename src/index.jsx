/** @format */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './styles/index.css';
import { HelmetProvider } from 'react-helmet-async';
import reportWebVitals from './reportWebVitals';

/**
 * Root of react site
 *
 * Imports Helment provider for the page head
 * And App which defines the content and navigation
 */

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <Router>
        <App />
      </Router>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://vitejs.dev/guide/api-hmr.html
// if (import.meta.hot) {
// 	import.meta.hot.accept();
// }

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
