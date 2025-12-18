import React, { useEffect, useState } from 'react';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import Payment from './Payment';
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
  const [formData, setFormData] = useState({
    sokak: '', apartman: '', daire: '', kat: '', sirket: '', telefon: '', not: '',
    email: 'selinayturksal@gmail.com', ad: 'Selinay', soyad: 'Türksal', cep: ''
  });
  const [errors, setErrors] = useState({});
  const [selectedDelivery, setSelectedDelivery] = useState('standart');
  const [selectedTip, setSelectedTip] = useState(null);
  const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  
  // YENİ STATE: Ödeme Yöntemi
  const [paymentMethod, setPaymentMethod] = useState('null'); 

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

  // Sadece KAPIDA ÖDEME için çalışacak fonksiyon
  const handleCompleteOrder = () => {
    const allFields = ['sokak', 'apartman', 'daire', 'telefon', 'cep', 'delivery', 'tip'];
    
    if (validateForm(allFields)) {
        // Burada artık navigate yerine siparişi tamamlama backend isteği veya başarı mesajı olacak
        alert("Siparişiniz 'Kapıda Ödeme' seçeneği ile alındı! Teşekkürler.");
        // Sepeti temizleme işlemleri vb. buraya eklenebilir.
        localStorage.removeItem('cart');
        setCartItems([]);
        window.dispatchEvent(new Event('cartUpdated'));
    } else {
      console.log("Doğrulama başarısız. Hatalar:", errors);
      alert("Lütfen tüm alanları (Bahşiş dahil) doldurunuz.");
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    const syncCart = () => {
      const stored = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(stored);
    };
    syncCart();
    window.addEventListener('cartUpdated', syncCart);
    window.addEventListener('storage', syncCart);
    return () => {
      window.removeEventListener('cartUpdated', syncCart);
      window.removeEventListener('storage', syncCart);
    };
  }, []);

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Navbar2 />
      <div className="cart-page-container">

        <div className="checkout-details">
          
          {/* Adres Bölümü */}
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

          {/* Teslimat Seçenekleri */}
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

          {/* Bahşiş */}
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

          {/*Ödeme Yöntemi Seçimi */}
          <div className="info-card">
            <h3>Ödeme Yöntemi</h3>
            
            <div className={`radio-option ${paymentMethod === 'kapida' ? 'active' : ''}`} onClick={() => setPaymentMethod('kapida')}>
               <label><strong>Kapıda Ödeme</strong> (Nakit veya Kart)</label>
            </div>

            <div className={`radio-option ${paymentMethod === 'kart' ? 'active' : ''}`} onClick={() => setPaymentMethod('kart')}>
               <label><strong>Kredi / Banka Kartı</strong> (Online Ödeme)</label>
            </div>

            {/* Kredi Kartı Seçiliyse Payment Bileşenini Göster */}
            {paymentMethod === 'kart' && (
                <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    {/* Payment bileşenine toplam tutarı prop olarak geçiyoruz */}
                    <Payment totalAmount={total} /> 
                </div>
            )}
          </div>

          {/* Siparişi Tamamla Butonu (Sadece Kapıda Ödeme Seçiliyse Görünür) */}
          {paymentMethod === 'kapida' && (
             <button className="btn btn-primary btn-complete-order" onClick={handleCompleteOrder}>
               Kapıda Ödeme ile Siparişi Tamamla
             </button>
          )}
          
        </div>

        {/* Sağ Taraf: Sipariş Özeti (Değişmedi) */}
        <div className="order-summary-container">
          <div className="order-summary-card">
            <h3>Siparişiniz</h3>
            {cartItems.length === 0 ? (
              <p className="empty-cart-message">Sepetinizde ürün bulunmamaktadır.</p>
            ) : (
              <>
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