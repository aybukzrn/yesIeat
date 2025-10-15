import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Sayfaları içe aktarın
import Home from './pages/Home';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import Account from './pages/Account';

function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/account" element={<Account />} />

      
      
    </Routes>
  );
}

export default App;