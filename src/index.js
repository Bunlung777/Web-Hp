import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ThalassemiaScreening from './App';
import Blood from './Blood';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ThalassemiaScreening />} />
      <Route path="/Blood" element={<Blood />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
