import React, { useState, useEffect } from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlySalesChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGraphData = () => {
      setIsLoading(true);

      // Backend'den veri çekme simülasyonu
      setTimeout(() => {
        
        const hardcodedData = [
            { name: 'Ocak', satis: 4000, hedef: 2400 },
            { name: 'Şubat', satis: 3000, hedef: 1398 },
            { name: 'Mart', satis: 2000, hedef: 9800 },
            { name: 'Nisan', satis: 2780, hedef: 3908 },
            { name: 'Mayıs', satis: 1890, hedef: 4800 },
            { name: 'Haziran', satis: 2390, hedef: 3800 },
            { name: 'Temmuz', satis: 3490, hedef: 4300 },
            { name: 'Ağustos', satis: 4200, hedef: 5000 },
            { name: 'Eylül', satis: 5100, hedef: 5200 },
            { name: 'Ekim', satis: 3800, hedef: 4000 },
            { name: 'Kasım', satis: 4600, hedef: 4500 },
            { name: 'Aralık', satis: 6000, hedef: 5800 },
        ];

        setData(hardcodedData); 
        setIsLoading(false);    
      }, 1000);
    };

    fetchGraphData();
  }, []);

  return (
    <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        height: '100%',
        minHeight: '400px' 
    }}>
      <h3 style={{ marginBottom: '20px', color: '#333', fontSize:'18px' }}>Aylık Satış Performansı</h3>
      
      <div style={{ width: '100%', height: 350 }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p>Veriler yükleniyor...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              
              
              <Line 
                type="monotone" 
                dataKey="satis" 
                name="Gerçekleşen Satış" 
                stroke="#D34E4E" 
                strokeWidth={3}  
                activeDot={{ r: 8 }} 
              />
              
           
              <Line 
                type="monotone" 
                dataKey="hedef" 
                name="Hedeflenen" 
                stroke="#b0b0b0" 
                strokeDasharray="5 5" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MonthlySalesChart;