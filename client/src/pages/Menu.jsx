import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  MdOutlineFastfood, MdLocalCafe, MdOutlineWater,
  MdBakeryDining, MdDinnerDining, MdKebabDining,
  MdLocalPizza, MdRamenDining, MdCheckCircle
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

const MenuItemCard = ({ item, onAddToCart }) => {
  const [added, setAdded] = useState(false);

  // Stok bilgisi (backend'den gelmiyorsa varsayılan 0 kabul ediyoruz)
  const stock = item.stock ?? 0;
  const isOutOfStock = stock <= 0;

  const handleButtonClick = () => {
    if (isOutOfStock) return; // Stok yoksa hiçbir şey yapma

    // Sepete ekleme fonksiyonunu çağır
    onAddToCart(item);
    
    // Buton durumunu değiştir
    setAdded(true);
    
    // 2 saniye sonra eski haline döndür
    setTimeout(() => {
      setAdded(false);
    }, 2000);
  };

  return (
    <div className="menu-item-card">
      <div className="item-image-placeholder">
        <img 
          src={(() => {
            if (!item.photo) return '/assets/menu/default.jpg';
            const photoPath = item.photo.includes('.') 
              ? `/assets/menu/${item.photo}` 
              : `/assets/menu/${item.photo}.jpg`;
            // Debug için console'a yazdır
            if (process.env.NODE_ENV === 'development') {
              console.log(`Fotoğraf yolu: ${photoPath} (Ürün: ${item.name}, Photo: ${item.photo})`);
            }
            return photoPath;
          })()} 
          alt={item.name}
          onError={(e) => {
            console.error(`Fotoğraf yüklenemedi: ${e.target.src} (Ürün: ${item.name})`);
            // Eğer fotoğraf yüklenemezse varsayılan bir görsel göster
            e.target.src = '/assets/menu/default.jpg';
          }}
        />
      </div>
      <div className="item-details">
        <div className="item-header">
          <h3>{item.name}</h3>
          {item.tag && item.tag.trim() !== '' && (
            <span className={`item-tag ${getTagClassName(item.tag)}`}>{item.tag}</span>
          )}
        </div>
        <p className="item-desc">{item.desc}</p>
        <div className="item-footer">
          <span className="item-price">{item.price} ₺</span>
          <button
            className={`add-to-cart-btn ${added ? 'added' : ''} ${isOutOfStock ? 'disabled' : ''}`}
            onClick={handleButtonClick}
            disabled={added || isOutOfStock}
          >
            {isOutOfStock ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'not-allowed' }}>
                Stokta yok
              </span>
            ) : added ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MdCheckCircle size={18} /> Eklendi
              </span>
            ) : (
              "Sepete Ekle"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const Menu = () => {
  // Menü verilerini tutacak state (API'den gelecek)
  const [menuData, setMenuData] = useState([]);
  // Yükleme durumunu takip eden state
  const [loading, setLoading] = useState(true);
  // Hata durumunu tutan state
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('Hepsi');
  const [selectedTags, setSelectedTags] = useState([]);
  
  // localStorage'dan arama query'sini oku (diğer sayfalardan geliyorsa)
  const [searchQuery, setSearchQuery] = useState(() => {
    return localStorage.getItem('globalSearchQuery') || '';
  });

  // Sayfa yüklendiğinde veya location değiştiğinde localStorage'dan oku
  useEffect(() => {
    const storedQuery = localStorage.getItem('globalSearchQuery') || '';
    if (storedQuery !== searchQuery) {
      setSearchQuery(storedQuery);
    }
  }, [location.pathname]); // searchQuery dependency'sini kaldırdık, sadece location değiştiğinde çalışsın

  // Arama değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== null) {
      localStorage.setItem('globalSearchQuery', searchQuery);
    }
  }, [searchQuery]);

  const handleAddToCart = (item) => {
    try {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];

      const existingIndex = storedCart.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingIndex !== -1) {
        storedCart[existingIndex].quantity += 1;
      } else {
        storedCart.push({
          id: item.id,
          name: item.name,
          price: Number(item.price) || 0,
          quantity: 1,
        });
      }

      localStorage.setItem('cart', JSON.stringify(storedCart));

      // Cart sayfası ve diğer bileşenlerin güncellenmesi için event gönder
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error('Ürün sepete eklenirken hata oluştu:', err);
    }
  };

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

  // Büyük küçük harfe duyarsız arama için normalize fonksiyonu (Türkçe karakter desteği ile)
  const normalizeString = (str) => {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Türkçe karakterleri normalize et
  };

  // Filtrelenmiş menüyü hesapla
  const filteredMenu = menuData.filter(item => {
    const categoryMatch =
      activeCategory === 'Hepsi' || item.category === activeCategory;

    const tagMatch =
      selectedTags.length === 0 || selectedTags.includes(item.tag);

    // Arama filtresi (sadece isim ve kategori)
    let searchMatch = true;
    if (searchQuery) {
      const query = normalizeString(searchQuery);
      searchMatch = 
        normalizeString(item.name).includes(query) ||
        normalizeString(item.category).includes(query);
    }

    return categoryMatch && tagMatch && searchMatch;
  });

  return (
    <>
      <Navbar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

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
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onAddToCart={handleAddToCart}
                  />
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