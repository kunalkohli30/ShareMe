import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.render(
  <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}>
    <Router>
      <App />
    </Router>
  </GoogleOAuthProvider>,
  document.getElementById('root')
);
