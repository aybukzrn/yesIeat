import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try{
      const res = await fetch('/api/login', {
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password}),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || 'Giriş başarısız.');
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      alert(`Hoş geldin ${data.user.name} !`);
      sessionStorage.setItem('userLoggedIn', 'true');
      sessionStorage.setItem('userName', data.user.name);
      sessionStorage.setItem('userSurname', data.user.surname);
      window.location.href = '/';
    } catch (err) {
      console.error('Giriş hatası:', err);
      alert('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
    }
  };


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
                  src={isPasswordVisible ?'/assets/LoginPages/closedeye.png' :  '/assets/LoginPages/openeye.png'}
                  alt="Toggle password visibility"
                  className="password-toggle-img"
                />
              </span>
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="login-button">
              Giriş Yap
            </button>
          </div>

          <div className="warning">
            <Link to="/register" className="register-link">
              Hesabınız yok mu? Kaydolun
            </Link>
          </div>
        </form>

      </div>

      <div className="chef-gorseli">
        <img
          src={"/assets/LoginPages/chef1.png"}
          alt="Restoran yemeği"
          className="chef-gorseli"
        />
      </div>

    </div>
  );
};

export default LoginPage;