import React from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import './Contact.css';
import { useState } from 'react';
import { RiAccountCircleFill } from "react-icons/ri";
import { FaBasketShopping } from "react-icons/fa6";
import { GiFoodTruck } from "react-icons/gi";
import { Fade } from "react-awesome-reveal";


import IletisimContent from './Legal/IletisimContent';
import GuvenlikContent from './Legal/GuvenlikContent';
import KvkkContent from './Legal/KvkkContent';

const categories = [
    { name: 'İletişim', link: '/iletisim' },
    { name: 'Güvenlik', link: '/guvenli-alisveris' },
    { name: 'KVKK Güvenlik Politikası', link: '/kisisel-verilerin-korunmasi' },
    { name: 'İletişim Aydınlatma Metni', link: '/iletisim-aydinlatma-metni' },
    { name: 'Çerez Politikası', link: '/cerez-politikasi' },
];


const Contact = () => {

    const [activeCategory, setActiveCategory] = useState(categories[0].name);

    const activeItem = categories.find(cat => cat.name === activeCategory);



    const getContentComponent = (categoryName) => {
        switch (categoryName) {
            case 'İletişim':
                return <IletisimContent />;
            case 'Güvenlik':
                return <GuvenlikContent />;
            case 'KVKK Güvenlik Politikası':
                return <KvkkContent />;
            case 'İletişim Aydınlatma Metni':
                return (
                    <div>
                        <h3>Aydınlatma Metni</h3>
                        <p>Bu metin uzun bir yasal metindir...</p>
                    </div>
                );
            case 'Çerez Politikası':
                return <div>Çerez politikası detayları.</div>;

            default:
                return <h2>Lütfen bir başlık seçin.</h2>;
        }
    };

    return (
        <div>
            
            <div className="navbar">
            <div className="up-section">

                <div className="navbar-brand">

                <Fade direction="left" triggerOnce>

                    <Link to="/">
                        <span className="logo-text"><GiFoodTruck className='logo-icon' /> Hazır Yemek  </span>
                    </Link>

                </Fade>
                </div>

                <div className="search-bar">
                    <input type="text" placeholder="" />


                </div>


                <div className="right-section">

                    <div className="account">
                        <Link to="/account" >
                            <RiAccountCircleFill className='acc-icon'/> Hesabım 
                        </Link>
                    </div>


                </div>

            </div>

            </div>


            <div className="content-page-layout">

                <div className="sidebar">
                    <div className="category-filter-bar mb-5">
                        {categories.map((cat) => (
                            <button
                                key={cat.name}
                                className={`filter-btn ${activeCategory === cat.name ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.name)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>


                <section className="contact-section">
                    <h2 className='section-title mb-4'>{activeItem ? activeCategory : '' }</h2>

                    <div className="content-content">
                        <div className="content-item">
                            {getContentComponent(activeCategory)}
                        </div>
                    </div>
                </section>

            </div>


            <Footer />

        </div>
    )
}

export default Contact
