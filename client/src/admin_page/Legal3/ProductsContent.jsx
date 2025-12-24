import React, { useState, useEffect } from 'react';
import './ProductsContent.css';
import { IoIosAddCircleOutline } from 'react-icons/io';
import Modal from '../../components/Modal';

const ProductsContent = () => {

  const [activeCategory, setActiveCategory] = useState('Ürünler');
  const [products, setProducts] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    proPhoto: '',
    tag: '',
    // Stok adedi
    stock: 0,
    content: '', // Sadece menüler için
    description: '' // Ürün açıklaması
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  // Ürünleri backend'den çeken fonksiyon (yeniden kullanılabilir)
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/menu');

      if (!response.ok) {
        throw new Error('Ürünler yüklenemedi');
      }

      const data = await response.json();

      // /api/menu aynı veriyi müşteri menüsü için de kullanıyor.
      // Admin tarafında tablo kolonlarına uysun diye temel alanları mapliyoruz.
      const mappedProducts = data.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category || '',
        price: Number(item.price) || 0,
        tag: item.tag || '',
        // Backend'den gelen stok adedine göre stok durumu
        stock: item.stock ?? 0,
        stockStatus: (item.stock ?? 0) > 0 ? 'Stokta Var' : 'Stokta Yok',
        proPhoto: item.photo || '',
        content: item.desc || '',
      }));

      setProducts(mappedProducts);
    } catch (err) {
      console.error('Ürünler yüklenirken hata:', err);
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Menüleri backend'den çeken fonksiyon
  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/menu');

      if (!response.ok) {
        throw new Error('Menüler yüklenemedi');
      }

      const data = await response.json();

      // Menüleri filtrele (kategori "Menü" olanları veya tag ile ayırt edilebilir)
      // Şimdilik tüm ürünleri menü olarak gösteriyoruz, backend'de menü kategorisi varsa filtreleyebiliriz
      const mappedMenus = data
        .filter((item) => {
          // Eğer backend'de menü kategorisi varsa buraya filtre eklenebilir
          // Şimdilik tüm ürünleri menü olarak gösteriyoruz
          return true;
        })
        .map((item) => ({
          id: item.id,
          name: item.name,
          content: item.desc || '',
          price: Number(item.price) || 0,
          proPhoto: item.photo || '',
        }));

      setMenus(mappedMenus);
    } catch (err) {
      console.error('Menüler yüklenirken hata:', err);
      setError(err.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Admin ürün tablosunu backend'deki /api/menu endpointine bağla
  useEffect(() => {
    fetchProducts();
    fetchMenus();
  }, []);


  const handleCategoryChange = (e) => {
    setActiveCategory(e.target.value);
    setCurrentPage(1);
    setSearchQuery(''); // Kategori değiştiğinde aramayı temizle
  };

  // Arama fonksiyonu
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Arama yapıldığında ilk sayfaya dön
  };

  // Form verilerini güncelleyen fonksiyon
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    // Eğer file input ise
    if (type === 'file' && files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      
      // Preview oluştur
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Fotoğraf yükleme fonksiyonu
  const uploadPhoto = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await fetch('/api/admin/upload-photo', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Fotoğraf yüklenirken bir hata oluştu');
      }

      return result.fileName; // Dosya adını döndür (uzantı olmadan)
    } catch (err) {
      console.error('Fotoğraf yükleme hatası:', err);
      throw err;
    }
  };

  // YENİ ÜRÜN / MENÜ EKLEME FONKSİYONU - Backend'e POST request gönderir
  const handleAddItem = async () => {
    // Basit validasyon
    if (!formData.name || !formData.price || !formData.category) {
      alert('Lütfen isim, fiyat ve kategori alanlarını doldurun.');
      return;
    }

    try {
      setLoading(true);

      // Önce fotoğrafı yükle (eğer seçildiyse)
      let photoFileName = formData.proPhoto; // Eğer manuel olarak girildiyse kullan
      
      if (selectedFile) {
        photoFileName = await uploadPhoto(selectedFile);
      }

      // Sadece Ürünler için backend'e gönder
      if (activeCategory === 'Ürünler') {
        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            category: formData.category,
            price: formData.price,
            tag: formData.tag,
            proPhoto: photoFileName || '',
            // Stok adedini backend'e gönder
            stock: Number(formData.stock) || 0,
            description: formData.description || '',
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Ürün eklenirken bir hata oluştu');
        }

        // Başarılı ekleme sonrası ürün listesini yeniden çek
        await fetchProducts();

        // Formu temizle ve modalı kapat
        setFormData({
          name: '',
          category: '',
          price: '',
          proPhoto: '',
          tag: '',
          stock: '',
          content: '',
          description: '',
        });
        setSelectedFile(null);
        setPhotoPreview(null);
        setIsApprovalModalOpen(false);
        
        alert('Ürün başarıyla eklendi!');
      } else {
        // Menüler için backend'e gönder
        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            category: 'Menü', // Menüler için özel kategori
            price: formData.price,
            tag: '',
            proPhoto: photoFileName || '',
            stock: 0, // Menüler için stok yok
            description: formData.content || '', // Menü içeriği description olarak kaydediliyor
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Menü eklenirken bir hata oluştu');
        }

        // Başarılı ekleme sonrası menü listesini yeniden çek
        await fetchMenus();

        // Formu temizle ve modalı kapat
        setFormData({
          name: '',
          category: '',
          price: '',
          proPhoto: '',
          tag: '',
          stock: '',
          content: '',
          description: '',
        });
        setSelectedFile(null);
        setPhotoPreview(null);
        setIsApprovalModalOpen(false);
        
        alert('Menü başarıyla eklendi!');
      }
    } catch (err) {
      console.error('Ekleme hatası:', err);
      alert(err.message || 'Bir hata oluştu');
      setLoading(false);
    }
  };

  // Büyük küçük harfe duyarsız arama için normalize fonksiyonu (Türkçe karakter desteği ile)
  const normalizeString = (str) => {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Türkçe karakterleri normalize et
  };

  // Arama filtresi uygula
  const filteredProducts = products.filter((item) => {
    if (!searchQuery) return true;
    const query = normalizeString(searchQuery);
    return (
      normalizeString(item.name).includes(query) ||
      normalizeString(item.category).includes(query) ||
      normalizeString(item.tag).includes(query) ||
      item.id.toString().includes(query)
    );
  });

  const filteredMenus = menus.filter((item) => {
    if (!searchQuery) return true;
    const query = normalizeString(searchQuery);
    return (
      normalizeString(item.name).includes(query) ||
      normalizeString(item.content).includes(query) ||
      item.id.toString().includes(query)
    );
  });

  const currentDataList = activeCategory === 'Ürünler' ? filteredProducts : filteredMenus;

  // Şu anki sayfada gösterilecek verileri kesme
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = currentDataList.slice(indexOfFirstItem, indexOfLastItem)

  // Toplam sayfa sayısı
  const totalPages = Math.ceil(currentDataList.length / itemsPerPage)

  // Sayfa değiştirme fonksiyonu
  const paginate = (pageNumber) => setCurrentPage(pageNumber)


  const outOfStockItems = filteredProducts.filter(p => p.stockStatus === 'Stokta Yok');

  return (
    <><div className='ProductsContent'>

      <div className="row">

        <div className="table-container">

          {/* Üst kontrol bölümü */}
          <div className="controls-container">
            <div className="search-bar-product">
              <input 
                type="text" 
                placeholder={activeCategory === 'Ürünler' ? "Ürün Ara..." : "Menü Ara..."}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <div className="r-controls">
              <div className="category-dropdown">
                <select value={activeCategory} onChange={handleCategoryChange}>
                  <option value="Ürünler">Ürünler</option>
                  <option value="Menüler">Menüler</option>
                </select>
              </div>


              <div className="add-product">
                <button onClick={() => setIsApprovalModalOpen(true)}
                  className="btn-add-product"><IoIosAddCircleOutline /> Yeni Ürün / Menü Ekle</button>
              </div>

            </div>

          </div>


              {loading ? (
            <p>Veriler yükleniyor...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>Hata: {error}</p>
          ) : (
            <>

              {activeCategory === 'Ürünler' ? (
                <table className="content-table">
                  <thead>
                    <tr>
                      <th>Ürün ID</th>
                      <th>Ürün Adı</th>
                      <th>Kategori</th>
                      <th>Fiyat</th>
                      <th>Etiket</th>
                      <th>Fotoğraf</th>
                      <th>Stok Durumu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>{item.price} ₺</td>
                        <td>{item.tag}</td>
                        <td>{item.proPhoto}</td>
                        <td className={item.stockStatus === 'Stokta Yok' ? 'status-out' : 'status-in'}>
                          {item.stockStatus}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="content-table">
                  <thead>
                    <tr>
                      <th>Menü ID</th>
                      <th>Menü Adı</th>
                      <th>İçerik</th>
                      <th>Fotoğraf</th>
                      <th>KDV Oranı</th>
                      <th>Fiyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.content}</td>
                        <td>{/* Placeholder for menu image */}</td>
                        <td>{item.price} ₺ </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}


              <div className="pagination">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Önceki
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={currentPage === i + 1 ? 'active-page' : ''}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sonraki
                </button>
              </div>
            </>
          )}
        </div>


        <div className="out-of-stock">
          <h4>Stokta Olmayan Ürünler ({outOfStockItems.length})</h4>
          {loading ? <p>Yükleniyor...</p> : (
            <ul>
              {outOfStockItems.slice(0, 5).map(item => (
                <li key={item.id}>
                  <span className="stock-warning-icon">!</span>
                  {item.name} (ID: {item.id})
                </li>
              ))}
              {outOfStockItems.length > 5 && <li>... ve {outOfStockItems.length - 5} ürün daha.</li>}
            </ul>
          )}
        </div>
      </div>
    </div>

      <Modal isOpen={isApprovalModalOpen}
        onClose={() => {
          setIsApprovalModalOpen(false);
          // Formu temizle
          setFormData({
            name: '',
            category: '',
            price: '',
            proPhoto: '',
            tag: '',
            stock: '',
            content: '',
            description: '',
          });
          setSelectedFile(null);
          setPhotoPreview(null);
        }}
        title="Yeni Ürün / Menü Ekle"
      >
        {activeCategory === 'Ürünler' ? (
          <div>
            <h3>Yeni Ürün Ekleme Formu</h3>
            <div className="add-product-form">
            
  
              <div className="pro-name">
                <label>Ürün Adı:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ürün adı girin"
                />
              </div>

                 <div className="pro-description">
                <label>Ürün Açıklaması:</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Ürün açıklaması girin"
                />
              </div>


              <div className="pro-category">
                <label>Kategori:</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value=""></option>
                  <option value="Çorbalar">Çorbalar</option>
                  <option value="Ana Yemekler">Ana Yemekler</option>
                  <option value="Kebaplar">Kebaplar</option>
                  <option value="Fast Food">Fast Food</option>
                  <option value="İtalyan">İtalyan</option>
                  <option value="Hafif Lezzetler">Hafif Lezzetler</option>
                  <option value="Tatlılar">Tatlılar</option>
                  <option value="İçecekler">İçecekler</option>
                </select>
              </div>

              <div className="form-row1">
                <div className="kdv-group">
                    <label>Satış Fiyatı (TL):</label>
                    <input 
                        type="number" 
                        name="price" 
                        value={formData.price} 
                        onChange={handleInputChange} 
                        placeholder='Fiyatı girin'
                    />
                </div>
                
            </div>

              <div className="pro-tag">
                <label>Etiket:</label>
                <select
                  name="tag"
                  value={formData.tag}
                  onChange={handleInputChange}
                >
                  <option value=""></option>
                  <option value="Hızlı">Hızlı</option>
                  <option value="Şef">Şef</option>
                  <option value="Popüler">Popüler</option>
                  <option value="Yeni">Yeni</option>
                  <option value="Ekonomik">Ekonomik</option>
                  <option value="Vejetaryen">Vejetaryen</option>
                  <option value="Diyet">Diyet</option>
                  <option value="Soğuk">Soğuk</option>
                </select>

              </div>

              <div className="pro-photo">
                <label>Ürün Fotoğrafı:</label>
                <input
                  type="file"
                  name="proPhoto"
                  accept="image/*"
                  onChange={handleInputChange}
                />
                {photoPreview && (
                  <div style={{ marginTop: '10px' }}>
                    <img 
                      src={photoPreview} 
                      alt="Önizleme" 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '200px', 
                        borderRadius: '5px',
                        border: '1px solid #ddd'
                      }} 
                    />
                  </div>
                )}
                {selectedFile && (
                  <p style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                    Seçilen dosya: {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="pro-stock">
                <label>Stok Adedi:</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Stok adedini girin"
                />
              
              </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="btn-submit-product"
              >
                Ürün Ekle
              </button>

            </div>
          </div>
        ) : (
          <div>
            <h3>Yeni Menü Ekleme Formu</h3>
            <div className="add-menu-form">
              
              
              <div className="menu-name">
                <label>Menü Adı:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Menü adı girin"
                />
              </div>

              <div className="menu-content">
                <label>Menü İçeriği:</label>
                <input
                  type="text"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Menü içeriğini girin"
                />
              </div>

              <div className="menu-photo">
                <label>Menü Fotoğrafı:</label>
                <input
                  type="file"
                  name="proPhoto"
                  accept="image/*"
                  onChange={handleInputChange}
                />
                {photoPreview && (
                  <div style={{ marginTop: '10px' }}>
                    <img 
                      src={photoPreview} 
                      alt="Önizleme" 
                      style={{ 
                        maxWidth: '200px', 
                        maxHeight: '200px', 
                        borderRadius: '5px',
                        border: '1px solid #ddd'
                      }} 
                    />
                  </div>
                )}
                {selectedFile && (
                  <p style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                    Seçilen dosya: {selectedFile.name}
                  </p>
                )}
              </div>

              <div className="kdv-group">
                    <label>Satış Fiyatı (TL):</label>
                    <input 
                        type="number" 
                        name="price" 
                        value={formData.price} 
                        onChange={handleInputChange} 
                    />
                </div>

              <button
                type="button"
                onClick={handleAddItem}
                className="btn-submit-menu"
              >
                Menü Ekle
              </button>

            </div>
          </div>

        )}
      </Modal></>
  );
};


export default ProductsContent