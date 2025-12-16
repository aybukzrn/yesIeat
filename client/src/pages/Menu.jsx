import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  MdOutlineFastfood, MdLocalCafe, MdOutlineWater,
  MdBakeryDining, MdDinnerDining, MdKebabDining,
  MdLocalPizza, MdRamenDining
} from 'react-icons/md';
import './Menu.css';
import { Fade } from 'react-awesome-reveal';

const categories = [
  { name: 'Hepsi', icon: MdOutlineFastfood },
  { name: 'Çorbalar', icon: MdRamenDining },
  { name: 'Ana Yemekler', icon: MdDinnerDining },
  { name: 'Kebaplar', icon: MdKebabDining },
  { name: 'Fast Food', icon: MdOutlineFastfood },
  { name: 'İtalyan', icon: MdLocalPizza },
  { name: 'Hafif Lezzetler', icon: MdOutlineWater },
  { name: 'Tatlılar', icon: MdBakeryDining },
  { name: 'İçecekler', icon: MdLocalCafe },
];

// Tag'den CSS class ismini oluşturan fonksiyon
// CSS'teki class isimleri: tag-Hızlı, tag-Şef, tag-Yeni, tag-Popüler, tag-Ekonomik, tag-Vejetaryen, tag-Diyet, tag-Soğuk
const getTagClassName = (tag) => {
  if (!tag || tag.trim() === '') return '';
  
  // Tag'in ilk kelimesini al
  const firstWord = tag.trim().split(' ')[0];
  
  // CSS class isimleriyle eşleştirme (büyük/küçük harf duyarsız)
  // Veritabanından "Hızlı Teslim", "Şef Tavsiyesi" gibi gelebilir
  const tagMap = {
    'Hızlı': 'Hızlı',
    'hızlı': 'Hızlı',
    'HIZLI': 'Hızlı',
    'Şef': 'Şef',
    'şef': 'Şef',
    'ŞEF': 'Şef',
    'Yeni': 'Yeni',
    'yeni': 'Yeni',
    'YENİ': 'Yeni',
    'Popüler': 'Popüler',
    'popüler': 'Popüler',
    'POPÜLER': 'Popüler',
    'Ekonomik': 'Ekonomik',
    'ekonomik': 'Ekonomik',
    'EKONOMİK': 'Ekonomik',
    'Vejetaryen': 'Vejetaryen',
    'vejetaryen': 'Vejetaryen',
    'VEJETARYEN': 'Vejetaryen',
    'Diyet': 'Diyet',
    'diyet': 'Diyet',
    'DİYET': 'Diyet',
    'Soğuk': 'Soğuk',
    'soğuk': 'Soğuk',
    'SOĞUK': 'Soğuk',
  };
  
  // Eşleşme varsa CSS class ismini döndür, yoksa ilk kelimeyi kullan (ilk harfi büyük yaparak)
  const normalizedTag = tagMap[firstWord] || firstWord;
  
  return `tag-${normalizedTag}`;
};

const MenuItemCard = ({ item }) => (
  <div className="menu-item-card">
    <div className="item-image-placeholder">
      <img src={`/assets/menu/${item.id}.jpg`} alt={item.name} />
    </div>
    <div className="item-details">
      <div className="item-header">
        <h3>{item.name}</h3>
        {/* Tag varsa göster, yoksa gösterme */}
        {item.tag && item.tag.trim() !== '' && (
          <span className={`item-tag ${getTagClassName(item.tag)}`}>{item.tag}</span>
        )}
      </div>
      <p className="item-desc">{item.desc}</p>
      <div className="item-footer">
        <span className="item-price">{item.price} ₺</span>
        <button className="add-to-cart-btn">Sepete Ekle</button>
      </div>
    </div>
  </div>
);

const Menu = () => {
  // Menü verilerini tutacak state (API'den gelecek)
  const [menuData, setMenuData] = useState([]);
  // Yükleme durumunu takip eden state
  const [loading, setLoading] = useState(true);
  // Hata durumunu tutan state
  const [error, setError] = useState(null);
  
  const [activeCategory, setActiveCategory] = useState('Hepsi');
  const [selectedTags, setSelectedTags] = useState([]);

  // Component mount olduğunda API'den menü verilerini çek
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true); // Yükleme başladı
        setError(null); // Önceki hataları temizle
        
        // Backend'den menü verilerini çek
        const response = await fetch('/api/menu');
        
        // Response başarılı değilse hata fırlat
        if (!response.ok) {
          throw new Error('Menü verileri yüklenemedi');
        }
        
        // JSON verisini al
        const data = await response.json();
        
        // State'i güncelle
        setMenuData(data);
        setLoading(false); // Yükleme tamamlandı
      } catch (err) {
        // Hata durumunda
        console.error('Menü yükleme hatası:', err);
        setError(err.message || 'Bir hata oluştu');
        setLoading(false);
      }
    };

    // Fonksiyonu çağır
    fetchMenuData();
  }, []); // Boş dependency array = sadece component mount olduğunda çalış

  const toggleTag = (tag) => {
    if (tag === "Hepsi") {
      setSelectedTags([]);
      return;
    }

    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };


  // Mevcut tag'leri hesapla (menuData yüklendikten sonra)
  const availableTags = [
    'Hepsi',
    ...new Set(
      menuData
        .filter(item => {
          // Kategori filtresine uygun mu?
          const categoryMatch = activeCategory === 'Hepsi' || item.category === activeCategory;
          // Tag'i var mı ve boş değil mi?
          return categoryMatch && item.tag && item.tag.trim() !== '';
        })
        .map(item => item.tag)
    )
  ];

  // Filtrelenmiş menüyü hesapla
  const filteredMenu = menuData.filter(item => {
    const categoryMatch =
      activeCategory === 'Hepsi' || item.category === activeCategory;

    const tagMatch =
      selectedTags.length === 0 || selectedTags.includes(item.tag);

    return categoryMatch && tagMatch;
  });

  return (
    <>
      <Navbar />

      <div className="menu-page container">

        <Fade direction="left" triggerOnce>
          <div className="sidebar">
            <div className="category-filter-bar mb-5">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className={`filter-btn ${activeCategory === cat.name ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat.name);
                    setSelectedTags([]);
                  }}
                >
                  <cat.icon size={20} style={{ marginRight: '8px' }} />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </Fade>

        <div className="tag-menu">
        <div className="tag-filter-bar">
        {availableTags.map(tag => (
          <button
            key={tag}
            className={`tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
            data-tag={tag.split(' ')[0]}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </button>

        ))}
      </div>

        <section className="menu-list-section">
          <div className="menu-items-grid">
            {/* Yükleme durumu */}
            {loading && (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '40px',
                fontSize: '18px',
                color: '#666'
              }}>
                Menü yükleniyor...
              </div>
            )}
            
            {/* Hata durumu */}
            {error && !loading && (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '40px',
                fontSize: '18px',
                color: '#d32f2f'
              }}>
                <p>Hata: {error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  Tekrar Dene
                </button>
              </div>
            )}
            
            {/* Veri yüklendi ve hata yoksa menüyü göster */}
            {!loading && !error && (
              filteredMenu.length > 0 ? (
                filteredMenu.map(item => (
                  <MenuItemCard key={item.id} item={item} />
                ))
              ) : (
                <p className="no-items-message">
                  Seçili filtrelerde ürün bulunamadı.
                </p>
              )
            )}
          </div>
        </section>
        </div>

        
      </div>

      <Footer />
    </>
  );
};

export default Menu;