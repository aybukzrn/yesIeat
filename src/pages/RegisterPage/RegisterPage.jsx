import React, { useState } from 'react';
import './RegisterPage.css';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };
  const [passwordError, setPasswordError] = useState(''); 
    const handleRegisterSubmit = (event) => {
    event.preventDefault();

    setPasswordError('');

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
        setPasswordError(
        'Şifre en az 8 karakter olmalı, büyük/küçük harf ve rakam içermelidir.'
        );
        return;
    }

    if (password !== confirmPassword) {
        setPasswordError('Girdiğiniz şifreler uyuşmuyor!');
        return;
    }

    console.log('Kayıt başarılı! Bilgiler:', { username, email, password });
    };
  return (
  <div className="login-page-container">
    <div className="login-form-container">

      <img src="/assets/LoginPages/logo.png" alt="Uygulama Logosu" className="form-logo" />

      <h2>Kayıt Ol</h2>

      <form onSubmit={handleRegisterSubmit}>
        {/* ...Kayıt sayfasının inputları... */}
        {/* Buranın içini kendi kodunla doldurabilirsin, önemli olan dış yapı */}
        {/* Veya bir önceki adımdaki tam RegisterPage kodunu kullanabilirsin */}
        <div className="form-group">
            <label htmlFor="username">Kullanıcı Adı</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Bir kullanıcı adı belirleyin' required />
        </div>
        <div className="form-group">
            <label htmlFor="email">E-posta Adresi</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Geçerli bir E-posta adresi giriniz' required />
        </div>
        <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <div className="password-input-container">
                <input type={isPasswordVisible ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifrenizi giriniz" required />
                <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                    <img src={isPasswordVisible ? '/assets/LoginPages/closedeye.png' : '/assets/LoginPages/openeye.png'} alt="Toggle password visibility" className="password-toggle-img" />
                </span>
            </div>
        </div>
        <div className="form-group">
            <label htmlFor="confirmPassword">Şifreyi Onayla</label>
            <div className="password-input-container">
                <input type={isConfirmPasswordVisible ? 'text' : 'password'} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Şifrenizi tekrar giriniz" required />
                <span onClick={toggleConfirmPasswordVisibility} className="password-toggle-icon">
                    <img src={isConfirmPasswordVisible ? '/assets/LoginPages/closedeye.png' : '/assets/LoginPages/openeye.png'} alt="Toggle password visibility" className="password-toggle-img" />
                </span>
            </div>
        </div>
        {passwordError && <div className="error-message">{passwordError}</div>}
        <button type="submit" className="register-button">Kayıt Ol</button>
      </form>

    </div>
  </div>
);
};
export default RegisterPage;