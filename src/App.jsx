import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Sayfaları içe aktarın
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Account from './pages/Account';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import IntroAnimation from './components/IntroAnimation';
import Dashboard from './admin_page/Dashboard';


function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3500); // Süreyi değiştir

    return () => clearTimeout(timer);
  }, []); 

  if (showIntro) {
    return <IntroAnimation />;
  }
  return (
    
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/account" element={<Account />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/dashboard" element={<Dashboard />} />
      


    </Routes>
  );
}

export default App;