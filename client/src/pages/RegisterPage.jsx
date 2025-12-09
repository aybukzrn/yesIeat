import React, { useState } from 'react';
import './RegisterPage.css';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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

    const handleRegisterSubmit = async (e) => {
      e.preventDefault();
    
      // Şifre kontrolü
      if (password !== confirmPassword) {
        setPasswordError('Şifreler eşleşmiyor!');
        return;
      }
      setPasswordError('');
    
      try {
        const res = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            name: firstName,
            surname: lastName,
            phone: null, // telefon alanı yoksa null gönder
          }),
        });
    
        const data = await res.json();
    
        if (!res.ok || !data.success) {
          alert(data.message || 'Kayıt başarısız.');
          return;
        }
    
        alert('Kayıt başarılı, giriş yapabilirsiniz.');
        window.location.href = '/';
      } catch (err) {
        console.error('Register hatası:', err);
        alert('Sunucu hatası. Lütfen tekrar deneyin.');
      }
    };

  
  return (
  <div className="login-page-container">
     <div className="chef-gorseli2">
        <img
          src={"/assets/LoginPages/chef1.png"}
          alt="Restoran yemeği"
          className="chef-gorseli"
        />
      </div>

    <div className="login-form-container2">

      <img src="/assets/LoginPages/logo.png" alt="Uygulama Logosu" className="form-logo" />

      <h2>Kayıt Ol</h2>

      <form onSubmit={handleRegisterSubmit}>
        
        <div className="name-input-container" style={{display: 'flex', justifyContent: 'space-between'}} >
        <div className="form-group">
            <label htmlFor="firstName">İsim</label>
            <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder='İsiminizi giriniz' required />
        </div>

        <div className="form-group">
            <label htmlFor="lastName">Soyisim</label>
            <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder='Soyisminizi giriniz' required />
        </div>
        </div>
        <div className="form-group">
            <label htmlFor="email">E-posta Adresi</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Geçerli bir E-Posta adresi giriniz' required />
        </div>
        <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <div className="password-input-container">
                <input type={isPasswordVisible ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifrenizi giriniz" required />
                <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                    <img src={isPasswordVisible ? '/assets/LoginPages/openeye.png' : '/assets/LoginPages/closedeye.png'} alt="Toggle password visibility" className="password-toggle-img" />
                </span>
            </div>
        </div>
        <div className="form-group">
            <label htmlFor="confirmPassword">Şifreyi Onayla</label>
            <div className="password-input-container">
                <input type={isConfirmPasswordVisible ? 'text' : 'password'} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Şifrenizi tekrar giriniz" required />
                <span onClick={toggleConfirmPasswordVisibility} className="password-toggle-icon">
                    <img src={isConfirmPasswordVisible ? '/assets/LoginPages/openeye.png' : '/assets/LoginPages/closedeye.png'} alt="Toggle password visibility" className="password-toggle-img" />
                </span>
            </div>
        </div>
        {passwordError && <div className="error-message">{passwordError}</div>}
        <button type="submit" className="register-button">Kayıt Ol</button>

        <div className="warning">
            <Link to="/" className="register-link">
              Zaten hesabınız var mı? Giriş Yapın
            </Link>
          </div>
      </form>

    </div>
  </div>
);
};
export default RegisterPage;