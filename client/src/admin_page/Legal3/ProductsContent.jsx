import React, { useState, useEffect } from 'react';
import './ProductsContent.css';
import { IoIosAddCircleOutline } from 'react-icons/io';
import Modal from '../../components/Modal';

const ProductsContent = () => {

  const [activeCategory, setActiveCategory] = useState('Ürünler');
  const [products, setProducts] = useState([])
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)


  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    taxRate: '10', 
    proPhoto: '',
    tag: 'yeni',
    stockStatus: 'Stokta Var',
    content: '' // Sadece menüler için
  });

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);

      setTimeout(() => {


        const mockProducts = Array.from({ length: 25 }, (_, i) => ({
          id: 100 + i,
          name: i % 3 === 0 ? `Ev Yapımı Limonata ${i + 1}` : `Pesto Soslu Makarna ${i + 1}`,
          category: i % 3 === 0 ? 'İçecekler' : 'İtalyan',
          price: (i + 1) * 10,
          stockStatus: i % 5 === 0 ? 'Stokta Yok' : 'Stokta Var' // Her 5 üründen biri yok
        }))


        const mockMenus = Array.from({ length: 15 }, (_, i) => ({
          id: 200 + i,
          name: `Süper Menü ${i + 1}`,
          content: 'Burger, Patates, İçecek',
          price: 150 + (i * 5)
        }));

        setProducts(mockProducts)
        setMenus(mockMenus)
        setLoading(false)
      }, 500)
    };

    fetchData()
  }, [])


  const handleCategoryChange = (e) => {
    setActiveCategory(e.target.value)
    setCurrentPage(1)
  };

  // Form verilerini güncelleyen fonksiyon
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // YENİ ÜRÜN / MENÜ EKLEME FONKSİYONU
  const handleAddItem = () => {
    // Basit validasyon
    if (!formData.name || !formData.price) {
      alert("Lütfen isim ve fiyat alanlarını doldurun.");
      return;
    }

    const newItem = {
      id: Date.now(), // Geçici ID
      ...formData,
      price: Number(formData.price),
      taxRate: Number(formData.taxRate)
    };

    if (activeCategory === 'Ürünler') {
      setProducts([newItem, ...products]);
    } else {
      setMenus([newItem, ...menus]);
    }

    // Formu temizle ve modalı kapat
    setFormData({ name: '', category: '', price: '', taxRate: '10', stockStatus: 'Stokta Var', tag: 'yeni', content: '' });
    setIsAddModalOpen(false);
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
                        <td>{item.price} ₺
                        <span className="net-price-info"> (Net: {(item.price / (1 + item.taxRate/100)).toFixed(2)})</span></td>
                        <td>{item.taxRate || 10} %</td>
                        <td>{item.label}</td>
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
                <input type="text" id='pro-name' placeholder="Ürün adı girin" />
              </div>
              <div className="pro-category">
                <label>Kategori:</label>
                <input type="text" id='pro-category' placeholder="Kategori girin" />
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
                <select>
                  <option value="hizli">Hızlı</option>
                  <option value="sef">Şef</option>
                  <option value="populer">Popüler</option>
                  <option value="yeni">Yeni</option>
                  <option value="ekonomik">Ekonomik</option>
                  <option value="vejetaryen">Vejetaryen</option>
                  <option value="diyet">Diyet</option>
                  <option value="soguk">Soğuk</option>
                </select>

              </div>

              <div className="pro-photo">
                <label>Ürün Fotoğrafı:</label>
                <input type="file" id='pro-photo' />
              </div>

              <div className="pro-fee">
                <label>Fiyat:</label>
                <input type="number" id='pro-fee' placeholder="Fiyat girin" />
              </div>
              
              <div className="pro-stock">
                <label>Stok Durumu:</label>
                <select>
                  <option value="in">Stokta Var</option>
                  <option value="out">Stokta Yok</option>
                </select>
              
              </div>

              <button
                        type="button"
                        onClick={() => {
                            const newProduct = {
                                id: String(Date.now()),
                                customer: document.getElementById("pro-name").value,
                                content: document.getElementById("pro-category").value,
                                total: Number(document.getElementById("pro-fee").value),
                                stockStatus: document.querySelector(".pro-stock select").value === "in" ? "Stokta Var" : "Stokta Yok"
                                
                            };

                            handleAddOrder(newProduct);
                            setIsAddOrderModalOpen(false);
                        }}
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
                <input type="text" id='menu-name' placeholder="Menü adı girin" />
              </div>

              <div className="menu-content">
                <label>Menü İçeriği:</label>
                <input type="text" id='menu-content' placeholder="Menü içeriğini girin" />
              </div>

              <div className="menu-photo">
                <label>Menü Fotoğrafı:</label>
                <input type="file" id='menu-photo' />
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


              <div className="menu-fee">
                <label>Fiyat:</label>
                <input type="number" id='menu-fee' placeholder="Fiyat girin" />
              </div>
              

              <button
                        type="button"
                        onClick={() => {
                            const newMenu = {
                                id: String(Date.now()),
                                customer: document.getElementById("menu-name").value,
                                content: document.getElementById("menu-content").value,
                                total: Number(document.getElementById("menu-fee").value),
                                
                          
                            };

                            handleAddOrder(newMenu);
                            setIsAddOrderModalOpen(false);
                        }}
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