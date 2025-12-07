import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MdOutlineFastfood, MdLocalCafe, MdOutlineWater, MdBakeryDining, MdDinnerDining, MdKebabDining, MdLocalPizza, MdRamenDining, MdVerified } from 'react-icons/md';
import './Menu.css';

import { Fade, Zoom } from 'react-awesome-reveal';


const menuData = [

  { id: 1, category: 'Çorbalar', name: 'Ezogelin Çorbası', price: 45, desc: 'Nane ve pul biber eşliğinde, doyurucu.', tag: 'Hızlı Teslim' },

  { id: 2, category: 'Ana Yemekler', name: 'Hünkar Beğendi', price: 180, desc: 'Közlenmiş patlıcan püresi üzerinde kuzu etli güveç.', tag: 'Şef Tavsiyesi' },

  { id: 3, category: 'Kebaplar', name: 'Adana Kebap', price: 160, desc: 'Acılı, zırh kıymasıyla hazırlanmış. Porsiyon.', tag: 'Yeni' },

  { id: 4, category: 'Fast Food', name: 'Cheeseburger Menü', price: 140, desc: 'Patates kızartması ve içecekle.', tag: 'Popüler' },
  { id: 5, category: 'Fast Food', name: 'Tavuk Dürüm', price: 95, desc: 'Lavaş içinde marine edilmiş tavuk, taze yeşilliklerle.', tag: 'Ekonomik' },

  { id: 6, category: 'İtalyan', name: 'Pepperoni Pizza (Orta)', price: 175, desc: 'Bol pepperoni ve mozzarella peyniri.', tag: 'Yeni' },
  { id: 7, category: 'İtalyan', name: 'Pesto Soslu Makarna', price: 120, desc: 'El yapımı pesto sos ve çam fıstığı.', tag: 'Vejetaryen' },

  { id: 8, category: 'Hafif Lezzetler', name: 'Izgara Tavuklu Salata', price: 110, desc: 'Akdeniz yeşillikleri ve özel sos.', tag: 'Diyet' },

  { id: 9, category: 'Tatlılar', name: 'Sufle', price: 70, desc: 'Sıcak servis, erimiş Belçika çikolatası.', tag: 'Popüler' },

  { id: 10, category: 'İçecekler', name: 'Ev Yapımı Limonata', price: 40, desc: 'Taze nane yapraklarıyla.', tag: 'Soğuk' },
];

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


const MenuItemCard = ({ item }) => (
  <div className="menu-item-card">
    <div className="item-image-placeholder">
      <img src={`/assets/menu/${item.id}.jpg`} alt={item.name} />
    </div>
    <div className="item-details">
      <div className="item-header">
        <h3>{item.name}</h3>
        <span className={`item-tag tag-${item.tag.split(' ')[0]}`}>{item.tag}</span>
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
  const [activeCategory, setActiveCategory] = useState('Hepsi');

  const filteredMenu = menuData.filter(item =>
    activeCategory === 'Hepsi' || item.category === activeCategory
  );

  return (
    <>
      <Navbar />



      <div className="menu-page container">

        <Fade direction="left" triggerOnce >
          <div className="sidebar">
            <div className="category-filter-bar mb-5">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  className={`filter-btn ${activeCategory === cat.name ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat.name)}
                >
                  <cat.icon size={20} style={{ marginRight: '8px' }} />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>


        </Fade>


        <section className="menu-list-section">
          
            <div className="menu-items-grid">
              {filteredMenu.length > 0 ? (
               
                filteredMenu.map(item => (
                  <MenuItemCard key={item.id} item={item} />
                  
                ))
               
              ) : (
                <p className="no-items-message">Seçili kategoride henüz ürün bulunmamaktadır.</p>
                
              )}
            </div>

           
          
        </section>

      </div>

      <Footer />


    </>
  );
};

export default Menu;