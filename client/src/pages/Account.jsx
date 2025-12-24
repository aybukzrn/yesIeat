import React, { useState, useEffect } from 'react'
import Navbar2 from '../components/Navbar2';
import Footer from '../components/Footer';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Account.css';

import SiparisContent from './Legal2/SiparisContent';
import KullaniciBilgilerimContent from './Legal2/KullaniciBilgilerimContent';
import KayitliKartlarımContent from './Legal2/KayitliKartlarımContent';
import KayitliAdreslerimContent from './Legal2/KayitliAdreslerimContent';

// Kategori konfigürasyonu - dinamik yapı için
const categoriesConfig = [
    { 
        slug: 'siparislerim', 
        name: 'Siparişlerim', 
        component: 'SiparisContent'
    },
    { 
        slug: 'kayitli-kartlarim', 
        name: 'Kayıtlı Kartlarım', 
        component: 'KayitliKartlarımContent'
    },
    { 
        slug: 'kayitli-adreslerim', 
        name: 'Kayıtlı Adreslerim', 
        component: 'KayitliAdreslerimContent'
    },
    { 
        slug: 'kullanici-bilgilerim', 
        name: 'Kullanıcı Bilgilerim', 
        component: 'KullaniciBilgilerimContent'
    },
];

// Component mapping
const componentMap = {
    'SiparisContent': SiparisContent,
    'KayitliKartlarımContent': KayitliKartlarımContent,
    'KayitliAdreslerimContent': KayitliAdreslerimContent,
    'KullaniciBilgilerimContent': KullaniciBilgilerimContent,
};

const Account = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    // URL'den aktif kategoriyi al veya varsayılan olarak ilk kategoriyi kullan
    const activeSlug = searchParams.get('tab') || categoriesConfig[0].slug;
    const activeCategory = categoriesConfig.find(cat => cat.slug === activeSlug) || categoriesConfig[0];

    // Kullanıcı kontrolü
    useEffect(() => {
        const checkUser = () => {
            const isLoggedIn = sessionStorage.getItem('userLoggedIn');
            const userData = localStorage.getItem('user');

            if (isLoggedIn !== 'true' || !userData) {
                // Giriş yapılmamışsa login sayfasına yönlendir
                navigate('/login');
                return;
            }

            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (err) {
                console.error('User data parse hatası:', err);
                navigate('/login');
            } finally {
                setIsLoading(false);
            }
        };

        checkUser();
    }, [navigate]);

    // Kategori değiştirme fonksiyonu
    const handleCategoryChange = (slug) => {
        setSearchParams({ tab: slug });
    };

    // İçerik component'ini dinamik olarak getir
    const getContentComponent = () => {
        const Component = componentMap[activeCategory.component];
        if (!Component) {
            return <h2>Lütfen bir başlık seçin.</h2>;
        }
        return <Component />;
    };

    // Loading durumu
    if (isLoading) {
        return (
            <div>
                <Navbar2 />
                <div className="content-page-layout">
                    <div className="content-content" style={{ padding: '50px', textAlign: 'center' }}>
                        <p>Yükleniyor...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Kullanıcı yoksa (yönlendirme yapıldı)
    if (!user) {
        return null;
    }

    return (
        <div>
            <Navbar2 />

            <div className="content-page-layout">
                <div className="sidebar">
                    <div className="category-filter-bar mb-5">
                        {categoriesConfig.map((cat) => (
                            <button
                                key={cat.slug}
                                className={`filter-btn ${activeCategory.slug === cat.slug ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(cat.slug)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <section className="contact-section">
                    <div className="content-content">
                        <div className="content-item">
                            {getContentComponent()}
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    )
}

export default Account
