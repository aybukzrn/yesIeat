import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SiparisContent.css';
import { MdOutlineExpandMore } from 'react-icons/md';

const EmptyOrders = () => (
    <div className="empty-orders-state">
        <img src={`/assets/AccountPage/order2.png`} />
        <h2>Henüz Siparişiniz Bulunmamaktadır</h2>
        <p>Lezzetli ürünlerimizi keşfetmek için menüye göz atın!</p>
        <Link to="/menu" className="btn-go-to-menu">Menüye Git</Link>
    </div>
);

const OrderItemCard = ({ order }) => {

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);


    const toggleDetails = () => {
        setIsDetailsOpen(!isDetailsOpen);
    };

    return (
        <div className="order-item-card">

            <div className="design">
                <div className="info-row">
                    <div className="order-header">
                        <span className={`order-status status-${order.status.split(' ')[0]}`}>{order.status}</span>
                    </div>
                    <p>Tarih: {order.date} / {order.time}</p>
                    <p>Toplam: <strong>{order.total.toFixed(2)} ₺</strong></p>
                    <p className="item-list">Ürünler: {order.items.join(', ')}</p>
                </div>

                {isDetailsOpen && (
                    <div className="order-extra-details">

                        <p>Sipariş Numarası: #{order.id}</p>
                        <p>Sipariş İçeriği: 1 Teslimat {order.items.length} Ürün</p>

                        <ul>
                            {order.items.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ul>

                        <p>Alıcı: {order.customerName || 'Bilgi bulunamadı'}</p>

                        <p className="address-placeholder">Teslimat Adresi: {order.address || 'Adres bilgisi bulunamadı'}</p>
                        <p className="payment-placeholder">Ödeme Yöntemi: {order.paymentMethod || 'Ödeme bilgisi bulunamadı'}</p>
                    </div>
                )}
            </div>


            <div className="detail-btn">
                <button onClick={toggleDetails}>
                    {isDetailsOpen ? 'Detayları Kapat' : 'Detayları Görüntüle'}
                    <div className="more-icon">
                        <MdOutlineExpandMore />
                    </div>

                </button>
            </div>



        </div>
    );
};

const SiparisContent = () => {

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // localStorage'dan kullanıcı bilgisini al
                const userData = localStorage.getItem('user');
                if (!userData) {
                    setError('Giriş yapmanız gerekiyor.');
                    setIsLoading(false);
                    return;
                }

                const user = JSON.parse(userData);
                if (!user || !user.id) {
                    setError('Kullanıcı bilgisi bulunamadı.');
                    setIsLoading(false);
                    return;
                }

                // API'den siparişleri çek
                const response = await fetch(`/api/orders?userId=${user.id}`);
                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Siparişler yüklenirken bir hata oluştu.');
                }

                setOrders(data.orders || []);
            } catch (err) {
                console.error('Sipariş yükleme hatası:', err);
                setError(err.message || 'Siparişler yüklenirken bir hata oluştu.');
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const hasOrders = orders && orders.length > 0;

    return (
        <>


            <div className="orders-page container py-5">

                {isLoading && <p className="text-center">Siparişleriniz yükleniyor...</p>}

                {error && (
                    <div className="text-center" style={{ color: 'red', margin: '20px 0' }}>
                        <p>{error}</p>
                        <Link to="/login" style={{ color: '#e2bb52', textDecoration: 'underline' }}>
                            Giriş yapmak için tıklayın
                        </Link>
                    </div>
                )}

                {!isLoading && !error && (
                    hasOrders ? (
                        <div className="orders-list-container">
                            {orders.map(order => (
                                <OrderItemCard key={order.id} order={order} />
                            ))}
                        </div>
                    ) : (
                        <EmptyOrders />
                    )
                )}

            </div>


        </>
    );
};

export default SiparisContent
