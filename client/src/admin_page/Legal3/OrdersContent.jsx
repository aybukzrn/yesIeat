import React, { useState, useEffect } from 'react';
import './OrdersContent.css';
import { Link } from 'react-router-dom';
import Modal from '../../components/Modal';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { CgDetailsMore } from "react-icons/cg";


const DATA = {
    statuses: ['Beklemede', 'Yeni Sipariş', 'Yolda', 'Teslim Edildi', 'İptal Edildi'],
    items: ['Cheeseburger Menü', 'Pesto Makarna', 'Adana Kebap', 'Salata', 'Sufle', 'Ev Yapımı Limonata', 'Tiramisu', 'Margarita Pizza', 'Çıtır Tavuk', 'Közlenmiş Sebzeler', 'Fırınlanmış Patates', 'Izgara Somon'],
    names: ['Zeynep Özdemir', 'Selinay Türksal', 'Miray Tokel', 'Ahmet Yılmaz', 'Ayşe Kaya'],
};

// SABİT MOCK DATA ÜRETİCİ
const generateDeterministicOrders = () => {
    return Array.from({ length: 35 }, (_, i) => {
        const status = DATA.statuses[i % DATA.statuses.length];
        const customer = DATA.names[i % DATA.names.length];
        const itemContent = DATA.items[i % DATA.items.length];
        const total = 100 + (i * 15) + (i % 10 * 0.5);

        return {
            id: String(100 + i),
            customer: customer,
            content: itemContent,
            date: `15.${(i % 12) + 1}.${2025 - (i % 2)}`,
            total: parseFloat(total.toFixed(2)),
            status: status,
        };
    });
};

const OrdersContent = () => {

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null); // Detay gösterilecek sipariş
    const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);



    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setOrders(generateDeterministicOrders());
            setIsLoading(false);
        }, 800);
    }, []);


    const handleApproveOrder = (orderId) => {
        setOrders(prevOrders => prevOrders.map(order =>
            order.id === orderId ? { ...order, status: 'Yeni Sipariş' } : order
        ));

    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
    };

    const handleAddOrder = (newOrder) => {
        setOrders(prevOrders => [newOrder, ...prevOrders]);
    };



    const getStatusCount = (status) => orders.filter(o => o.status === status).length;
    const summaryData = [
        { label: 'Bekleyen Siparişler', statusKey: 'Beklemede', count: getStatusCount('Beklemede'), action: true },
        { label: 'Yeni Siparişler', statusKey: 'Yeni Sipariş', count: getStatusCount('Yeni Sipariş') },
        { label: 'Yolda Olan Siparişler', statusKey: 'Yolda', count: getStatusCount('Yolda') },
        { label: 'Teslim Edilen Siparişler', statusKey: 'Teslim Edildi', count: getStatusCount('Teslim Edildi') },
    ];

    const ordersToDisplay = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    if (isLoading) {
        return <div className="loading-state text-center py-5">Veriler yükleniyor...</div>;
    }

    return (
        <>
            <div className="OrdersContent">


                <div className="up-content">
                    {summaryData.map(item => (
                        <div className={`box status-${item.statusKey.split(' ')[0].toLowerCase()}`} key={item.label}>
                            <h2>
                                {item.label}{item.action && (
                                    <div className="detail-button">

                                        <button onClick={() => setIsApprovalModalOpen(true)}>
                                            <CgDetailsMore />
                                        </button>
                                    </div>
                                )}
                            </h2>
                            <p>{item.count}</p>

                        </div>
                    ))}
                </div>


                <div className="down-content">
                    <div className="add-order">
                        <button onClick={() => setIsAddOrderModalOpen(true)} className="btn-add-order"><IoIosAddCircleOutline />Yeni Sipariş Ekle</button>
                    </div>

                    <div className="orders-table-wrapper">
                        <table className="content-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Müşteri Adı</th>
                                    <th>Sipariş İçeriği</th>
                                    <th>Tarih</th>
                                    <th>Tutar</th>
                                    <th>Durum</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordersToDisplay.map(order => (
                                    <tr key={order.id} className={`row-status-${order.status.split(' ')[0].toLowerCase()}`}>
                                        <td>{order.id}</td>
                                        <td>{order.customer}</td>
                                        <td className="content-details">{order.content}</td>
                                        <td>{order.date}</td>
                                        <td className="price-tag">{order.total} ₺</td>
                                        <td>
                                            <span className={`status-badge badge-${order.status.split(' ')[0].toLowerCase()}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>

                                            <button className="action-btn" onClick={() => handleViewDetails(order)}>...</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active-page' : ''}>{i + 1}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* MODAL 1: BEKLEYEN SİPARİŞLERİ ONAYLAMA */}
            <Modal isOpen={isApprovalModalOpen} onClose={() => setIsApprovalModalOpen(false)} title={`Bekleyen Siparişler (${getStatusCount('Beklemede')})`}>
                <ul className="modal-order-list">
                    {orders.filter(o => o.status === 'Beklemede').map(order => (
                        <li key={order.id}>
                            Sipariş #{order.id} - {order.customer}
                            <button
                                onClick={() => handleApproveOrder(order.id)}
                                className="approve-btn"
                                disabled={order.status !== 'Beklemede'} // Onaylanmışsa pasif
                                style={{ backgroundColor: order.status === 'Yeni Sipariş' ? '#ccc' : '#2ecc71', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}
                            >
                                {order.status === 'Yeni Sipariş' ? 'Onaylandı' : 'Onayla'}
                            </button>
                        </li>
                    ))}
                </ul>
            </Modal>


            {/* MODAL 2: TABLO DETAY GÖRÜNTÜLEME */}
            <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Sipariş Detayları">
                {selectedOrder && (
                    <div className="order-detail-content">
                        <p><strong>ID:</strong> {selectedOrder.id}</p>
                        <p><strong>Müşteri:</strong> {selectedOrder.customer}</p>
                        <p><strong>İçerik:</strong> {selectedOrder.content}</p>
                        <p><strong>Tutar:</strong> {selectedOrder.total} ₺</p>
                        <p><strong>Tarih:</strong> {selectedOrder.date}</p>
                        <p><strong>Durum:</strong>
                            <span className={`status-badge badge-${selectedOrder.status.split(' ')[0].toLowerCase()}`}>
                                {selectedOrder.status}
                            </span>
                        </p>
                    </div>
                )}
            </Modal>

            {/* MODAL 3: YENİ SİPARİŞ EKLEME */}
            <Modal isOpen={isAddOrderModalOpen} onClose={() => setIsAddOrderModalOpen(false)} title="Yeni Sipariş Ekle">
                <form className="add-order-form">

                    <label>Müşteri Adı</label>
                    <input type="text" id="customerName" placeholder="Ad Soyad" />

                    <label>Sipariş İçeriği</label>
                    <input type="text" id="orderContent" placeholder="" />

                    <label>Tutar</label>
                    <input type="number" id="orderTotal" placeholder="₺" />

                    <button
                        type="button"
                        onClick={() => {
                            const newOrder = {
                                id: String(Date.now()),
                                customer: document.getElementById("customerName").value,
                                content: document.getElementById("orderContent").value,
                                total: Number(document.getElementById("orderTotal").value),
                                date: new Date().toLocaleDateString(),
                                status: 'Beklemede'
                            };

                            handleAddOrder(newOrder);
                            setIsAddOrderModalOpen(false);
                        }}
                        className="approve-btn"
                    >
                        Siparişi Ekle
                    </button>
                </form>
            </Modal>

        </>
    );
};

export default OrdersContent;