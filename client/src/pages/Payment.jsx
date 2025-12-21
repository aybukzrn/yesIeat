import React, { useState } from 'react';
import './Payment.css';

const Payment = ({ totalAmount, onPaymentSuccess, formData, selectedDelivery, selectedTip, cartItems }) => {
  const [cardData, setCardData] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!cardData.cardHolder || !cardData.cardNumber || !cardData.expiryDate || !cardData.cvv) {
      alert('Lütfen tüm kart bilgilerini doldurun.');
      return;
    }

    if (cardData.cardNumber.length !== 16) {
      alert('Kart numarası 16 haneli olmalıdır.');
      return;
    }

    setIsProcessing(true);

    // Kullanıcı bilgisini al
    const userData = localStorage.getItem('user');
    if (!userData) {
      alert('Giriş yapmanız gerekiyor.');
      setIsProcessing(false);
      return;
    }

    const user = JSON.parse(userData);
    if (!user || !user.id) {
      alert('Kullanıcı bilgisi bulunamadı.');
      setIsProcessing(false);
      return;
    }

    // Adres bilgisini birleştir
    const fullAddress = `${formData.sokak} ${formData.apartman} ${formData.daire}`.trim();
    
    // Adres objesi oluştur
    const addressData = {
      fullAddress: fullAddress,
      addressTitle: 'Teslimat Adresi',
      flatNum: formData.apartman ? parseInt(formData.apartman.replace(/\D/g, '')) || null : null,
      aptNum: formData.daire ? parseInt(formData.daire.replace(/\D/g, '')) || null : null,
      floorNum: formData.kat ? parseInt(formData.kat.replace(/\D/g, '')) || null : null,
    };

    try {
      // Toplam hesaplama (ürünler + öncelikli teslimat + bahşiş)
      const productsTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const priorityDeliveryFee = selectedDelivery === 'oncelikli' ? 39.99 : 0;
      const tipAmount = typeof selectedTip === 'number' ? selectedTip : 0;
      const finalTotal = productsTotal + priorityDeliveryFee + tipAmount;

      // API'ye sipariş oluşturma isteği gönder
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          address: addressData,
          cartItems: cartItems,
          paymentMethod: 'kart',
          deliveryType: selectedDelivery,
          tip: selectedTip,
          deliveryNote: formData.not || null,
          subTotal: finalTotal,
          priorityDeliveryFee: priorityDeliveryFee,
          tipAmount: tipAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Sipariş oluşturulurken bir hata oluştu.');
      }

      // Başarılı
      if (onPaymentSuccess) {
        onPaymentSuccess();
      } else {
        alert('Ödemeniz başarıyla tamamlandı! Teşekkürler.');
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
        window.location.href = '/account';
      }
    } catch (err) {
      console.error('Ödeme hatası:', err);
      alert(err.message || 'Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-wrapper">
      <div className="payment-content">
        <div className="payment-card">
          <form onSubmit={handlePayment}>
            <div className="input-group">
              <p>Kart Üzerindeki İsim Soyisim</p>
              <input 
                type="text" 
                name="cardHolder"
                value={cardData.cardHolder}
                onChange={handleInputChange}
                placeholder="Örn: Selinay Türksal" 
              />
            </div>

            <div className="input-group">
              <p>Kart Numarası</p>
              <input 
                type="text" 
                name="cardNumber"
                value={cardData.cardNumber}
                onChange={handleInputChange}
                placeholder="0000 0000 0000 0000" 
                maxLength="16"
              />
            </div>

            <div className="row-group">
              <div className="input-group half">
                <p>Son Kullanma Tarihi</p>
                <input 
                  type="text" 
                  name="expiryDate"
                  value={cardData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="AA/YY" 
                  maxLength="5"
                />
              </div>
              
              <div className="input-group half">
                <p>CVV</p>
                <input 
                  type="text" 
                  name="cvv"
                  value={cardData.cvv}
                  onChange={handleInputChange}
                  placeholder="***" 
                  maxLength="3"
                />
              </div>
            </div>
            <div className="button-container"></div>
            <button type="submit" className="pay-button" disabled={isProcessing}>
              {isProcessing ? 'İşleniyor...' : 'Güvenli Ödeme Yap'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payment;