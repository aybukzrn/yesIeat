import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SiparisContent.css';
import { MdOutlineExpandMore } from 'react-icons/md';


// geçici veriler
const demoOrders = [
    { id: 101, date: '18 Eylül 2025', time: '12.43', total: 150.00, status: 'Teslim Edildi', items: ['Pizza', 'Kola'] },
    { id: 102, date: '23 Eylül 2025', time: '20.54', total: 95.50, status: 'Hazırlanıyor', items: ['Hamburger', 'Patates'] },
    { id: 103, date: '16 Ekim 2025', time: '16.32', total: 120.75, status: 'İptal Edildi', items: ['Lazanya'] },
];

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

                        <p>Alıcı: Aybüke Zeren</p>

                        <p className="address-placeholder">Teslimat Adresi: Örnek Cad. No: 12/A </p>
                        <p className="payment-placeholder">Ödeme Yöntemi: Kredi Kartı</p>
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

    const [orders, setOrders] = useState(demoOrders);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            // Burada gerçek API çağrısı yapılabilir
            setOrders(demoOrders);
            setIsLoading(false);
        }, 1000);
    }
        , []);

    const hasOrders = orders && orders.length > 0;

    return (
        <>


            <div className="orders-page container py-5">

                {isLoading && <p className="text-center">Siparişleriniz yükleniyor...</p>}

                {
                    hasOrders ? (

                        <div className="orders-list-container">
                            {orders.map(order => (
                                <OrderItemCard key={order.id} order={order} />
                            ))}
                        </div>
                    ) : (

                        <EmptyOrders />
                    )
                }

            </div>


        </>
    );
};

export default SiparisContent
