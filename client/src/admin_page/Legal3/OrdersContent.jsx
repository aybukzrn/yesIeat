import React, { useState, useEffect } from 'react';
import './OrdersContent.css';
import Modal from '../../components/Modal';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { CgDetailsMore } from "react-icons/cg";

// 1. ADIM: Durumları bir akış sırasına koyduk
const ORDER_STAGES = {
    PENDING: 'Beklemede',
    PREPARING: 'Hazırlanıyor',
    ON_WAY: 'Yolda',
    DELIVERED: 'Teslim Edildi',
    CANCELLED: 'İptal Edildi'
};


const OrdersContent = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    
    const [manageModalOpen, setManageModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
    

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/admin/orders');
            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Siparişler yüklenirken bir hata oluştu.');
            }

            setOrders(data.orders || []);
        } catch (err) {
            console.error('Sipariş yükleme hatası:', err);
            alert(err.message || 'Siparişler yüklenirken bir hata oluştu.');
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 2. ADIM: Durum Değiştirme Fonksiyonu
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Sipariş durumu güncellenirken bir hata oluştu.');
            }

            // Başarılı - siparişleri yeniden yükle
            await fetchOrders();
            setManageModalOpen(false);
        } catch (err) {
            console.error('Durum güncelleme hatası:', err);
            alert(err.message || 'Sipariş durumu güncellenirken bir hata oluştu.');
        }
    };

    const openManagementModal = (order) => {
        setSelectedOrder(order);
        setManageModalOpen(true);
    };

    
    const getStatusCount = (status) => orders.filter(o => o.status === status).length;
    
    
    const ordersToDisplay = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);


    // 3. ADIM: Modalin içinde hangi butonların görüneceğine karar veren mantık
    const renderModalActions = (order) => {
        if (!order) return null;

        switch (order.status) {
            case ORDER_STAGES.PENDING:
                return (
                    <div className="modal-actions">
                        <button className="btn-reject" onClick={() => handleStatusChange(order.id, ORDER_STAGES.CANCELLED)}>Reddet</button>
                        <button className="btn-approve" onClick={() => handleStatusChange(order.id, ORDER_STAGES.PREPARING)}>Siparişi Onayla ve Mutfağa İlet</button>
                    </div>
                );
            case ORDER_STAGES.PREPARING:
                return (
                    <div className="modal-actions">
                         <button className="btn-next-stage" onClick={() => handleStatusChange(order.id, ORDER_STAGES.ON_WAY)}>Hazır - Kuryeye Ver</button>
                    </div>
                );
            case ORDER_STAGES.ON_WAY:
                return (
                    <div className="modal-actions">
                        <button className="btn-complete" onClick={() => handleStatusChange(order.id, ORDER_STAGES.DELIVERED)}>Teslimat Başarılı</button>
                    </div>
                );
            case ORDER_STAGES.DELIVERED:
                return <div className="info-text">Bu sipariş tamamlanmıştır.</div>;
            case ORDER_STAGES.CANCELLED:
                return <div className="error-text">Bu sipariş iptal edilmiştir.</div>;
            default:
                return null;
        }
    };

    if (isLoading) return <div className="loading">Yükleniyor...</div>;

    return (
        <div className="OrdersContent">
            
            <div className="up-content">
                {[ORDER_STAGES.PENDING, ORDER_STAGES.PREPARING, ORDER_STAGES.ON_WAY, ORDER_STAGES.DELIVERED].map(status => (
                    <div className={`box status-${status.toLowerCase().split(' ')[0]}`} key={status}>
                        <h2>{status}</h2>
                        <p>{getStatusCount(status)}</p>
                    </div>
                ))}
            </div>

            <div className="down-content">
                <div className="add-order">
                    <button onClick={() => setIsAddOrderModalOpen(true)} className="btn-add-order">
                        <IoIosAddCircleOutline /> Yeni Sipariş Ekle
                    </button>
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
                                <th>Yönet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordersToDisplay.map(order => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                        <td>{order.customer}</td>
                                        <td className="content-details">{order.content}</td>
                                        <td>{order.date}</td>
                                        <td className="price-tag">{order.total} ₺</td>
                                    <td>
                                        <span className={`status-badge badge-${order.status.toLowerCase().split(' ')[0]}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="action-btn" onClick={() => openManagementModal(order)}>
                                            <CgDetailsMore /> Detay & İşlem
                                        </button>
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

            
            <Modal 
                isOpen={manageModalOpen} 
                onClose={() => setManageModalOpen(false)} 
                title={`Sipariş Yönetimi #${selectedOrder?.id || ''}`}
            >
                {selectedOrder && (
                    <div className="order-management-modal">
                        {/* 1. Bölüm: Sipariş Detayları */}
                        <div className="order-info-grid">
                            <div className="info-group">
                                <label>Müşteri:</label>
                                <span>{selectedOrder.customer}</span>
                            </div>
                            <div className="info-group">
                                <label>Adres:</label>
                                <span>{selectedOrder.address}</span>
                            </div>
                            <div className="info-group full-width">
                                <label>Sipariş İçeriği:</label>
                                <div className="content-box">{selectedOrder.content}</div>
                            </div>
                            <div className="info-group">
                                <label>Tutar:</label>
                                <span className="price">{selectedOrder.total} ₺</span>
                            </div>
                             <div className="info-group">
                                <label>Mevcut Durum:</label>
                                <span className={`status-text ${selectedOrder.status}`}>{selectedOrder.status}</span>
                            </div>
                        </div>

                        <hr />

                        {/* 2. Bölüm: Aksiyon Butonları */}
                        <div className="action-area">
                            <h3>İşlemler</h3>
                            {renderModalActions(selectedOrder)}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Yeni Sipariş Ekleme Modalı */}
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
                        onClick={async () => {
                            const customerName = document.getElementById("customerName").value;
                            const orderContent = document.getElementById("orderContent").value;
                            const orderTotal = Number(document.getElementById("orderTotal").value);

                            if (!customerName || !orderContent || !orderTotal) {
                                alert('Lütfen tüm alanları doldurun.');
                                return;
                            }

                            // Not: Manuel sipariş ekleme için backend endpoint'i eklenebilir
                            // Şimdilik sadece frontend'de gösteriyoruz
                            alert('Manuel sipariş ekleme özelliği yakında eklenecektir.');
                            setIsAddOrderModalOpen(false);
                        }}
                        className="approve-btn"
                    >
                        Siparişi Ekle
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default OrdersContent;