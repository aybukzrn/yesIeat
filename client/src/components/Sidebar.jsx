import React, { useState } from 'react';
import './Sidebar.css';
import { TbReportAnalytics } from 'react-icons/tb';
import { AiFillProduct } from 'react-icons/ai';
import { LiaSignOutAltSolid } from "react-icons/lia";
import { MdShoppingCartCheckout } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';

const categories = [
    { name: 'Analiz', icon: TbReportAnalytics },
    { name: 'Ürünler', icon: AiFillProduct },
    { name: 'Siparişler', icon: MdShoppingCartCheckout },
    { name: 'Ayarlar', icon: IoIosSettings },
];

const Sidebar = ({ activeCategory, setActiveCategory }) => {

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        
        navigate("/adminlogin"); 
    };

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

            <div className="log-out-btn">
                <button 
                    className="m-filter-btn"
                    onClick={() => setIsLogoutModalOpen(true)}
                >
                    <LiaSignOutAltSolid size={20} style={{ marginRight: '8px' }} />
                    Çıkış
                </button>
            </div>

            {/* ÇIKIŞ ONAYI */}
            <Modal 
                isOpen={isLogoutModalOpen} 
                onClose={() => setIsLogoutModalOpen(false)} 
                title="Çıkış Yap"
                className="small-modal"
            >
                <p style={{color: '#000'}}>Çıkış yapmak istediğinize emin misiniz?
                </p>

                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    marginTop: '20px'
                    
                }}>
                    <button 
                        onClick={() => setIsLogoutModalOpen(false)}
                        style={{
                            padding: '8px 15px',
                            background: '#ccc',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        Vazgeç
                    </button>

                    <button 
                        onClick={handleLogout}
                        style={{
                            padding: '8px 15px',
                            background: '#e74c3c',
                            border: 'none',
                            borderRadius: '6px',
                            color: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        Çıkış Yap
                    </button>
                </div>
            </Modal>

        </div>
    );
};

export default Sidebar;
