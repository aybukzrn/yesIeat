import React, { useState } from 'react';
import Sidebar from '../components/Sidebar'; 
import './Dashboard.css'; 


// içerik bileşeneleri
import AnalyticsContent from './Legal3/AnalyticsContent';
import ProductsContent from './Legal3/ProductsContent';
import OrdersContent from './Legal3/OrdersContent';


const Dashboard = () => {
    const [activeCategory, setActiveCategory] = useState('Analiz');

    const renderContent = () => {
        switch (activeCategory) {
            case 'Analiz':
                return <AnalyticsContent />;
            case 'Ürünler':
                return <ProductsContent />;
            case 'Siparişler':
                return <OrdersContent />;
            case 'Müşteriler':
                return <div>Müşteriler Listesi İçeriği</div>; // Yer Tutucu
            case 'Ayarlar':
                return <div>Ayarlar İçeriği</div>; // Yer Tutucu
            case 'Çıkış':
                // Çıkış yapma mantığı buraya gelir (Örn: auth.logout())
                return <div>Çıkış İşlemi Başarılı</div>;
            default:
                return <AnalyticsContent />;
        }
    };

    return (
        <div className="admin-dashboard-layout">
            
            <Sidebar 
                activeCategory={activeCategory} 
                setActiveCategory={setActiveCategory} 
            />
            
            <main className="admin-content-area">
                <h1>{activeCategory} Yönetimi</h1>
                <div className="content-container">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;