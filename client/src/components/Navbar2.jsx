import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { RiAccountCircleFill } from "react-icons/ri";
import { FaBasketShopping } from "react-icons/fa6";
import { Fade } from "react-awesome-reveal";
import CustomDropdown from './CustomDropdown';

const Navbar = () => {
    const getCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    };

    const [cartCount, setCartCount] = useState(getCartCount());

    useEffect(() => {
        const syncCartCount = () => setCartCount(getCartCount());
        syncCartCount();
        window.addEventListener('cartUpdated', syncCartCount);
        window.addEventListener('storage', syncCartCount);
        return () => {
            window.removeEventListener('cartUpdated', syncCartCount);
            window.removeEventListener('storage', syncCartCount);
        };
    }, []);

    return (
        <nav className="navbar">
            <div className="up-section">
                <div className="navbar-brand">
                    <Fade direction="left" triggerOnce>
                        <Link to="/home">
                            <img src="assets/LoginPages/logo.png" className="navbar-logo" />
                        </Link>
                    </Fade>
                </div>

                <div className="search-bar">
                    <input type="text" placeholder="Ne Yemek İstersin?" />
                </div>

                <div className="right-section">
                    <div className="account">
                        <div className="acc-icon"><RiAccountCircleFill /></div>
                        <div className="acc-dropdown">
                            <CustomDropdown title="Hesabım">
                                <a href="/account">Siparişleirm</a>
                                <a href="/account">Profilim</a>
                                <a href="/">Çıkış Yap</a>
                            </CustomDropdown>
                        </div>
                    </div>

                    <div className="cart">
                        <Link to="/cart">
                            <button className="cart-button">
                                <FaBasketShopping />
                                <div className="text">Sepetim</div>
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;