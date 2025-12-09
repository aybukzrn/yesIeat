import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  MdOutlineFastfood, MdLocalCafe, MdOutlineWater,
  MdBakeryDining, MdDinnerDining, MdKebabDining,
  MdLocalPizza, MdRamenDining
} from 'react-icons/md';
import './Menu.css';
import { Fade } from 'react-awesome-reveal';

const menuData = [
  { id: 1, category: 'Çorbalar', name: 'Ezogelin Çorbası', price: 45, desc: 'Nane ve pul biber eşliğinde, doyurucu.', tag: 'Hızlı Teslim' },
  { id: 2, category: 'Ana Yemekler', name: 'Hünkar Beğendi', price: 180, desc: 'Közlenmiş patlıcan püresi.', tag: 'Şef Tavsiyesi' },
  { id: 3, category: 'Kebaplar', name: 'Adana Kebap', price: 160, desc: 'Acılı, zırh kıymasıyla.', tag: 'Yeni' },
  { id: 4, category: 'Fast Food', name: 'Cheeseburger Menü', price: 140, desc: 'Patates ve içecekle.', tag: 'Popüler' },
  { id: 5, category: 'Fast Food', name: 'Tavuk Dürüm', price: 95, desc: 'Marine edilmiş tavuk.', tag: 'Ekonomik' },
  { id: 6, category: 'İtalyan', name: 'Pepperoni Pizza', price: 175, desc: 'Bol mozzarella.', tag: 'Yeni' },
  { id: 7, category: 'İtalyan', name: 'Pesto Makarna', price: 120, desc: 'El yapımı pesto.', tag: 'Vejetaryen' },
  { id: 8, category: 'Hafif Lezzetler', name: 'Tavuklu Salata', price: 110, desc: 'Akdeniz yeşillikleri.', tag: 'Diyet' },
  { id: 9, category: 'Tatlılar', name: 'Sufle', price: 70, desc: 'Belçika çikolatası.', tag: 'Popüler' },
  { id: 10, category: 'İçecekler', name: 'Limonata', price: 40, desc: 'Taze nane ile.', tag: 'Soğuk' },
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


  const [selectedTags, setSelectedTags] = useState([]);


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


  const availableTags = [
    'Hepsi',
    ...new Set(
      menuData
        .filter(item => activeCategory === 'Hepsi' || item.category === activeCategory)
        .map(item => item.tag)
    )
  ];


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
            {filteredMenu.length > 0 ? (
              filteredMenu.map(item => (
                <MenuItemCard key={item.id} item={item} />
              ))
            ) : (
              <p className="no-items-message">
                Seçili filtrelerde ürün bulunamadı.
              </p>
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