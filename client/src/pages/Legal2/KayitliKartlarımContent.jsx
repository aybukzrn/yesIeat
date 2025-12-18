import React, { useState } from 'react';
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
    default: return '/assets/AccountPage/default-bank.png';
  }
};

// Brand Logo Getirici
const getBrandLogo = (brandName) => {
  if (brandName === 'visa') return '/assets/AccountPage/visa-brand.svg';
  if (brandName === 'troy') return '/assets/AccountPage/troy-logo.png';
  if (brandName == 'mastercard') return 'mastercard-logo.webp';
};



const CardDetail = ({ card, onEdit, onDelete }) => {
  const maskedNumber = `**** **** **** ${card.cardNumber.slice(-4)}`;
  return (
    <div className="card-form">
      <div className="head">
        <div className="name"><h2>{card.alias}</h2></div>
        <div className="right-card">
          <div className="card">
            <div className="card-logo">

              <img src={getBankLogo(card.bank)} alt={card.bank} />
            </div>
            <div className="card-value"><span>{maskedNumber}</span></div>
          </div>
          <div className="card-brand">
            <img src={getBrandLogo(card.brand)} alt={card.brand} />
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
  const [cards, setCards] = useState([
    { id: 1, alias: 'Şahsi Kartım', holderName: 'Aybüke Zeren', bank: 'ziraat', cardNumber: '4600123412341234', brand: 'visa' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');

  const [formData, setFormData] = useState({
    id: null,
    alias: '',
    holderName: '',
    cardNumber: '',
    bank: '',
    brand: ''
  });


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
      return newData;
    });
  };

  const openAddModal = () => {
    setModalType('add');
    setFormData({ id: null, alias: '', holderName: '', cardNumber: '', bank: '', brand: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (card) => {
    setModalType('edit');
    setFormData(card);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!formData.bank) {
      alert("Lütfen bankanızı seçin (Otomatik algılanamadı).");
      return;
    }

    if (modalType === 'add') {
      const newCard = { ...formData, id: Date.now() };
      setCards([...cards, newCard]);
    } else {
      setCards(cards.map(card => card.id === formData.id ? formData : card));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => setCards(cards.filter(c => c.id !== id));

  return (
    <div className="carts">
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
              maxLength="16"
              placeholder="0000 0000 0000 0000"
              required
            />

          </div>

          <div className="form-group">
            <label>Ad Soyad</label>
            <input type="text" name="holderName" value={formData.holderName} onChange={handleInputChange} required
              placeholder="Aybüke Zeren" />

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

          <button type="submit" className="card-save-btn">Kaydet</button>
        </form>
      </Modal>
    </div>
  );
};

export default KayitliKartlarımContent;