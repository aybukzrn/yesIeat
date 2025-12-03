import React, { useState, useRef } from 'react';
import './SettingsContent.css';

// Varsayılan Uygulama Ayarları
const initialAppSettings = {
    siteName: 'YES I EAT',
    
    currency: '₺ TRY',
    deliveryTime: 45,
    minOrderValue: 150,
};

// Varsayılan Bildirim Ayarları
const initialNotificationSettings = {
    emailAlerts: true,
    smsAlerts: false,
    lowStockAlert: 5,
};

// Varsayılan Güvenlik Ayarları
const initalSecuritySettings = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
};

const SettingsContent = () => {
    // 1. Durum (State) Yönetimi
    const [activeTab, setActiveTab] = useState('Genel');
    const [appSettings, setAppSettings] = useState(initialAppSettings);
    const [notificationSettings, setNotificationSettings] = useState(initialNotificationSettings);
    const [securitySettings, setSecuritySettings] = useState(initalSecuritySettings);
    const [isSaving, setIsSaving] = useState(false);

    // 3. AYAR FORMLARI

    // 3.1. Genel Ayarlar Formu
    const GeneralSettingsForm = () => (
        <form onSubmit={(e) => {
            e.preventDefault();
        }}>
            <div className="setting-group">
                <h3>Uygulama Bilgileri</h3>
                <label>Site Adı:</label>
                <input
                    type="text"
                    value={appSettings.siteName}
                    onChange={(e) => setAppSettings({ ...appSettings, siteName: e.target.value })}
                />


                <label>Para Birimi:</label>
                <input
                    type="text"
                    value={appSettings.currency}
                    onChange={(e) => setAppSettings({ ...appSettings, currency: e.target.value })}
                />
            </div>

            <div className="setting-group">
                <h3>Sipariş Ayarları</h3>
                <label>Ortalama Teslimat Süresi (dk):</label>
                <input
                    type="number"
                    value={appSettings.deliveryTime}
                    onChange={(e) => setAppSettings({ ...appSettings, deliveryTime: parseInt(e.target.value) || 0 })}
                />

                <label>Minimum Sipariş Tutarı (₺):</label>
                <input
                    type="number"
                    value={appSettings.minOrderValue}
                    onChange={(e) => setAppSettings({ ...appSettings, minOrderValue: parseFloat(e.target.value) || 0 })}
                />
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
            
        }}>
            <div className="setting-group">
                <h3>E-posta ve SMS Bildirimleri</h3>

                <div className="checkbox-setting">
                    <label>Yeni Sipariş E-posta Uyarısı</label>
                    <input
                        type="checkbox"
                        checked={notificationSettings.emailAlerts}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailAlerts: e.target.checked })}
                    />
                </div>

                <div className="checkbox-setting">
                    <label>Yeni Sipariş İçin SMS Uyarısı</label>
                    <input
                        type="checkbox"
                        checked={notificationSettings.smsAlerts}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, smsAlerts: e.target.checked })}
                    />
                </div>
            </div>

            <div className="setting-group">
                <h3>Stok Uyarısı</h3>
                <label>Stok Adedi Şunun Altına Düşünce Uyar:</label>
                <input
                    type="number"
                    value={notificationSettings.lowStockAlert}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, lowStockAlert: parseInt(e.target.value) || 0 })}
                />
            </div>

            <button type="submit" className="save-button" disabled={isSaving}>
                {isSaving ? 'Kaydediliyor...' : 'Bildirim Ayarlarını Kaydet'}
            </button>
        </form>
    );

    //3.3 Güvenlik Ayarları Formu

const SecuritySettingsForm = () => (
    <form onSubmit={(e) => {
        e.preventDefault();
        
    }}>
        <div className="setting-group">
            <h3>Şifre Değiştir</h3>
            <label>Mevcut Şifre:</label>
            <input
                type="password"
                value={securitySettings.currentPassword}
                onChange={(e) => setSecuritySettings({ ...securitySettings, currentPassword: e.target.value })}
            />

            <label>Yeni Şifre:</label>
            <input
                type="password"
                value={securitySettings.newPassword}
                onChange={(e) => setSecuritySettings({ ...securitySettings, newPassword: e.target.value })}
            />

            <label>Yeni Şifreyi Onayla:</label>
            <input
                type="password"
                value={securitySettings.confirmNewPassword}
                onChange={(e) => setSecuritySettings({ ...securitySettings, confirmNewPassword: e.target.value })}
            />
        </div>

        <button type="submit" className="save-button" disabled={isSaving}>
            {isSaving ? 'Kaydediliyor...' : 'Güvenlik Ayarlarını Kaydet'}
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
                return <SecuritySettingsForm />;
            default:
                return <GeneralSettingsForm />;
        }
    };


    // 5. ANA RENDER
    return (
        <div className="SettingsContent">
            

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