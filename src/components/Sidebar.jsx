import React from 'react'
import './Sidebar.css'
import { TbReportAnalytics } from 'react-icons/tb';
import { AiFillProduct } from 'react-icons/ai';
import { LiaSignOutAltSolid } from "react-icons/lia";
import { BsPeopleFill } from "react-icons/bs";
import { MdShoppingCartCheckout } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";




const categories = [
    { name: 'Analiz', icon: TbReportAnalytics },
    { name: 'Ürünler', icon: AiFillProduct },
    { name: 'Siparişler', icon: MdShoppingCartCheckout },
    // { name: 'Müşteriler', icon: BsPeopleFill },
    { name: 'Ayarlar', icon: IoIosSettings },
    { name: 'Çıkış', icon: LiaSignOutAltSolid },
];

const Sidebar = ({ activeCategory, setActiveCategory }) => {


    return (

        <div className="m-sidebar-container">
            <div className="admin-logo">
                <div className="logo-content">
                    <img src="assets/LoginPages/logo.png" />
                </div>
                <div className="m-logo-text">
                    <h2>Yönetici Paneli</h2>
                </div>
            </div>

            <div className="m-category-filter-bar">
                {categories.map((cat) => (
                    <button
                        key={cat.name}

                        className={`m-filter-btn ${activeCategory === cat.name ? 'active' : ''}`}

                        onClick={() => setActiveCategory(cat.name)}
                    >
                        <cat.icon size={20} style={{ marginRight: '8px' }} />
                        {cat.name}
                    </button>
                ))}
            </div>


        </div>

    )
}

export default Sidebar
