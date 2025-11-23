import React, { useState, useEffect } from 'react';
import './ProductsContent.css';

const ProductsContent = () => {

  const [activeCategory, setActiveCategory] = useState('Ürünler');
  const [products, setProducts] = useState([])
  const [menus, setMenus] = useState([])
  const [loading, setLoading] = useState(true)


  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10


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
    <div className='ProductsContent'>

      <div className="row">

        <div className="table-container">

          {/* Üst kontrol bölümü */}
          <div className="controls-container">
            <div className="search-bar">
              <input type="text" placeholder="Ürün Ara..." />
            </div>

            <div className="category-dropdown">
              <select value={activeCategory} onChange={handleCategoryChange}>
                <option value="Ürünler">Ürünler</option>
                <option value="Menüler">Menüler</option>
              </select>
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
                      <th>Fiyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.content}</td>
                        <td>{item.price} ₺</td>
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
  )
}

export default ProductsContent