import React, { useState, useEffect } from 'react';
import './SettingsContent.css';




//TAMAMI DEĞİŞECEK


// Varsayılan Uygulama Ayarları (Backend'den gelecektir)
const initialAppSettings = {
    siteName: 'FOOD SHOP Admin',
    currency: '₺ TRY',
    deliveryTime: 45, // Dakika
    minOrderValue: 50, // TL
    isSiteActive: true,
};

// Varsayılan Bildirim Ayarları
const initialNotificationSettings = {
    emailAlerts: true,
    smsAlerts: false,
    lowStockAlert: 10, // Kalan ürün adedi
};

const SettingsContent = () => {
    // 1. Durum (State) Yönetimi
    const [activeTab, setActiveTab] = useState('Genel');
    const [appSettings, setAppSettings] = useState(initialAppSettings);
    const [notificationSettings, setNotificationSettings] = useState(initialNotificationSettings);
    const [isSaving, setIsSaving] = useState(false);

    // 2. BACKEND/KAYIT SİMÜLASYONU
    const handleSaveSettings = (settingsType, newSettings) => {
        setIsSaving(true);
        console.log(`[AYAR KAYDETME] ${settingsType} güncelleniyor...`, newSettings);
        
        // 1 saniye gecikme ile kaydetme işlemi simülasyonu
        setTimeout(() => {
            if (settingsType === 'Genel') {
                setAppSettings(newSettings);
            } else if (settingsType === 'Bildirim') {
                setNotificationSettings(newSettings);
            }
            setIsSaving(false);
            alert(`${settingsType} ayarları başarıyla kaydedildi!`);
        }, 1000);
    };

    // 3. AYAR FORMLARI
    
    // 3.1. Genel Ayarlar Formu
    const GeneralSettingsForm = () => (
        <form onSubmit={(e) => {
            e.preventDefault();
            handleSaveSettings('Genel', appSettings);
        }}>
            <div className="setting-group">
                <h3>Uygulama Bilgileri</h3>
                <label>Site Adı:</label>
                <input 
                    type="text" 
                    value={appSettings.siteName} 
                    onChange={(e) => setAppSettings({...appSettings, siteName: e.target.value})} 
                />
                
                <label>Para Birimi:</label>
                <input 
                    type="text" 
                    value={appSettings.currency} 
                    onChange={(e) => setAppSettings({...appSettings, currency: e.target.value})} 
                />
            </div>

            <div className="setting-group">
                <h3>Sipariş Ayarları</h3>
                <label>Ortalama Teslimat Süresi (dk):</label>
                <input 
                    type="number" 
                    value={appSettings.deliveryTime} 
                    onChange={(e) => setAppSettings({...appSettings, deliveryTime: parseInt(e.target.value) || 0})} 
                />

                <label>Minimum Sipariş Tutarı (₺):</label>
                <input 
                    type="number" 
                    value={appSettings.minOrderValue} 
                    onChange={(e) => setAppSettings({...appSettings, minOrderValue: parseFloat(e.target.value) || 0})} 
                />
                
                <div className="checkbox-setting">
                    <label>Siteyi Aktif/Pasif Yap</label>
                    <input 
                        type="checkbox" 
                        checked={appSettings.isSiteActive} 
                        onChange={(e) => setAppSettings({...appSettings, isSiteActive: e.target.checked})} 
                    />
                    <span className={appSettings.isSiteActive ? 'status-active' : 'status-passive'}>
                        {appSettings.isSiteActive ? 'Aktif' : 'Pasif'}
                    </span>
                </div>
            </div>
            
            <button type="submit" className="save-button" disabled={isSaving}>
                {isSaving ? 'Kaydediliyor...' : 'Genel Ayarları Kaydet'}
            </button>
        </form>
    );

    // 3.2. Bildirim Ayarları Formu
    const NotificationSettingsForm = () => (
        <form onSubmit={(e) => {
            e.preventDefault();
            handleSaveSettings('Bildirim', notificationSettings);
        }}>
            <div className="setting-group">
                <h3>E-posta ve SMS Bildirimleri</h3>
                
                <div className="checkbox-setting">
                    <label>Yeni Sipariş E-posta Uyarısı</label>
                    <input 
                        type="checkbox" 
                        checked={notificationSettings.emailAlerts} 
                        onChange={(e) => setNotificationSettings({...notificationSettings, emailAlerts: e.target.checked})} 
                    />
                </div>

                <div className="checkbox-setting">
                    <label>Acil Durumlar İçin SMS Uyarısı</label>
                    <input 
                        type="checkbox" 
                        checked={notificationSettings.smsAlerts} 
                        onChange={(e) => setNotificationSettings({...notificationSettings, smsAlerts: e.target.checked})} 
                    />
                </div>
            </div>
            
            <div className="setting-group">
                <h3>Stok Uyarısı</h3>
                <label>Stok Adedi Şunun Altına Düşünce Uyar:</label>
                <input 
                    type="number" 
                    value={notificationSettings.lowStockAlert} 
                    onChange={(e) => setNotificationSettings({...notificationSettings, lowStockAlert: parseInt(e.target.value) || 0})} 
                />
            </div>
            
            <button type="submit" className="save-button" disabled={isSaving}>
                {isSaving ? 'Kaydediliyor...' : 'Bildirim Ayarlarını Kaydet'}
            </button>
        </form>
    );


    // 4. İÇERİK SEÇİMİ
    const renderContent = () => {
        switch (activeTab) {
            case 'Genel':
                return <GeneralSettingsForm />;
            case 'Bildirim':
                return <NotificationSettingsForm />;
            case 'Güvenlik':
                return <div><h3>Şifre ve Güvenlik Ayarları</h3><p>Şifre değiştirme formu buraya gelecektir.</p></div>;
            default:
                return <div>Ayarlar Seçin</div>;
        }
    };


    // 5. ANA RENDER
    return (
        <div className="SettingsContent">
            <h1>Ayarlar</h1>
            
            {/* TAB NAVİGASYONU */}
            <div className="settings-tabs">
                {['Genel', 'Bildirim', 'Güvenlik'].map(tab => (
                    <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* AYAR FORMLARI */}
            <div className="settings-form-area">
                {renderContent()}
            </div>
        </div>
    );
};

export default SettingsContent;