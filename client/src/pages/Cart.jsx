import React, { useEffect, useState } from 'react';
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import Payment from './Payment';
import { FaTimes } from 'react-icons/fa';
import './Cart.css';


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
  const [paymentMethod, setPaymentMethod] = useState(null); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const useSavedInfo = async () => {
    // Giriş kontrolü
    const userData = localStorage.getItem('user');
    const isLoggedIn = sessionStorage.getItem('userLoggedIn');
    
    if (!isLoggedIn || !userData) {
      alert('Giriş yapmanız gerekmektedir.');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (!user || !user.id) {
        alert('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
        return;
      }

      // API'den adresleri çek
      const response = await fetch(`/api/user/addresses?userId=${user.id}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Adresler yüklenirken bir hata oluştu.');
      }

      const addresses = data.addresses || [];

      // Kayıtlı adres yoksa
      if (addresses.length === 0) {
        alert('Kayıtlı adresiniz bulunmamaktadır.');
        return;
      }

      // İlk adresi al (en son eklenen)
      const address = addresses[0];

      // Adresi parse et
      // Format: "Ankara / İlçe, Açık Adres | Telefon"
      let fullAddressText = address.fullAddress || '';
      let phone = '';
      let sokak = '';
      let apartman = '';
      let daire = '';
      let kat = '';

      // Telefon numarasını ayır
      if (fullAddressText.includes(' | ')) {
        const parts = fullAddressText.split(' | ');
        fullAddressText = parts[0] || '';
        phone = parts[1] || '';
      }

      // Şehir ve ilçe bilgisini ayır
      if (fullAddressText.includes(' / ')) {
        const parts = fullAddressText.split(' / ');
        if (parts.length > 1) {
          const districtAndAddress = parts[1];
          const addressParts = districtAndAddress.split(',');
          // İlçe sonrası kısım açık adres
          if (addressParts.length > 1) {
            sokak = addressParts.slice(1).join(',').trim();
          }
        }
      } else {
        // Format yoksa direkt adres olarak kullan
        sokak = fullAddressText;
      }

      // Bina, kat, daire bilgilerini al
      apartman = address.building ? String(address.building) : '';
      kat = address.floor ? String(address.floor) : '';
      daire = address.apartment ? String(address.apartment) : '';

      // FormData'yı güncelle
      setFormData(prev => ({
        ...prev,
        sokak: sokak,
        apartman: apartman,
        daire: daire,
        kat: kat,
        telefon: phone,
        cep: phone,
      }));

      alert('Kayıtlı adresiniz başarıyla yüklendi.');
    } catch (err) {
      console.error('Adres yükleme hatası:', err);
      alert(err.message || 'Adres yüklenirken bir hata oluştu.');
    }
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
  const handleCompleteOrder = async () => {
    // Sepet boş kontrolü
    if (!cartItems || cartItems.length === 0) {
      alert('Sepetinizde ürün bulunmamaktadır.');
      return;
    }

    const allFields = ['sokak', 'apartman', 'daire', 'telefon', 'cep', 'delivery', 'tip'];
    
    if (!validateForm(allFields)) {
      alert("Lütfen tüm alanları (Bahşiş dahil) doldurunuz.");
      window.scrollTo(0, 0);
      return;
    }

    // Kullanıcı bilgisini al
    const userData = localStorage.getItem('user');
    if (!userData) {
      alert('Giriş yapmanız gerekiyor.');
      window.location.href = '/login';
      return;
    }

    const user = JSON.parse(userData);
    if (!user || !user.id) {
      alert('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
      window.location.href = '/login';
      return;
    }

    // Adres bilgisini birleştir
    const fullAddress = `${formData.sokak} ${formData.apartman} ${formData.daire}`.trim();
    
    if (!fullAddress || fullAddress.length < 5) {
      alert('Lütfen geçerli bir adres girin.');
      return;
    }
    
    // Adres objesi oluştur
    const addressData = {
      fullAddress: fullAddress,
      addressTitle: 'Teslimat Adresi',
      flatNum: formData.apartman ? parseInt(formData.apartman.replace(/\D/g, '')) || null : null,
      aptNum: formData.daire ? parseInt(formData.daire.replace(/\D/g, '')) || null : null,
      floorNum: formData.kat ? parseInt(formData.kat.replace(/\D/g, '')) || null : null,
    };

    try {
      // API'ye sipariş oluşturma isteği gönder
      // Toplam hesaplama (ürünler + öncelikli teslimat + bahşiş)
      const productsTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const priorityDeliveryFee = selectedDelivery === 'oncelikli' ? 39.99 : 0;
      const tipAmount = typeof selectedTip === 'number' ? selectedTip : 0;
      const finalTotal = productsTotal + priorityDeliveryFee + tipAmount;

      const orderData = {
        userId: user.id,
        address: addressData,
        cartItems: cartItems,
        paymentMethod: paymentMethod || 'kapida',
        deliveryType: selectedDelivery,
        tip: selectedTip,
        deliveryNote: formData.not || null,
        subTotal: finalTotal,
        priorityDeliveryFee: priorityDeliveryFee,
        tipAmount: tipAmount,
      };

      console.log('Sipariş verisi:', orderData);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      
      console.log('API yanıtı:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Sipariş oluşturulurken bir hata oluştu.');
      }

      // Başarılı - sepeti temizle
      alert("Siparişiniz 'Kapıda Ödeme' seçeneği ile başarıyla alındı! Teşekkürler.");
      localStorage.removeItem('cart');
      setCartItems([]);
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Siparişler sayfasına yönlendir (opsiyonel)
      // window.location.href = '/account';
    } catch (err) {
      console.error('Sipariş oluşturma hatası:', err);
      alert(err.message || 'Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
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

  // Sepet toplamı hesaplama (ürünler + öncelikli teslimat + bahşiş)
  const productsTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const priorityDeliveryFee = selectedDelivery === 'oncelikli' ? 39.99 : 0;
  const tipAmount = typeof selectedTip === 'number' ? selectedTip : 0;
  const total = productsTotal + priorityDeliveryFee + tipAmount;

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
                    {/* Payment bileşenine gerekli prop'ları geçiyoruz */}
                    <Payment 
                      totalAmount={total}
                      formData={formData}
                      selectedDelivery={selectedDelivery}
                      selectedTip={selectedTip}
                      cartItems={cartItems}
                      onPaymentSuccess={() => {
                        localStorage.removeItem('cart');
                        setCartItems([]);
                        window.dispatchEvent(new Event('cartUpdated'));
                        alert('Ödemeniz başarıyla tamamlandı! Teşekkürler.');
                        window.location.href = '/account';
                      }}
                    /> 
                </div>
            )}
          </div>

          {/* Siparişi Tamamla Butonu (Sadece Kapıda Ödeme Seçiliyse Görünür) */}
          {paymentMethod === 'kapida' && cartItems.length > 0 && (
             <button className="btn btn-primary btn-complete-order" onClick={handleCompleteOrder}>
               Kapıda Ödeme ile Siparişi Tamamla
             </button>
          )}
          
          {/* Ödeme yöntemi seçilmediyse uyarı */}
          {!paymentMethod && cartItems.length > 0 && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px', color: '#856404' }}>
              Lütfen bir ödeme yöntemi seçin.
            </div>
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
                <div className="summary-row">
                  <span>Ara Toplam</span>
                  <span>{productsTotal.toFixed(2)} TL</span>
                </div>
                {priorityDeliveryFee > 0 && (
                  <div className="summary-row">
                    <span>Öncelikli Teslimat</span>
                    <span>+{priorityDeliveryFee.toFixed(2)} TL</span>
                  </div>
                )}
                {tipAmount > 0 && (
                  <div className="summary-row">
                    <span>Bahşiş</span>
                    <span>+{tipAmount.toFixed(2)} TL</span>
                  </div>
                )}
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