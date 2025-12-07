import React from 'react'
import './KayitliKartlarımContent.css'
import { MdAddCard } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";


const CardDetail = ({ name, logo, value, brand }) => {
  return (
    <div className="card-form">

      <div className="head">
        <div className="name">
          <h2>{name}</h2>
        </div>


        <div className="right-card">

          <div className="card">

            <div className="card-logo">
              <img src={logo} alt="" />
            </div>
            <div className="card-value">
              <span>{value}</span>
            </div>
          </div>

          <div className="card-brand">
            <img src={brand} alt="" />
          </div>

        </div>

      </div>

      <div className="delete-card">
        <button><FaEdit className='edit-button-icon' />Düzenle</button>
        <button><MdDeleteForever className='delete-button-icon' />Kartı Sil</button>
      </div>

    </div>


  );

};

const KayitliKartlarımContent = () => {

  return (
    <div className="carts">
      <div className="header">
        <h3>Kayıtlı Kartlarım</h3>

        <div className="add-card">
          <button>
            <MdAddCard className='add-card-icon' /> Yeni Kart Ekle
          </button>
        </div>
      </div>
      <div className="card-information">
        <CardDetail
          name="Ben"
          logo="/assets/AccountPage/ziraat-logo.webp"
          value="**** **** **** 1234"
          brand="/assets/AccountPage/mastercard-logo.webp"
        />
        <CardDetail
          name="Selim"
          logo="/assets/AccountPage/ziraat-logo.webp"
          value="**** **** **** 5678"
          brand="/assets/AccountPage/visa-brand.svg"
        />

        <CardDetail
          name="Abim"
          logo="/assets/AccountPage/yapikredi-logo.png"
          value="**** **** **** 1234"
          brand="/assets/AccountPage/mastercard-logo.webp"
        />
      </div>
    </div>
  )
}

export default KayitliKartlarımContent
