import React from 'react'
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import './Account.css';
import { useState } from 'react';

import SiparisContent from './Legal2/SiparisContent';
import KullaniciBilgilerimContent from './Legal2/KullaniciBilgilerimContent';
import KayitliKartlarımContent from './Legal2/KayitliKartlarımContent';
import KayitliAdreslerimContent from './Legal2/KayitliAdreslerimContent';


const categories = [
    { name: 'Siparişlerim', link: '/siparislerim' },
    { name: 'Kullanıcı Bilgilerim', link: '/kullanici-bilgilerim' },
    { name: 'Kayıtlı Kartlarım', link: '/kayitli-kartlarim' },
    { name: 'Kayıtlı Adreslerim', link: '/kayitli-adreslerim' },

];

const Account = () => {
  
    const [activeCategory, setActiveCategory] = useState(categories[0].name);

    const activeItem = categories.find(cat => cat.name === activeCategory);


    const getContentComponent = (categoryName) => {
        switch (categoryName) {
            case 'Kullanıcı Bilgilerim':
                return <KullaniciBilgilerimContent />;
            case 'Siparişlerim':
                return <SiparisContent />;
            case 'Kayıtlı Kartlarım':
                return <KayitliKartlarımContent />;
            case 'Kayıtlı Adreslerim':
                return <KayitliAdreslerimContent />;
           

            default:
                return <h2>Lütfen bir başlık seçin.</h2>;
        }
    };

    return (
        <div>
            
            <Navbar2 />


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

export default Account
