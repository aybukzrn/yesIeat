import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { RiAccountCircleFill } from "react-icons/ri";
import { FaBasketShopping } from "react-icons/fa6";
import { IoSearchCircle } from "react-icons/io5";
import { GiFoodTruck } from "react-icons/gi";
import { Fade } from "react-awesome-reveal";



const Navbar = () => {


    return (

        <nav className="navbar">

            <div className="up-section">

                <div className="navbar-brand">

                    <Fade direction="left" triggerOnce>

                        <Link to="/home">
                            <span className="logo-text"><GiFoodTruck className='logo-icon' /> Hazır Yemek  </span>
                        </Link>

                    </Fade>
                </div>

                <div className="search-bar">
                    <input type="text" placeholder="Ne Yemek İstersin?" />


                </div>


                <div className="right-section">

                    <div className="account">
                        <Link to="/account" >
                            <RiAccountCircleFill className='acc-icon' /> Hesabım
                        </Link>
                    </div>

                    <div className="navbar-actions">
                        <Link to="/cart">
                            <button className="cart-button"><FaBasketShopping /></button>
                        </Link>
                    </div>


                </div>

            </div>


        </nav>
    );
};

export default Navbar;