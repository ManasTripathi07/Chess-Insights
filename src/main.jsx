// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Ensure you have an App.jsx component
import './index.css'; // Your Tailwind CSS or global styles

// Create root and render App component into the DOM element with id 'root'
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
