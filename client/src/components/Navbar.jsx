import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { RiAccountCircleFill } from "react-icons/ri";
import { FaBasketShopping } from "react-icons/fa6";
import { Fade } from "react-awesome-reveal";
import { TbPhoneCall } from "react-icons/tb";
import CustomDropdown from '../components/CustomDropdown';
import { MdMenu, MdClose, MdHome, MdMenuBook, MdAccountCircle } from 'react-icons/md';
import { MdShoppingBasket } from "react-icons/md";
import { MdContactSupport } from "react-icons/md";



const Navbar = ({ searchQuery = '', onSearchChange = null }) => {
    const [user, setUser] = useState(null);
        const [accountTitle, setAccountTitle] = useState('Hesabım');
        const location = useLocation();
        const navigate = useNavigate();
        const isMenuPage = location.pathname === '/menu';

 useEffect(() => {
        // Session'dan giriş yapılmış mı diye bakıyoruz
        const isLoggedIn = sessionStorage.getItem('userLoggedIn');
        
        if (isLoggedIn === 'true') {
            // localStorage'dan user bilgisini al
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
                } catch (err) {
                    console.error('User data parse hatası:', err);
                }
            }
            
            // SessionStorage'dan isim ve soyisim al
            const userName = sessionStorage.getItem('userName') || '';
            const userSurname = sessionStorage.getItem('userSurname') || '';
            
            if (userName && userSurname) {
                const lastInitial = userSurname.charAt(0).toUpperCase();
                setAccountTitle(userName + ' ' + lastInitial + '.');
            } else {
                setAccountTitle('Hesabım');
            }
        } else {
            setUser(null);
            setAccountTitle('Giriş Yap');
        }
    }, [location.pathname]); // Sayfa değiştiğinde kontrol et

    const handleLogout = (e) => {
        if (e) e.preventDefault();
        // Session'ı temizle
        sessionStorage.clear();
        // LocalStorage'dan user'ı temizle
        localStorage.removeItem('user');
        // Kullanıcı state'ini sıfırla
        setUser(null);
        setAccountTitle('Hesabım');
        // Ana sayfaya yönlendir ve sayfayı tazele
        window.location.href = '/'; 
    };

    
    // Eğer prop'tan gelmiyorsa, localStorage'dan oku veya boş string kullan
    const [localSearchQuery, setLocalSearchQuery] = useState(() => {
        if (onSearchChange) return searchQuery;
        return localStorage.getItem('globalSearchQuery') || '';
    });

    const getCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [cartCount, setCartCount] = useState(getCartCount());

    // Menü sayfasında değilsek, localStorage'dan oku
    useEffect(() => {
        if (!isMenuPage && !onSearchChange) {
            const stored = localStorage.getItem('globalSearchQuery') || '';
            setLocalSearchQuery(stored);
        }
    }, [isMenuPage, onSearchChange]);

    // Arama değiştiğinde
    const handleSearchChange = (value) => {
        if (isMenuPage && onSearchChange) {
            // Menü sayfasında: real-time arama
            onSearchChange(value);
        } else {
            // Diğer sayfalarda: sadece local state'i güncelle
            setLocalSearchQuery(value);
            localStorage.setItem('globalSearchQuery', value);
        }
    };

    // Enter'a basıldığında
    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            const query = isMenuPage ? searchQuery : localSearchQuery;
            if (query.trim()) {
                // Menü sayfasında değilsek, menü sayfasına yönlendir
                if (!isMenuPage) {
                    localStorage.setItem('globalSearchQuery', query);
                    navigate('/menu');
                }
            }
        }
    };

    // Aktif arama query'si
    const activeSearchQuery = isMenuPage && onSearchChange ? searchQuery : localSearchQuery;

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
    const isUserLoggedIn = user !== null;

    return (

        <nav className="navbar">

            <div className="up-section">

                <div className="navbar-brand">

                    <Fade direction="left" triggerOnce>

                        <Link to="/">

                            <img src="assets/LoginPages/logo.png" className="navbar-logo" />
                        </Link>
                    </Fade>
                </div>

                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Ne Yemek İstersin?" 
                        value={activeSearchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                    />
                </div>
                



                <div className="right-section">

                    <div className="account">
    <div className="acc-icon"><RiAccountCircleFill /></div>
    <div className="acc-dropdown">
        <CustomDropdown title={accountTitle}>
            {isUserLoggedIn ? (
                /* Birden fazla eleman olduğu için <> </> (Fragment) içine aldık */
                <>
                    <Link to="/account">Siparişlerim</Link>
                    <Link to="/account">Profilim</Link>
                    <Link to="/" onClick={handleLogout}>Çıkış Yap</Link>
                </>
            ) : (
                /* Burada tek bir Link olduğu için kapsayıcıya gerek yok ama olsa da zarar etmez */
                <Link to="/login">Giriş Yap</Link>
            )}
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

            <div className="down-section">

                <ul className="navbar-links">
                    <li>

                        <Link to="/" className="nav-link">
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
                        <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
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
                        <Link to="/cart" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                            <MdShoppingBasket size={18} /> Sepetim {cartCount > 0 && <span className="cart-badge inline-badge">{cartCount}</span>}
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