import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Logs from './pages/Logs';
import Layout from './components/Layout';

function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    if (token) {
      fetch('http://localhost:5000/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.role === 'admin') setAdmin(data);
          else {
            localStorage.removeItem('adminToken');
            setToken(null);
          }
        })
        .catch(() => {
          localStorage.removeItem('adminToken');
          setToken(null);
        });
    }
  }, [token]);

  if (!token || !admin) {
    return <Login setToken={setToken} />;
  }

  return (
    <BrowserRouter>
      <Layout admin={admin} setToken={setToken}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/users" element={<Users />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;