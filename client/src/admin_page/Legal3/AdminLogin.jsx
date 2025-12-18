import React from 'react'
import './AdminLogin.css'

const AdminLogin = () => {
  return (
      <div className="adminlogin">
        <div className="admin-header">
            <img src="assets/LoginPages/logo.png" className="adminlogin-logo" />
            <h2>Yönetici Girişi</h2>
        </div>
        <form>
          <div className="admin-input-group">
            <label>Kullanıcı Adı</label>
            <input type="text" placeholder="Kullanıcı adınızı girin" className='admin-text' />
          </div>
          <div className="admin-input-group">
            <label>Şifre</label>
            <input type="password" placeholder="Şifrenizi girin" className='admin-password'/>
          </div>
          <div className="admin-button-group">
          <button type="submit" className="adminlogin-button">Giriş Yap</button>
          </div>
        </form>
      </div>
  )
}

export default AdminLogin
