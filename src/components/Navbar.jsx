import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { RiAccountCircleFill } from "react-icons/ri";
import { FaBasketShopping } from "react-icons/fa6";
import { Fade } from "react-awesome-reveal";
import { TbPhoneCall } from "react-icons/tb";
import CustomDropdown from '../components/CustomDropdown';


import { useState } from 'react';
import { MdMenu, MdClose, MdHome, MdMenuBook, MdAccountCircle } from 'react-icons/md';
import { MdShoppingBasket } from "react-icons/md";
import { MdContactSupport } from "react-icons/md";







const Navbar = () => {


    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };


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

                <button className="hamburger-menu" onClick={toggleMenu}>
                    {isMenuOpen ? <MdMenu size={28} /> : <MdClose size={28} />}
                </button>



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
                            <button className="cart-button"><FaBasketShopping /><div className="text">Sepetim</div></button>

                        </Link>
                    </div>


                </div>

            </div>

            <div className="down-section">

                <ul className="navbar-links">
                    <li>

                        <Link to="/home" className="nav-link">
                            Anasayfa
                        </Link>
                    </li>
                    <li>

                        <Link to="/menu" className="nav-link">
                            Menü
                        </Link>
                    </li>

                    <li>
                        <Link to="/contact" className="nav-link">
                            İletişim
                        </Link>
                    </li>

                </ul>

                <div>
                    <button className="call-button"><TbPhoneCall /><p>Sipariş İçin Arayın</p></button>

                </div>
            </div>



            {/* Toggle Menu-Responsive */}

            <div className="responsive-link">

                <ul className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
                    <li>
                        <Link to="/home" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                            <MdHome size={18} /> Anasayfa
                        </Link>
                    </li>
                    <li>
                        <Link to="/menu" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                            <MdMenuBook size={18} /> Menü
                        </Link>
                    </li>
                    <li>
                        <Link to="/account" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                            <MdAccountCircle size={18} /> Hesabım
                        </Link>
                    </li>
                    <li>
                        <Link to="/contact" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                            <MdContactSupport size={18} /> İletişim
                        </Link>
                    </li>


                    {/* <li className="mobile-only-action">
                        <button className="cart-button">Sepet (0)</button>
                    </li> */}

                    <div className='responsive-call'>
                        <button className="call-button"><TbPhoneCall /><p>Sipariş İçin Arayın <br />(0312) 318 05 83</p></button>
                            
                    </div>
                </ul>

            </div>





        </nav>
    );
};

export default Navbar;