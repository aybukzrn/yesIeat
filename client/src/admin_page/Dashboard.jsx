import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

import LiveClock from '../components/LiveClock';

// içerik bileşeneleri
import AnalyticsContent from './Legal3/AnalyticsContent';
import ProductsContent from './Legal3/ProductsContent';
import OrdersContent from './Legal3/OrdersContent';
import SettingsContent from './Legal3/SettingsContent';
import AdminLogin from './Legal3/AdminLogin';



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
            
            case 'Ayarlar':
                return <SettingsContent /> 
            
            default:
                return <AnalyticsContent />;
        }
    };

    return (
        <div className="admin-dashboard-layout">

            <div className="d-sidebar">
                <Sidebar
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                />

            </div>

            <main className="admin-content-area">
                <div className="admin-content-area headers">
                    <h1>{activeCategory} <LiveClock /> </h1>
                </div>


                <div className="content-container">
                    {renderContent()}
                </div>
                
            </main>
        </div>
    );
};

export default Dashboard;