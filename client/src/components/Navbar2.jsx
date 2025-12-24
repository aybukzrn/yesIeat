import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { RiAccountCircleFill } from "react-icons/ri";
import { FaBasketShopping } from "react-icons/fa6";
import { Fade } from "react-awesome-reveal";
import CustomDropdown from './CustomDropdown';

const Navbar = () => {
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

    const handleLogout = () => {
        // Session'ı temizle
        sessionStorage.clear();
        // LocalStorage'dan user'ı temizle
        localStorage.removeItem('user');
        // Sepeti temizle
        localStorage.removeItem('cart');
        // Sepet güncelleme eventi gönder
        window.dispatchEvent(new Event('cartUpdated'));
        // Kullanıcı state'ini sıfırla
        setUser(null);
        setAccountTitle('Hesabım');
        // Ana sayfaya yönlendir ve sayfayı tazele
        window.location.href = '/'; 
    };
    
    const [localSearchQuery, setLocalSearchQuery] = useState(() => {
        return localStorage.getItem('globalSearchQuery') || '';
    });

    const getCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        return cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    };

    const [cartCount, setCartCount] = useState(getCartCount());

    // Menü sayfasında değilsek, localStorage'dan oku
    useEffect(() => {
        if (!isMenuPage) {
            const stored = localStorage.getItem('globalSearchQuery') || '';
            setLocalSearchQuery(stored);
        }
    }, [isMenuPage]);

    // Arama değiştiğinde (sadece local state'i güncelle, menü sayfasında değiliz)
    const handleSearchChange = (value) => {
        setLocalSearchQuery(value);
        localStorage.setItem('globalSearchQuery', value);
    };

    // Enter'a basıldığında
    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (localSearchQuery.trim()) {
                localStorage.setItem('globalSearchQuery', localSearchQuery);
                navigate('/menu');
            }
        }
    };

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
                        value={localSearchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onKeyPress={handleSearchKeyPress}
                    />
                </div>

                <div className="right-section">
                    <div className="account">
                        <div className="acc-icon"><RiAccountCircleFill /></div>
                        <div className="acc-dropdown">
                            <CustomDropdown title={accountTitle}>
                            <Link to="/account">Siparişlerim</Link>
                                <Link to="/account">Profilim</Link>
                                <Link to="/" onClick={handleLogout}>Çıkış Yap</Link>
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