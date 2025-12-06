import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import { FaTimes } from 'react-icons/fa';
import './Cart.css';

const savedUserInfo = {
  sokak: 'Örnek Mah. Atatürk Cad.',
  apartman: 'No: 42',
  daire: 'Daire: 8',
  kat: '4',
  telefon: '+905551234567',
  email: 'selinayturksal@gmail.com',
  ad: 'Selinay',
  soyad: 'Türksal',
  cep: '+905551234567',
};

const Cart = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sokak: '', apartman: '', daire: '', kat: '', sirket: '', telefon: '', not: '',
    email: 'selinayturksal@gmail.com', ad: 'Selinay', soyad: 'Türksal', cep: ''
  });
  const [errors, setErrors] = useState({});
  const [selectedDelivery, setSelectedDelivery] = useState('standart');
  const [selectedTip, setSelectedTip] = useState(null);
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "2'li Doritoslu Mega Çiğ Köfte Menü", price: 349.99, quantity: 1 }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const useSavedInfo = () => {
    setFormData(prev => ({ ...prev, ...savedUserInfo }));
  };

  const validateForm = (fields) => {
    const newErrors = {};
    fields.forEach(field => {
      if (field === 'delivery' || field === 'tip') return;

      if (!formData[field] || formData[field].trim() === '') {
        newErrors[field] = 'Bu alan zorunludur.';
      }
    });
    if (fields.includes('delivery') && !selectedDelivery) newErrors.delivery = 'Teslimat seçeneği zorunludur.';
    if (fields.includes('tip') && selectedTip === null) newErrors.tip = 'Lütfen bir bahşiş seçeneği belirtin.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCompleteOrder = () => {
    const allFields = ['sokak', 'apartman', 'daire', 'telefon', 'cep', 'delivery', 'tip'];
    if (validateForm(allFields)) {
      navigate('/odeme', { state: { totalAmount: total } });
    } else {
      console.log("Doğrulama başarısız. Hatalar:", errors);
      alert("Lütfen tüm alanları (Bahşiş dahil) doldurunuz.");
      window.scrollTo(0, 0);
    }
  };


  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Navbar2 />
      <div className="cart-page-container">

        <div className="checkout-details">
          <h2 className="main-title">İncele ve siparişini ver</h2>
          <div className="info-card">
            <div className="card-header">
              <h3>Teslimat Adresi</h3>
            </div>
            <button onClick={useSavedInfo} className="btn btn-secondary">Kayıtlı Adresimi Kullan</button>
            <div className="form-grid">
              <input name="sokak" value={formData.sokak} onChange={handleInputChange} type="text" placeholder="Cadde ve sokak" className={errors.sokak ? 'input-error' : ''} />
              {errors.sokak && <span className="error-text">{errors.sokak}</span>}
              <input name="apartman" value={formData.apartman} onChange={handleInputChange} type="text" placeholder="Apartman" className={errors.apartman ? 'input-error' : ''} />
              {errors.apartman && <span className="error-text">{errors.apartman}</span>}
              <input name="daire" value={formData.daire} onChange={handleInputChange} type="text" placeholder="Daire" className={errors.daire ? 'input-error' : ''} />
              {errors.daire && <span className="error-text">{errors.daire}</span>}
              <input name="telefon" value={formData.telefon} onChange={handleInputChange} type="tel" placeholder="+90 Telefon Numarası" className={`full-width ${errors.telefon ? 'input-error' : ''}`} />
              {errors.telefon && <span className="error-text full-width">{errors.telefon}</span>}
            </div>
            <textarea name="not" value={formData.not} onChange={handleInputChange} className="note-textarea" placeholder="Kuryeye not..."></textarea>
            <button className="btn btn-secondary" onClick={() => validateForm(['sokak', 'apartman', 'daire', 'telefon'])}>Kaydet ve Devam Et</button>
          </div>

          <div className="info-card">
            <h3>Teslimat seçenekleri</h3>
            {errors.delivery && <span className="error-text">{errors.delivery}</span>}
            <div className={`radio-option ${selectedDelivery === 'standart' ? 'active' : ''}`} onClick={() => setSelectedDelivery('standart')}>
              <label><strong>Standart</strong> 20 - 35 dk.</label>
            </div>
            <div className={`radio-option ${selectedDelivery === 'oncelikli' ? 'active' : ''}`} onClick={() => setSelectedDelivery('oncelikli')}>
              <label><strong>Öncelikli</strong> 15 - 30 dk. <span>+ 39,99 TL</span></label>
            </div>
          </div>

          <div className="info-card">
            <h3>Kişisel Bilgiler</h3>
            <input name="adSoyad" value={formData.adSoyad} onChange={handleInputChange} type="text" placeholder="İsim Soyisim" className={errors.adSoyad ? 'input-error' : ''} />
            {errors.adSoyad && <span className="error-text">{errors.adSoyad}</span>}
            <input name="cep" value={formData.cep} onChange={handleInputChange} type="tel" placeholder="Cep telefonu" className={errors.cep ? 'input-error' : ''} />
            {errors.cep && <span className="error-text">{errors.cep}</span>}
            <button className="btn btn-secondary" onClick={() => validateForm(['cep'])}>Kaydet</button>
          </div>

          <div className="info-card">
            <h3>Bahşiş</h3>
            {errors.tip && <span className="error-text">{errors.tip}</span>}
            <div className="tip-options">
              {['Şimdi değil', 10, 20, 30].map((tip, index) => (
                <button key={index}
                  className={`btn btn-tip ${selectedTip === tip ? 'active' : ''}`}
                  onClick={() => setSelectedTip(tip)}>
                  {typeof tip === 'number' ? `${tip.toFixed(2)} TL` : tip}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary btn-complete-order" onClick={handleCompleteOrder}>Siparişi Tamamla</button>
        </div>

        <div className="order-summary-container">
          <div className="order-summary-card">
            <h3>Siparişiniz</h3>

            {cartItems.length === 0 ? (
              <p className="empty-cart-message">Sepetinizde ürün bulunmamaktadır.</p>
            ) : (
              <>
                <h4>Ustam Çiğ Köfte</h4>
                {cartItems.map(item => (
                  <div className="summary-item" key={item.id}>
                    <div className="item-info">
                      <span>{item.quantity} x {item.name}</span>
                    </div>
                    <div className="item-actions">
                      <span>{item.price.toFixed(2)} TL</span>
                      <button onClick={() => handleRemoveItem(item.id)} className="btn-remove-item">
                        <FaTimes />
                      </button>
                    </div>
                  </div>
                ))}
                <hr />
                <div className="summary-row total">
                  <span>Toplam</span>
                  <span>{total.toFixed(2)} TL</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;