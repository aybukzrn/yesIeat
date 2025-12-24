import React, { useState, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [newAddress, setNewAddress] = useState({
    title: "",
    city: "Ankara",        
    district: ankaraDistricts[0] || "",  
    building: "",
    floor: "",
    apartment: "",
    fullAddress: "",
    phone: "",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
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

  // Adresleri yükle
  useEffect(() => {
    const fetchAddresses = async () => {
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

        const response = await fetch(`/api/user/addresses?userId=${user.id}`);
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Adresler yüklenirken bir hata oluştu.');
        }

        // "Teslimat Adresi" başlıklı adresleri filtrele (siparişlerden otomatik oluşturulan adresler)
        const filteredAddresses = (data.addresses || []).filter(
          addr => addr.title !== 'Teslimat Adresi'
        );

        setAddresses(filteredAddresses);
      } catch (err) {
        console.error('Adres yükleme hatası:', err);
        setMessage({ type: 'error', text: err.message || 'Adresler yüklenirken bir hata oluştu.' });
        setAddresses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Yeni adres ekle
  const handleAddAddress = async () => {
    try {
      if (!newAddress.title || !newAddress.fullAddress || !newAddress.district) {
        setMessage({ type: 'error', text: 'Lütfen adres başlığı, ilçe ve tam adres bilgilerini doldurun.' });
        return;
      }

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

      // Tam adresi oluştur (telefon numarasını da ekle)
      let fullAddressText = `${newAddress.city} / ${newAddress.district}, ${newAddress.fullAddress}`;
      if (newAddress.phone) {
        fullAddressText += ` | ${newAddress.phone}`;
      }

      const response = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: newAddress.title,
          fullAddress: fullAddressText,
          building: newAddress.building,
          floor: newAddress.floor,
          apartment: newAddress.apartment,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Adres eklenirken bir hata oluştu.');
      }

      // Adresleri yeniden yükle
      const addressesResponse = await fetch(`/api/user/addresses?userId=${user.id}`);
      const addressesData = await addressesResponse.json();
      if (addressesData.success) {
        setAddresses(addressesData.addresses || []);
      }

      setNewAddress({
        title: "",
        city: "Ankara",
        district: ankaraDistricts[0] || "",
        building: "",
        floor: "",
        apartment: "",
        fullAddress: "",
        phone: "",
      });
      setIsAddAddressModalOpen(false);
      setMessage({ type: 'success', text: 'Adres başarıyla eklendi.' });
    } catch (err) {
      console.error('Adres ekleme hatası:', err);
      setMessage({ type: 'error', text: err.message || 'Adres eklenirken bir hata oluştu.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Adres sil
  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Bu adresi silmek istediğinize emin misiniz?')) {
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

      const response = await fetch(`/api/user/addresses/${addressId}?userId=${user.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Adres silinirken bir hata oluştu.');
      }

      // Adresleri yeniden yükle
      const addressesResponse = await fetch(`/api/user/addresses?userId=${user.id}`);
      const addressesData = await addressesResponse.json();
      if (addressesData.success) {
        setAddresses(addressesData.addresses || []);
      }

      setMessage({ type: 'success', text: 'Adres başarıyla silindi.' });
    } catch (err) {
      console.error('Adres silme hatası:', err);
      setMessage({ type: 'error', text: err.message || 'Adres silinirken bir hata oluştu.' });
    }
  };

  // Adres düzenle
  const saveEditedAddress = async () => {
    try {
      if (!editAddress.title || !editAddress.fullAddress || !editAddress.district) {
        setMessage({ type: 'error', text: 'Lütfen adres başlığı, ilçe ve tam adres bilgilerini doldurun.' });
        return;
      }

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

      // Tam adresi oluştur (telefon numarasını da ekle)
      let fullAddressText = `${editAddress.city} / ${editAddress.district}, ${editAddress.fullAddress}`;
      if (editAddress.phone) {
        fullAddressText += ` | ${editAddress.phone}`;
      }

      const response = await fetch(`/api/user/addresses/${editAddressId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: editAddress.title,
          fullAddress: fullAddressText,
          building: editAddress.building,
          floor: editAddress.floor,
          apartment: editAddress.apartment,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Adres güncellenirken bir hata oluştu.');
      }

      // Adresleri yeniden yükle
      const addressesResponse = await fetch(`/api/user/addresses?userId=${user.id}`);
      const addressesData = await addressesResponse.json();
      if (addressesData.success) {
        setAddresses(addressesData.addresses || []);
      }

      setIsEditModalOpen(false);
      setMessage({ type: 'success', text: 'Adres başarıyla güncellendi.' });
    } catch (err) {
      console.error('Adres güncelleme hatası:', err);
      setMessage({ type: 'error', text: err.message || 'Adres güncellenirken bir hata oluştu.' });
    } finally {
      setIsSaving(false);
    }
  };


  // Adres düzenleme modalını aç
  const openEditModal = (address) => {
    // fullAddress'ten şehir, ilçe, adres ve telefon bilgisini parse et
    // Format: "Ankara / İlçe, Açık Adres | Telefon"
    let city = 'Ankara';
    let district = ankaraDistricts[0] || '';
    let fullAddress = '';
    let phone = '';

    if (address.fullAddress) {
      // Telefon numarasını ayır (| karakterinden sonrası)
      const phoneParts = address.fullAddress.split(' | ');
      if (phoneParts.length > 1) {
        phone = phoneParts[1] || '';
      }

      // Şehir ve ilçe bilgisini parse et
      const mainPart = phoneParts[0] || address.fullAddress;
      const parts = mainPart.split(' / ');
      
      if (parts.length > 0) {
        city = parts[0] || 'Ankara';
      }
      
      if (parts.length > 1) {
        const districtAndAddress = parts[1];
        const districtParts = districtAndAddress.split(',');
        district = districtParts[0]?.trim() || ankaraDistricts[0] || '';
        fullAddress = districtParts.slice(1).join(',').trim() || '';
      }
    }

    setEditAddressId(address.id);
    setEditAddress({
      title: address.title || '',
      city: city,
      district: district,
      building: address.building || '',
      floor: address.floor || '',
      apartment: address.apartment || '',
      fullAddress: fullAddress,
      phone: phone,
    });
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Yükleniyor...</div>;
  }

  return (
    <div className="addresses">
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
          addresses.map((addr) => {
            // fullAddress'ten şehir, ilçe, adres ve telefon bilgisini parse et
            // Format: "Ankara / İlçe, Açık Adres | Telefon"
            let city = 'Ankara';
            let district = '';
            let fullAddressText = '';
            let phone = '';

            if (addr.fullAddress) {
              // Telefon numarasını ayır (| karakterinden sonrası)
              const phoneParts = addr.fullAddress.split(' | ');
              if (phoneParts.length > 1) {
                phone = phoneParts[1] || '';
              }

              // Şehir ve ilçe bilgisini parse et
              const mainPart = phoneParts[0] || addr.fullAddress;
              const parts = mainPart.split(' / ');
              
              if (parts.length > 0) {
                city = parts[0] || 'Ankara';
              }
              
              if (parts.length > 1) {
                const districtAndAddress = parts[1];
                const districtParts = districtAndAddress.split(',');
                district = districtParts[0]?.trim() || '';
                fullAddressText = districtParts.slice(1).join(',').trim() || '';
              }
            }

            return (
              <div className="address-cards" key={addr.id}>
                <h4>{addr.title}</h4>
                <p>{city} / {district}</p>
                <p>{fullAddressText}</p>
                {(addr.building || addr.floor || addr.apartment) && (
                  <p>Bina: {addr.building || '-'}, Kat: {addr.floor || '-'}, Daire: {addr.apartment || '-'}</p>
                )}
                {phone && <p>Telefon: {phone}</p>}

                <div className="actions">
                  <button onClick={() => handleDeleteAddress(addr.id)}>
                    <MdDeleteForever className="delete-btn" />
                    Sil
                  </button>
                  <button onClick={() => openEditModal(addr)}>
                    <FaEdit className="edit-btn" />
                    Düzenle
                  </button>
                </div>
              </div>
            );
          })
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
                  district: ankaraDistricts[0] || '' // şehir değişirse ilçeyi resetleyelim
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
                <option key={i} value={d}>{d}</option>
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


          <button className="save-btn" onClick={handleAddAddress} disabled={isSaving}>
            {isSaving ? 'Kaydediliyor...' : 'Adresi Kaydet'}
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
                  district: ankaraDistricts[0] || ''
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
                <option key={i} value={d}>{d}</option>
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

          <button className="save-btn" onClick={saveEditedAddress} disabled={isSaving}>
            {isSaving ? 'Güncelleniyor...' : 'Güncelle'}
          </button>
        </div>
      </Modal>


    </div>
  );
};

export default KayitliAdreslerimContent;
