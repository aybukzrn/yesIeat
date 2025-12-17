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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    taxRate: '10',
    proPhoto: '',
    tag: 'yeni',
    stockStatus: 'Stokta Var',
    content: '', // Sadece menüler için
    description: '' // Ürün açıklaması
  });

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
        taxRate: 10,
        tag: item.tag || '',
        stockStatus: 'Stokta Var',
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

  // Admin ürün tablosunu backend'deki /api/menu endpointine bağla
  useEffect(() => {
    fetchProducts();
  }, []);


  const handleCategoryChange = (e) => {
    setActiveCategory(e.target.value);
    setCurrentPage(1);
  };

  // Form verilerini güncelleyen fonksiyon
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // YENİ ÜRÜN / MENÜ EKLEME FONKSİYONU - Backend'e POST request gönderir
  const handleAddItem = async () => {
    // Basit validasyon
    if (!formData.name || !formData.price || !formData.category) {
      alert('Lütfen isim, fiyat ve kategori alanlarını doldurun.');
      return;
    }

    // Sadece Ürünler için backend'e gönder (Menüler için henüz endpoint yok)
    if (activeCategory === 'Ürünler') {
      try {
        setLoading(true);
        
        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            category: formData.category,
            price: formData.price,
            taxRate: formData.taxRate,
            tag: formData.tag,
            proPhoto: formData.proPhoto,
            stockStatus: formData.stockStatus,
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
          taxRate: '10',
          proPhoto: '',
          tag: 'yeni',
          stockStatus: 'Stokta Var',
          content: '',
          description: '',
        });
        setIsApprovalModalOpen(false);
        
        alert('Ürün başarıyla eklendi!');
      } catch (err) {
        console.error('Ürün ekleme hatası:', err);
        alert(err.message || 'Ürün eklenirken bir hata oluştu');
        setLoading(false);
      }
    } else {
      // Menüler için henüz backend endpoint'i yok, sadece local state'e ekle
      const newItem = {
        id: Date.now(),
        ...formData,
        price: Number(formData.price),
        taxRate: Number(formData.taxRate),
      };
      setMenus(prev => [newItem, ...prev]);

      // Formu temizle ve modalı kapat
      setFormData({
        name: '',
        category: '',
        price: '',
        taxRate: '10',
        proPhoto: '',
        tag: 'yeni',
        stockStatus: 'Stokta Var',
        content: '',
        description: '',
      });
      setIsApprovalModalOpen(false);
    }
  };

  const currentDataList = activeCategory === 'Ürünler' ? products : menus;

  // Şu anki sayfada gösterilecek verileri kesme
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = currentDataList.slice(indexOfFirstItem, indexOfLastItem)

  // Toplam sayfa sayısı
  const totalPages = Math.ceil(currentDataList.length / itemsPerPage)

  // Sayfa değiştirme fonksiyonu
  const paginate = (pageNumber) => setCurrentPage(pageNumber)


  const outOfStockItems = products.filter(p => p.stockStatus === 'Stokta Yok');

  return (
    <><div className='ProductsContent'>

      <div className="row">

        <div className="table-container">

          {/* Üst kontrol bölümü */}
          <div className="controls-container">
            <div className="search-bar-product">
              <input type="text" placeholder="Ürün Ara..." />
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
                      <th>KDV Oranı</th>
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
                        <td>
                          {item.price} ₺
                          <span className="net-price-info">
                            {' '}
                            (Net:{' '}
                            {(item.price / (1 + (item.taxRate || 10) / 100)).toFixed(2)}
                            )
                          </span>
                        </td>
                        <td>{item.taxRate || 10} %</td>
                        <td>{item.tag}</td>
                        <td>{/* Placeholder for product image */}</td>
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
                        <td>{item.taxRate || 10} %</td>
                        <td>{item.price} ₺
                        <span className="net-price-info"> (Net: {(item.price / (1 + item.taxRate/100)).toFixed(2)})</span></td>
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
        onClose={() => setIsApprovalModalOpen(false)}
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
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="Kategori girin"
                />
              </div>

              <div className="form-row">
                <div className="kdv-group">
                    <label>Satış Fiyatı (TL):</label>
                    <input 
                        type="number" 
                        name="price" 
                        value={formData.price} 
                        onChange={handleInputChange} 
                    />
                </div>
                <div className="kdv-group">
                    <label>KDV Oranı (%):</label>
                    <select name="taxRate" value={formData.taxRate} onChange={handleInputChange}>
                        <option value="1">%1 (Hizmet)</option>
                        <option value="10">%10 (İçecek)</option>
                        <option value="20">%20 (Yemek)</option>
                    </select>
                </div>
            </div>

              <div className="pro-tag">
                <label>Etiket:</label>
                <select
                  name="tag"
                  value={formData.tag}
                  onChange={handleInputChange}
                >
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
                <label>Ürün Fotoğrafı (opsiyonel):</label>
                <input
                  type="text"
                  name="proPhoto"
                  value={formData.proPhoto}
                  onChange={handleInputChange}
                  placeholder="Fotoğraf adı (menu görselleri ile uyumlu)"
                />
              </div>

              <div className="pro-stock">
                <label>Stok Durumu:</label>
                <select
                  name="stockStatus"
                  value={formData.stockStatus}
                  onChange={handleInputChange}
                >
                  <option value="Stokta Var">Stokta Var</option>
                  <option value="Stokta Yok">Stokta Yok</option>
                </select>
              
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
                <label>Menü Fotoğrafı (opsiyonel):</label>
                <input
                  type="text"
                  name="proPhoto"
                  value={formData.proPhoto}
                  onChange={handleInputChange}
                  placeholder="Fotoğraf adı (menu görselleri ile uyumlu)"
                />
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
                <div className="kdv-group">
                    <label>KDV Oranı (%):</label>
                    <select name="taxRate" value={formData.taxRate} onChange={handleInputChange}>
                        <option value="1">%1 (Hizmet)</option>
                        <option value="10">%10 (İçecek)</option>
                        <option value="20">%20 (Yemek)</option>
                    </select>
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