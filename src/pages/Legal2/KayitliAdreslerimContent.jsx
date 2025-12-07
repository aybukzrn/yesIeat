import React, { useState } from 'react';
import './KayitliAdreslerimContent.css';
import { FaMapMarkerAlt } from "react-icons/fa";
import Modal from '../../components/Modal';
import { MdDeleteForever } from "react-icons/md";
import { FaEdit } from "react-icons/fa";


const ankaraDistricts = [
  "Altındağ",
  "Çankaya",
  "Keçiören",
  "Mamak",
  "Yenimahalle",
  "Sincan",
  "Etimesgut",
  "Gölbaşı",
  "Pursaklar",
  "Polatlı",
  "Beypazarı",
  "Elmadağ",
  "Ayaş",
  "Çubuk",
  "Haymana",
  "Kalecik",
  "Kahramankazan",
  "Kızılcahamam",
  "Nallıhan",
  "Şereflikoçhisar",
  "Evren"
];

// Telefon formatlama fonksiyonu
const formatPhone = (value) => {
  
  const digits = value.replace(/\D/g, "").slice(0, 11);

  let formatted = "";

  if (digits.length > 0) formatted = digits.substring(0, 4);
  if (digits.length > 4) formatted += " " + digits.substring(4, 7);
  if (digits.length > 7) formatted += " " + digits.substring(7, 9);
  if (digits.length > 9) formatted += " " + digits.substring(9, 11);

  return formatted;
};




const KayitliAdreslerimContent = () => {

  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);

  const [newAddress, setNewAddress] = useState({
    title: "",
    city: "Ankara",        
    district: "",  
    building: "",
    floor: "",
    apartment: "",
    fullAddress: "",
    phone: "",
  });


  // Yeni adres ekle
  const handleAddAddress = () => {
    setAddresses([...addresses, newAddress]);
    setNewAddress({
      title: "",
      city: "Ankara",
      district: "",
      building: "",
      floor: "",
      apartment: "",
      fullAddress: "",
      phone: "",
    });
    setIsAddAddressModalOpen(false);
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editAddress, setEditAddress] = useState({
    title: "",
    city: "Ankara",
    district: "",
    building: "",
    floor: "",
    apartment: "",
    fullAddress: "",
    phone: "",
  });


  // Adres sil
  const handleDeleteAddress = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
  };

  // Adres düzenle
  const saveEditedAddress = () => {
    const updated = addresses.map((a, i) => (i === editIndex ? editAddress : a));
    setAddresses(updated);
    setIsEditModalOpen(false);
  };


  return (
    <div className="addresses">

      <div className="header">
        <h3>Kayıtlı Adreslerim</h3>

        <div className="add-card">
          <button onClick={() => setIsAddAddressModalOpen(true)}>
            <FaMapMarkerAlt className='add-address' /> Yeni Adres Ekle
          </button>
        </div>
      </div>


      <div className="address-list">
        {addresses.length === 0 ? (
          <p>Henüz adres eklemediniz.</p>
        ) : (
          addresses.map((addr, index) => (
            <div className="address-cards" key={index}>
              <h4>{addr.title}</h4>
              <p>{addr.city} / {addr.district}</p>

              <p>{addr.fullAddress}</p>
              <p>Bina: {addr.building}, Kat: {addr.floor}, Daire: {addr.apartment}</p>
              <p>Telefon: {addr.phone}</p>

              <div className="actions">

                <button onClick={() => handleDeleteAddress(index)}>
                  <MdDeleteForever className="delete-btn" />
                  Sil
                </button>
                <button
                  onClick={() => {
                    setEditIndex(index);
                    setEditAddress(addr);
                    setIsEditModalOpen(true);
                  }}
                >
                  <FaEdit className="edit-btn" />
                  Düzenle
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADRES EKLE MODALI */}
      <Modal
        isOpen={isAddAddressModalOpen}
        onClose={() => setIsAddAddressModalOpen(false)}
        title="Yeni Adres Ekle"
      >
        <div className="address-form">

          <input
            type="text"
            placeholder="Adres Başlığı"
            value={newAddress.title}
            onChange={(e) => setNewAddress({ ...newAddress, title: e.target.value })}
          />

          <div className="location-selects">

            {/* Şehir seçimi */}
            <select
              value={newAddress.city}
              onChange={(e) =>
                setNewAddress({
                  ...newAddress,
                  city: e.target.value,
                  district: ankaraDistricts[0] // şehir değişirse ilçeyi resetleyelim
                })
              }
            >
              <option value="Ankara">Ankara</option>

            </select>

            {/* İlçe seçimi */}
            <select
              value={newAddress.district}
              onChange={(e) =>
                setNewAddress({ ...newAddress, district: e.target.value })
              }
            >
              {ankaraDistricts.map((d, i) => (
                <option key={i}>{d}</option>
              ))}
            </select>
          </div>


          <div className="triple">
            <input
              type="number"
              placeholder="Bina No"
              value={newAddress.building}
              onChange={(e) => setNewAddress({ ...newAddress, building: e.target.value })}
            />

            <input
              type="number"
              placeholder="Kat No"
              value={newAddress.floor}
              onChange={(e) => setNewAddress({ ...newAddress, floor: e.target.value })}
            />

            <input
              type="number"
              placeholder="Daire No"
              value={newAddress.apartment}
              onChange={(e) => setNewAddress({ ...newAddress, apartment: e.target.value })}
            />
          </div>

          <input
            type="text"
            placeholder="Açık Adres"
            value={newAddress.fullAddress}
            onChange={(e) => setNewAddress({ ...newAddress, fullAddress: e.target.value })}
          />

          <input
            type="tel"
            placeholder="Cep Telefonu"
            value={newAddress.phone}
            onChange={(e) =>
              setNewAddress({
                ...newAddress,
                phone: formatPhone(e.target.value),
              })
            }
          />


          <button className="save-btn" onClick={handleAddAddress}>
            Adresi Kaydet
          </button>
        </div>
      </Modal>


      {/* ADRES DÜZENLE MODALI */}

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Adresi Düzenle"
      >
        <div className="address-form">

          <input
            type="text"
            placeholder="Adres Başlığı"
            value={editAddress.title}
            onChange={(e) =>
              setEditAddress({ ...editAddress, title: e.target.value })
            }
          />

          <div className="location-selects">

            {/* Şehir seçimi */}
            <select
              value={editAddress.city}
              onChange={(e) =>
                setEditAddress({
                  ...editAddress,
                  city: e.target.value,
                  district: ankaraDistricts[0] 
                })
              }
            >
              <option value="Ankara">Ankara</option>

            </select>

            {/* İlçe seçimi */}
            <select
              value={editAddress.district}
              onChange={(e) =>
                setEditAddress({ ...editAddress, district: e.target.value })
              }
            >
              {ankaraDistricts.map((d, i) => (
                <option key={i}>{d}</option>
              ))}
            </select>
          </div>



          <div className="triple">
            <input
              type="number"
              placeholder="Bina No"
              value={editAddress.building}
              onChange={(e) =>
                setEditAddress({ ...editAddress, building: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Kat No"
              value={editAddress.floor}
              onChange={(e) =>
                setEditAddress({ ...editAddress, floor: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Daire No"
              value={editAddress.apartment}
              onChange={(e) =>
                setEditAddress({ ...editAddress, apartment: e.target.value })
              }
            />
          </div>

          <input
            type="text"
            placeholder="Açık Adres"
            value={editAddress.fullAddress}
            onChange={(e) =>
              setEditAddress({ ...editAddress, fullAddress: e.target.value })
            }
          />

          <input
            type="tel"
            placeholder="Cep Telefonu"
            value={editAddress.phone}
            onChange={(e) =>
              setEditAddress({
                ...editAddress,
                phone: formatPhone(e.target.value),
              })
            }
          />

          <button className="save-btn" onClick={saveEditedAddress}>
            Güncelle
          </button>
        </div>
      </Modal>


    </div>
  );
};

export default KayitliAdreslerimContent;
