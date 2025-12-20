import React, { useState } from 'react';
import './AdminLogin.css'

const AdminLogin = () => {
  const [ownername, setOwnername] = useState('');
  const [password, setPassword] = useState('');

    const handleLoginSubmit = async (event) => {
    event.preventDefault();

    try{
      const res = await fetch('/api/admin/login', {
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ ownername, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || 'Giriş başarısız.');
        return;
      }

      localStorage.setItem('admin', JSON.stringify(data.admin));
      alert(`Hoş geldiniz ${data.admin.name}!`);
      sessionStorage.setItem('adminLoggedIn', 'true');
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Giriş hatası:', err);
      alert('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
    }
  };

  return (
      <div className="adminlogin">
        <div className="admin-header">
            <img src="/assets/LoginPages/logo.png" className="adminlogin-logo" alt="Logo" />
            <h2>Yönetici Girişi</h2>
        </div>
        <form onSubmit={handleLoginSubmit}>
          <div className="admin-input-group">
            <label>Kullanıcı Adı</label>
            <input 
              type="text" 
              placeholder="Kullanıcı adınızı girin" 
              className='admin-text'
              value={ownername}
              onChange={(e) => setOwnername(e.target.value)}
              required
            />
          </div>
          <div className="admin-input-group">
            <label>Şifre</label>
            <input 
              type="password" 
              placeholder="Şifrenizi girin" 
              className='admin-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="admin-button-group">
          <button type="submit" className="adminlogin-button">Giriş Yap</button>
          </div>
        </form>
      </div>
  )
}

export default AdminLogin
