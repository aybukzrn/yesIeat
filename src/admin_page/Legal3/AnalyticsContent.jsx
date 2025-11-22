import React, { useState, useEffect } from 'react'; // 1. Hook'ları import ettik
import './AnalyticsContent.css';
import { IoLayersSharp } from "react-icons/io5";
import { GiConfirmed } from "react-icons/gi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { FaRegCreditCard } from "react-icons/fa";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Renkler sabit kalabilir
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsContent = () => {
    // 2. STATE TANIMLAMASI (Veriyi ve Yüklenme Durumunu tutacak)
    // Başlangıçta veri boş bir dizi []
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // 3. USEEFFECT (Veriyi Çekme Simülasyonu)
    useEffect(() => {
        // Bu kısım sayfa ilk açıldığında (mount olduğunda) bir kere çalışır.
        // Gerçek projede burada: fetch('api/users/stats') ... denilecek.
        
        const fetchData = () => {
            setIsLoading(true);
            
            // Backend gecikmesini (1 saniye) taklit ediyoruz
            setTimeout(() => {
                // Sanki backend'den gelen veri buymuş gibi:
                const incomingData = [
                    { name: 'Aktif Kullanıcı', value: 12500 },
                    { name: 'Yeni Kayıt', value: 4500 },
                    { name: 'Pasif Kullanıcı', value: 1200 },
                    { name: 'Ziyaretçi', value: 8000 },
                ];
                
                setChartData(incomingData); // State'i güncelle
                setIsLoading(false);      // Yükleniyor'u kapat
            }, 1000);
        };

        fetchData();
    }, []); // Boş dizi dependency: Sadece ilk renderda çalışsın demek.

    return (
        <div className="analytics-content">

            {/* SOL PANEL: İstatistik Kutuları */}
            <div className="left-panel">
                <div className="boxs">
                    <div className="daily-orders box">
                        <div className="headers">
                            <div className="text"><h2>Günlük Siparişler</h2></div>
                            <div className="icon"><IoLayersSharp /></div>
                        </div>
                        <div className="contens">
                            <h1>45</h1>
                            <p>Son 24 Saat</p>
                        </div>
                    </div>

                    <div className="approved box">
                        <div className="headers">
                            <div className="text"><h2>Onaylanan</h2></div>
                            <div className="icon"><GiConfirmed /></div>
                        </div>
                        <div className="contens">
                            <h1>40</h1>
                            <p>Son 24 Saat</p>
                        </div>
                    </div>

                    <div className="month-total box">
                        <div className="headers">
                            <div className="text"><h2>Aylık Kazanç</h2></div>
                            <div className="icon"><MdOutlineAttachMoney /></div>
                        </div>
                        <div className="contens">
                            <h1>35,234</h1>
                        </div>
                    </div>

                    <div className="revenue box">
                        <div className="headers">
                            <div className="text"><h2>Hasılat</h2></div>
                            <div className="icon"><FaRegCreditCard /></div>
                        </div>
                        <div className="contens">
                            <h1>25,234</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* SAĞ PANEL: Grafik */}
            <div className="right-panel graph">
                <h3>Kullanıcı Dağılımı</h3>
                <p className="text-muted">Kullanıcı tiplerine göre dağılım.</p>

                <div style={{ width: '100%', height: 350, marginTop: '20px' }}>
                    {/* KOŞULLU RENDER: Veri yükleniyorsa "Yükleniyor" yazsın */}
                    {isLoading ? (
                        <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}>
                            <p>Veriler yükleniyor...</p>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData} // State'teki veriyi kullanıyoruz
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
            
        </div>
    )
}

export default AnalyticsContent;