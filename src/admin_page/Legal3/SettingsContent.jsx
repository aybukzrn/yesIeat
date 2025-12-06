import React, { useState } from 'react';
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
const initialSecuritySettings = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
};


const GeneralSettingsForm = ({ appSettings, setAppSettings, isSaving }) => {
    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="setting-group">
                <h3>Uygulama Bilgileri</h3>

                <label>Site Adı:</label>
                <input
                    type="text"
                    value={appSettings.siteName}
                    onChange={(e) =>
                        setAppSettings(prev => ({ ...prev, siteName: e.target.value }))
                    }
                />

                <label>Para Birimi:</label>
                <input
                    type="text"
                    value={appSettings.currency}
                    onChange={(e) =>
                        setAppSettings(prev => ({ ...prev, currency: e.target.value }))
                    }
                />
            </div>

            <div className="setting-group">
                <h3>Sipariş Ayarları</h3>

                <label>Ortalama Teslimat Süresi (dk):</label>
                <input
                    type="number"
                    value={appSettings.deliveryTime}
                    onChange={(e) =>
                        setAppSettings(prev => ({
                            ...prev,
                            deliveryTime: parseInt(e.target.value) || 0
                        }))
                    }
                />

                <label>Minimum Sipariş Tutarı (₺):</label>
                <input
                    type="number"
                    value={appSettings.minOrderValue}
                    onChange={(e) =>
                        setAppSettings(prev => ({
                            ...prev,
                            minOrderValue: parseFloat(e.target.value) || 0
                        }))
                    }
                />
            </div>

            <button type="submit" className="setting-save-button" disabled={isSaving}>
                {isSaving ? 'Kaydediliyor...' : 'Genel Ayarları Kaydet'}
            </button>
        </form>
    );
};


const NotificationSettingsForm = ({ notificationSettings, setNotificationSettings, isSaving }) => {
    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="setting-group">
                <h3>E-posta ve SMS Bildirimleri</h3>

                <div className="checkbox-setting">
                    <label>Yeni Sipariş E-posta Uyarısı</label>
                    <input
                        type="checkbox"
                        checked={notificationSettings.emailAlerts}
                        onChange={(e) =>
                            setNotificationSettings(prev => ({
                                ...prev,
                                emailAlerts: e.target.checked
                            }))
                        }
                    />
                </div>

                <div className="checkbox-setting">
                    <label>Yeni Sipariş İçin SMS Uyarısı</label>
                    <input
                        type="checkbox"
                        checked={notificationSettings.smsAlerts}
                        onChange={(e) =>
                            setNotificationSettings(prev => ({
                                ...prev,
                                smsAlerts: e.target.checked
                            }))
                        }
                    />
                </div>
            </div>

            <div className="setting-group">
                <h3>Stok Uyarısı</h3>
                <label>Stok Adedi Şunun Altına Düştüğünde Uyar:</label>
                <input
                    type="number"
                    value={notificationSettings.lowStockAlert}
                    onChange={(e) =>
                        setNotificationSettings(prev => ({
                            ...prev,
                            lowStockAlert: parseInt(e.target.value) || 0
                        }))
                    }
                />
            </div>

            <button type="submit" className="setting-save-button" disabled={isSaving}>
                {isSaving ? 'Kaydediliyor...' : 'Bildirim Ayarlarını Kaydet'}
            </button>
        </form>
    );
};


const SecuritySettingsForm = ({ securitySettings, setSecuritySettings, isSaving }) => {
    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="setting-group">
                <h3>Şifre Değiştir</h3>

                <label>Mevcut Şifre:</label>
                <input
                    type="password"
                    value={securitySettings.currentPassword}
                    onChange={(e) =>
                        setSecuritySettings(prev => ({
                            ...prev,
                            currentPassword: e.target.value
                        }))
                    }
                />

                <label>Yeni Şifre:</label>
                <input
                    type="password"
                    value={securitySettings.newPassword}
                    onChange={(e) =>
                        setSecuritySettings(prev => ({
                            ...prev,
                            newPassword: e.target.value
                        }))
                    }
                />

                <label>Yeni Şifreyi Onayla:</label>
                <input
                    type="password"
                    value={securitySettings.confirmNewPassword}
                    onChange={(e) =>
                        setSecuritySettings(prev => ({
                            ...prev,
                            confirmNewPassword: e.target.value
                        }))
                    }
                />
            </div>

            <button type="submit" className="setting-save-button" disabled={isSaving}>
                {isSaving ? 'Kaydediliyor...' : 'Güvenlik Ayarlarını Kaydet'}
            </button>
        </form>
    );
};



const SettingsContent = () => {
    const [activeTab, setActiveTab] = useState('Genel');
    const [appSettings, setAppSettings] = useState(initialAppSettings);
    const [notificationSettings, setNotificationSettings] = useState(initialNotificationSettings);
    const [securitySettings, setSecuritySettings] = useState(initialSecuritySettings);
    const [isSaving, setIsSaving] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case 'Genel':
                return (
                    <GeneralSettingsForm
                        appSettings={appSettings}
                        setAppSettings={setAppSettings}
                        isSaving={isSaving}
                    />
                );

            case 'Bildirim':
                return (
                    <NotificationSettingsForm
                        notificationSettings={notificationSettings}
                        setNotificationSettings={setNotificationSettings}
                        isSaving={isSaving}
                    />
                );

            case 'Güvenlik':
                return (
                    <SecuritySettingsForm
                        securitySettings={securitySettings}
                        setSecuritySettings={setSecuritySettings}
                        isSaving={isSaving}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="SettingsContent">

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

            <div className="settings-form-area">
                {renderContent()}
            </div>

        </div>
    );
};

export default SettingsContent;
