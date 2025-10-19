import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css'; 

// Fonksiyon burada başlıyor
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    console.log('Giriş bilgileri gönderildi:');
    console.log('Email:', email);
    console.log('Şifre:', password);
  };

  // HATA BURADAYDI: Bu 'return' ifadesi fonksiyonun dışında kalmıştı.
  // Şimdi doğru yerde, fonksiyonun içinde.
  return (
    <div className="login-page-container">
      <div className="login-form-container">

        <img src="/assets/LoginPages/logo.png" alt="Uygulama Logosu" className="form-logo" />

        <h2>Giriş Yap</h2>

        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-posta Adresi</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Geçerli bir E-posta adresi giriniz'
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <div className="password-input-container">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifrenizi giriniz"
                  required
                />
                <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                  <img 
                      src={isPasswordVisible ? '/assets/LoginPages/closedeye.png' : '/assets/LoginPages/openeye.png'} 
                      alt="Toggle password visibility" 
                      className="password-toggle-img"
                  />
                </span>
            </div>
          </div>

          <button type="submit" className="login-button">
            Giriş Yap
          </button>
          <Link to="/register" className="signup-button">
            Kayıt Ol
          </Link>
        </form>

      </div>
    </div>
  );
// Fonksiyonun kapanış parantezi burada olmalı
};

export default LoginPage;