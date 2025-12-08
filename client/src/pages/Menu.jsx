import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MdOutlineFastfood, MdLocalCafe, MdOutlineWater, MdBakeryDining, MdDinnerDining, MdKebabDining, MdLocalPizza, MdRamenDining, MdVerified } from 'react-icons/md';
import './Menu.css';

import { Fade, Zoom } from 'react-awesome-reveal';
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


const MenuItemCard = ({ item }) => {
  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = existingCart.find(cartItem => cartItem.id === item.id);

    let updatedCart;
    if (existingItem) {
      updatedCart = existingCart.map(cartItem => cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1} : cartItem);
    } else {
      updatedCart = [...existingCart, {
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: 1,
      }];
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className="menu-item-card">
      <div className="item-image-placeholder">
      <img src={`/assets/menu/${item.id}.jpg`} alt={item.name} />
    </div>
    <div className="item-header">
      <h3>{item.name}</h3>
      <span className={`item-tag tag-${item.tag.split(' ')[0]}`}>{item.tag}</span>
    </div>
    <p className="item-desc">{item.desc}</p>
    <div className="item-footer">
      <span className="item-price">{item.price} ₺</span>
      <button className="add-to-cart-btn" onClick={handleAddToCart}>Sepete Ekle</button>
    </div>
    </div>
  );
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState('Hepsi');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch('/api/menu');
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        console.error('Error fetching menu items:', err);
      }
    };
    fetchMenu();
  }, []);

  const filteredMenu = menuItems.filter((item) =>
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
                filteredMenu.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))
              ) : (
                <p className="no-items-message">
                  Seçili kategoride henüz ürün bulunmamaktadır.
                </p>
              )}
            </div>

           
          
        </section>

      </div>

      <Footer />


    </>
  );
};

export default Menu;