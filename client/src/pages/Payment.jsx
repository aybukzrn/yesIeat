import React from 'react';
import './Payment.css';

const Payment = () => {
  return (
    <div className="payment-wrapper">
      <div className="navbar-container">
       
      </div>

      <div className="payment-content">
        <div className="payment-card">
          
          
          <form>

            <div className="input-group">
              <p>Kart Üzerindeki İsim Soyisim</p>
              <input type="text" placeholder="Örn: Selinay Türksal" />
            </div>

           
            <div className="input-group">
              <p>Kart Numarası</p>
              <input 
                type="text" 
                placeholder="0000 0000 0000 0000" 
                maxLength="16" 
              />
            </div>

            <div className="row-group">
              <div className="input-group half">
                <p>Son Kullanma Tarihi</p>
                <input type="text" placeholder="AA/YY" maxLength="4" />
              </div>
              
              <div className="input-group half">
                <p>CVV</p>
                <input type="text" placeholder="***" maxLength="3" />
              </div>
            </div>
            <div className="button-container"></div>
            <button type="button" className="pay-button">
              Güvenli Ödeme Yap
            </button>

          </form>
          
        </div>
      </div>
      
      
    </div>
  );
};

export default Payment;