import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ThalassemiaScreening from './App';
import Blood from './Blood';
import Login from './Login';
import AdminUsers from './Admin';
import ImportHospitals from './Upload';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from './Profile';
import { createRoot } from 'react-dom/client';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/Blood" element={<Blood />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Admin" element={<AdminUsers />} />
      <Route path="/Upload" element={<ImportHospitals />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/ThalassemiaScreening" element={<ThalassemiaScreening />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
