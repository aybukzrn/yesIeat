import React from 'react'
import './KullaniciBilgilerimContent.css'
import { useState } from 'react';


const PasswordInput = ({ value, onChange, placeholder, isVisible, toggleVisibility }) => {
  return (
    <div className="form-group">
      <div className="password-input-container">
        <input
          type={isVisible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
        />

        <span onClick={toggleVisibility} className="password-toggle-icon">
          <img
            src={isVisible ? '/assets/LoginPages/closedeye.png' : '/assets/LoginPages/openeye.png'}
            alt="Şifreyi göster/gizle"
            className="password-toggle-img"
          />
        </span>
      </div>
    </div>
  );
};


const KullaniciBilgilerimContent = () => {

  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [isCurrentVisible, setIsCurrentVisible] = useState(false);
  const [isNewVisible, setIsNewVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  

  return (

    <form>
      <div className="personal-information">
        <div className="user-information">
          <h3>Hesap Yönetimi</h3>
          <div className="name">
            <div className="ui-form-group">

              <input type="text" placeholder="Adınız" />
            </div>

            <div className="ui-form-group">

              <input type="text" placeholder="Soyadınız" />
            </div>

          </div>

          <div className="ui-form-group">

          <input type="email" placeholder="E-Posta Adresiniz" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="ui-form-group">

            <input type="tel" placeholder="Telefon Numaranız" />
          </div>
          <button type="submit" className="save-button">Bilgileri Kaydet</button>
        </div>

        <div className="password">
          <h3>Şifre Değişikliği</h3>

          <PasswordInput
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Mevcut Şifre"
            isVisible={isCurrentVisible}
            toggleVisibility={() => setIsCurrentVisible(!isCurrentVisible)}
          />

          
          <PasswordInput
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Yeni Şifreniz"
            isVisible={isNewVisible}
            toggleVisibility={() => setIsNewVisible(!isNewVisible)}
          />

          
          <PasswordInput
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Yeni Şifreniz (Tekrar)"
            isVisible={isConfirmVisible}
            toggleVisibility={() => setIsConfirmVisible(!isConfirmVisible)}
          />
          <button type="submit" className="change-password-button">Şifreyi Değiştir</button>
        </div>

      </div>
    </form>


  )
}

export default KullaniciBilgilerimContent
