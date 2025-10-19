import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Sayfaları içe aktarın
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Account from './pages/Account';
import Contact from './pages/Contact';

function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/account" element={<Account />} />
      <Route path="/contact" element={<Contact />} />


      
      
    </Routes>
  );
}

export default App;