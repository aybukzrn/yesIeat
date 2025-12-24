import React, { useState, useEffect } from 'react'
import './KullaniciBilgilerimContent.css'


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
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [isCurrentVisible, setIsCurrentVisible] = useState(false);
  const [isNewVisible, setIsNewVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Kullanıcı bilgilerini yükle
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = localStorage.getItem('user');
        if (!userData) {
          setMessage({ type: 'error', text: 'Giriş yapmanız gerekiyor.' });
          setIsLoading(false);
          return;
        }

        const user = JSON.parse(userData);
        if (!user || !user.id) {
          setMessage({ type: 'error', text: 'Kullanıcı bilgisi bulunamadı.' });
          setIsLoading(false);
          return;
        }

        const response = await fetch(`/api/user/profile?userId=${user.id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Kullanıcı bilgileri yüklenirken bir hata oluştu.');
        }

        setName(data.user.name || '');
        setSurname(data.user.surname || '');
        setEmail(data.user.email || '');
        setPhone(data.user.phone || '');
      } catch (err) {
        console.error('Kullanıcı bilgisi yükleme hatası:', err);
        setMessage({ type: 'error', text: err.message || 'Kullanıcı bilgileri yüklenirken bir hata oluştu.' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Kullanıcı bilgilerini kaydet
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setMessage({ type: '', text: '' });

      const userData = localStorage.getItem('user');
      if (!userData) {
        setMessage({ type: 'error', text: 'Giriş yapmanız gerekiyor.' });
        return;
      }

      const user = JSON.parse(userData);
      if (!user || !user.id) {
        setMessage({ type: 'error', text: 'Kullanıcı bilgisi bulunamadı.' });
        return;
      }

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name,
          surname,
          email,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Bilgiler güncellenirken bir hata oluştu.');
      }

      // localStorage'daki kullanıcı bilgisini güncelle
      localStorage.setItem('user', JSON.stringify(data.user));
      sessionStorage.setItem('userName', data.user.name);
      sessionStorage.setItem('userSurname', data.user.surname);

      setMessage({ type: 'success', text: 'Bilgileriniz başarıyla güncellendi.' });
    } catch (err) {
      console.error('Bilgi güncelleme hatası:', err);
      setMessage({ type: 'error', text: err.message || 'Bilgiler güncellenirken bir hata oluştu.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Şifre değiştir
  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      setIsChangingPassword(true);
      setMessage({ type: '', text: '' });

      if (newPassword !== confirmNewPassword) {
        setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor.' });
        return;
      }

      if (newPassword.length < 6) {
        setMessage({ type: 'error', text: 'Şifre en az 6 karakter olmalıdır.' });
        return;
      }

      const userData = localStorage.getItem('user');
      if (!userData) {
        setMessage({ type: 'error', text: 'Giriş yapmanız gerekiyor.' });
        return;
      }

      const user = JSON.parse(userData);
      if (!user || !user.id) {
        setMessage({ type: 'error', text: 'Kullanıcı bilgisi bulunamadı.' });
        return;
      }

      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Şifre değiştirilirken bir hata oluştu.');
      }

      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setMessage({ type: 'success', text: 'Şifreniz başarıyla değiştirildi.' });
    } catch (err) {
      console.error('Şifre değiştirme hatası:', err);
      setMessage({ type: 'error', text: err.message || 'Şifre değiştirilirken bir hata oluştu.' });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Yükleniyor...</div>;
  }

  return (
    <div>
      {message.text && (
        <div
          style={{
            padding: '10px',
            marginBottom: '20px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            borderRadius: '4px',
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSaveProfile}>
        <div className="personal-information">
          <div className="user-information">
            <h3>Hesap Yönetimi</h3>
            <div className="name">
              <div className="ui-form-group">
                <input
                  type="text"
                  placeholder="Adınız"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="ui-form-group">
                <input
                  type="text"
                  placeholder="Soyadınız"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="ui-form-group">
              <input
                type="email"
                placeholder="E-Posta Adresiniz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="ui-form-group">
              <input
                type="tel"
                placeholder="Telefon Numaranız"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button type="submit" className="save-button" disabled={isSaving}>
              {isSaving ? 'Kaydediliyor...' : 'Bilgileri Kaydet'}
            </button>
          </div>

          <div className="password">
            <h3>Şifre Değişikliği</h3>
            <form onSubmit={handleChangePassword}>
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
              <button type="submit" className="change-password-button" disabled={isChangingPassword}>
                {isChangingPassword ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
              </button>
            </form>
          </div>
        </div>
      </form>

      <div className="delete-account">
        <h3>Hesap Kaldırma</h3>
        <p>Hesabınızı silerseniz, tüm kişisel verileriniz kalıcı olarak silinecektir. Bu işlemi geri alamazsınız.</p>
        <button type="button" className="delete-account-button">Hesabı Sil</button>
      </div>
    </div>
  )
}

export default KullaniciBilgilerimContent
