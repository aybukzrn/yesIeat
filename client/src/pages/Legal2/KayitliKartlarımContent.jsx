import React, { useState, useEffect } from 'react';
import './KayitliKartlarımContent.css';
import { MdAddCard, MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import Modal from '../../components/Modal';


const detectBankAndBrand = (number) => {
  const cleanNumber = number.replace(/\s/g, '');

  let result = {
    bank: '',
    brand: ''
  };


  // Kart tipi algılama

  if (cleanNumber.startsWith('4')) {
    result.brand = 'visa';
  } else if (cleanNumber.startsWith('5')) {
    result.brand = 'mastercard';
  } else if (cleanNumber.startsWith('9')) {
    result.brand = 'troy';
  }


  const prefix6 = cleanNumber.substring(0, 6);


  if (['444676', '979280', '528208', '658755'].includes(prefix6)) {
    result.bank = 'ziraat';
  } else if (['540709', '517041', '48945501', '979236'].includes(prefix6)) {
    result.bank = 'garanti';
  } else if (['545103', '491206', '540061'].includes(prefix6)) {
    result.bank = 'yapikredi';
  } else {
    result.bank = 'other';
  }

  return result;
};

// Logo Getirici
const getBankLogo = (bankName) => {
  switch (bankName) {
    case 'ziraat': return '/assets/AccountPage/ziraat-logo.webp';
    case 'yapikredi': return '/assets/AccountPage/yapikredi-logo.png';
    case 'garanti': return '/assets/AccountPage/garanti-logo.png';
    case 'isbankasi': return '/assets/AccountPage/isbankasi-logo.png';
    default: return '/assets/AccountPage/ziraat-logo.webp'; // Varsayılan logo
  }
};

// Brand Logo Getirici
const getBrandLogo = (brandName) => {
  if (brandName === 'visa') return '/assets/AccountPage/visa-brand.svg';
  if (brandName === 'mastercard') return '/assets/AccountPage/mastercard-logo.webp';
  if (brandName === 'troy') return '/assets/AccountPage/troy-logo.png';
  return null; // Logo bulunamazsa null döndür
};



const CardDetail = ({ card, onEdit, onDelete }) => {
  // Kart numarasını temizle ve son 4 hanesini al
  const cleanCardNumber = (card.cardNumber || '').replace(/\s/g, '');
  const lastFour = cleanCardNumber.length >= 4 ? cleanCardNumber.slice(-4) : cleanCardNumber;
  const maskedNumber = `**** **** **** ${lastFour}`;
  const bankLogo = getBankLogo(card.bank);
  const brandLogo = getBrandLogo(card.brand);
  
  return (
    <div className="card-form">
      <div className="head">
        <div className="name"><h2>{card.alias}</h2></div>
        <div className="right-card">
          <div className="card">
            <div className="card-logo">
              {bankLogo && <img src={bankLogo} alt={card.bank || 'Banka'} onError={(e) => { e.target.style.display = 'none'; }} />}
            </div>
            <div className="card-value"><span>{maskedNumber}</span></div>
          </div>
          <div className="card-brand">
            {brandLogo && <img src={brandLogo} alt={card.brand || 'Kart'} onError={(e) => { e.target.style.display = 'none'; }} />}
          </div>
        </div>
      </div>
      <div className="delete-card">
        <button onClick={() => onEdit(card)}><FaEdit className='edit-button-icon' />Düzenle</button>
        <button onClick={() => onDelete(card.id)}><MdDeleteForever className='delete-button-icon' />Sil</button>
      </div>
    </div>
  );
};

const KayitliKartlarımContent = () => {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');

  const [formData, setFormData] = useState({
    id: null,
    alias: '',
    holderName: '',
    cardNumber: '',
    expDate: '',
    bank: '',
    brand: ''
  });

  // Kartları yükle
  useEffect(() => {
    const fetchCards = async () => {
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

        const response = await fetch(`/api/user/cards?userId=${user.id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Kartlar yüklenirken bir hata oluştu.');
        }

        setCards(data.cards || []);
      } catch (err) {
        console.error('Kart yükleme hatası:', err);
        setMessage({ type: 'error', text: err.message || 'Kartlar yüklenirken bir hata oluştu.' });
        setCards([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCards();
  }, []);


  // Son kullanma tarihi formatlama fonksiyonu (MM/YY)
  const formatExpDate = (value) => {
    // Sadece rakamları al
    const digits = value.replace(/\D/g, '').slice(0, 4);
    
    if (digits.length === 0) return '';
    if (digits.length <= 2) return digits;
    // 2'den fazla rakam varsa "/" ekle
    return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const newData = { ...prev, [name]: value };

      // EĞER DEĞİŞEN ALAN 'cardNumber' İSE OTOMATİK ALGILAMA YAP
      if (name === 'cardNumber') {
        if (value.length >= 2) {
          const detected = detectBankAndBrand(value);

          if (detected.bank !== 'other') {
            newData.bank = detected.bank;
          }
          newData.brand = detected.brand;
        }
      }

      // EĞER DEĞİŞEN ALAN 'expDate' İSE OTOMATİK FORMATLA
      if (name === 'expDate') {
        newData.expDate = formatExpDate(value);
      }

      return newData;
    });
  };

  const openAddModal = () => {
    setModalType('add');
    setFormData({ id: null, alias: '', holderName: '', cardNumber: '', expDate: '', bank: '', brand: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (card) => {
    setModalType('edit');
    setFormData({
      id: card.id,
      alias: card.alias || '',
      holderName: card.holderName || '',
      cardNumber: card.cardNumber || '',
      expDate: card.expDate || '',
      bank: card.bank || '',
      brand: card.brand || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.holderName || !formData.cardNumber || !formData.expDate) {
      setMessage({ type: 'error', text: 'Lütfen tüm alanları doldurun.' });
      return;
    }

    // Kart numarası validasyonu (sadece rakam, 13-19 karakter)
    const cleanCardNumber = formData.cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      setMessage({ type: 'error', text: 'Kart numarası geçersiz.' });
      return;
    }

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

      // ExpDate'i temizle (sadece rakamlar) ve formatla
      const cleanExpDate = formData.expDate.replace(/\D/g, '');
      if (cleanExpDate.length !== 4) {
        setMessage({ type: 'error', text: 'Son kullanma tarihi geçersiz. (AA/YY formatında olmalı)' });
        setIsSaving(false);
        return;
      }
      const formattedExpDate = `${cleanExpDate.substring(0, 2)}/${cleanExpDate.substring(2, 4)}`;

      if (modalType === 'add') {
        const response = await fetch('/api/user/cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            alias: formData.alias || 'Kartım',
            holderName: formData.holderName,
            cardNumber: cleanCardNumber,
            expDate: formattedExpDate,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Kart eklenirken bir hata oluştu.');
        }

        // Kartları yeniden yükle
        const cardsResponse = await fetch(`/api/user/cards?userId=${user.id}`);
        const cardsData = await cardsResponse.json();
        if (cardsData.success) {
          setCards(cardsData.cards || []);
        }

        setMessage({ type: 'success', text: 'Kart başarıyla eklendi.' });
      } else {
        const response = await fetch(`/api/user/cards/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            alias: formData.alias || 'Kartım',
            holderName: formData.holderName,
            cardNumber: cleanCardNumber,
            expDate: formattedExpDate,
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Kart güncellenirken bir hata oluştu.');
        }

        // Kartları yeniden yükle
        const cardsResponse = await fetch(`/api/user/cards?userId=${user.id}`);
        const cardsData = await cardsResponse.json();
        if (cardsData.success) {
          setCards(cardsData.cards || []);
        }

        setMessage({ type: 'success', text: 'Kart başarıyla güncellendi.' });
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error('Kart kaydetme hatası:', err);
      setMessage({ type: 'error', text: err.message || 'Kart kaydedilirken bir hata oluştu.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu kartı silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
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

      const response = await fetch(`/api/user/cards/${id}?userId=${user.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Kart silinirken bir hata oluştu.');
      }

      // Kartları yeniden yükle
      const cardsResponse = await fetch(`/api/user/cards?userId=${user.id}`);
      const cardsData = await cardsResponse.json();
      if (cardsData.success) {
        setCards(cardsData.cards || []);
      }

      setMessage({ type: 'success', text: 'Kart başarıyla silindi.' });
    } catch (err) {
      console.error('Kart silme hatası:', err);
      setMessage({ type: 'error', text: err.message || 'Kart silinirken bir hata oluştu.' });
    }
  };

  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Yükleniyor...</div>;
  }

  return (
    <div className="carts">
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

      <div className="header">
        <h3>Kayıtlı Kartlarım</h3>
        <div className="add-card">
          <button onClick={openAddModal}><MdAddCard /> Yeni Kart Ekle</button>
        </div>
      </div>

      <div className="card-information">
        {cards.length === 0 ? (
          <p>Henüz kart eklemediniz.</p>
        ) : (
          cards.map(card => (
            <CardDetail key={card.id} card={card} onEdit={openEditModal} onDelete={handleDelete} />
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalType === 'add' ? 'Yeni Kart Ekle' : 'Kartı Düzenle'}>
        <form className="add-card-form" onSubmit={handleSave}>
          <div className="form-group">
            <label>Kart İsmi</label>
            <input type="text" name="alias" value={formData.alias} onChange={handleInputChange} required placeholder="Maaş Kartım" />
          </div>
            <div className="form-group">
              <label>Kart Numarası</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                maxLength="19"
                placeholder="0000 0000 0000 0000"
                required
              />
            </div>

            <div className="form-group">
              <label>Ad Soyad</label>
              <input
                type="text"
                name="holderName"
                value={formData.holderName}
                onChange={handleInputChange}
                required
                placeholder="Aybüke Zeren"
              />
            </div>

            <div className="form-group">
              <label>Son Kullanma Tarihi (AA/YY)</label>
              <input
                type="text"
                name="expDate"
                value={formData.expDate}
                onChange={handleInputChange}
                maxLength="5"
                placeholder="12/25"
                required
              />
            </div>

          <div className="form-row">
            <div className="form-group">
              <label>Banka</label>
              <select name="bank" value={formData.bank} onChange={handleInputChange}>
                <option value="">Seçiniz...</option>
                <option value="ziraat">Ziraat Bankası</option>
                <option value="yapikredi">Yapı Kredi</option>
                <option value="garanti">Garanti BBVA</option>
                <option value="isbankasi">İş Bankası</option>
              </select>
            </div>
            <div className="form-group">
              <label>Kart Tipi</label>
              <input type="text" value={formData.brand.toUpperCase()} disabled style={{ backgroundColor: '#f0f0f0' }} />
            </div>
          </div>

          <button type="submit" className="card-save-btn" disabled={isSaving}>
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default KayitliKartlarımContent;