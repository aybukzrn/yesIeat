import React from 'react'
import './KayitliAdreslerimContent.css'
import { FaMapMarkerAlt } from "react-icons/fa";


const KayitliAdreslerimContent = () => {
  return (
    <div className="addresses">
      <div className="header">
        <h3>Kayıtlı Kartlarım</h3>

        <div className="add-card">
          <button>
            <FaMapMarkerAlt className='add-address'/>Yeni Adres Ekle
          </button>
        </div>
      </div>

      <div className="address-form">
        <div className="title">
          <input type="text" 
          placeholder='Adres Başlığı'/>
        </div>

        <div className="triple">
          <div className="building">
            <input type="number" 
            placeholder='Bina No'/>
          </div>
          <div className="floor">
            <input type="number"
            placeholder='Kat No'/>
          </div>
          <div className="apartment">
            <input type="number"
            placeholder='Daire No'/>
          </div>
        </div>

        <div className="addess">
          <input type="text" 
          placeholder='Açık Adres'/>
        </div>

        <div className="phone">
          <input type="tel"
          placeholder='Cep Telefonu'/>
        </div>
      </div>
    </div>
  )
}

export default KayitliAdreslerimContent
