import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import './index.css';
import App from './App.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import Store from './Store/Store.js';
import SignUpPage from './Pages/SignupPage.jsx';
import Trades from './Pages/Trades.jsx'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={Store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<App />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/trades" element={<Trades />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);


