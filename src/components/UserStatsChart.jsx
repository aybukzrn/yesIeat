import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const UserStatsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
     const fakeApiCall = () => {
         setTimeout(() => {
             setData([
                 { name: 'Aktif', value: 12500 },
                 { name: 'Yeni', value: 4500 },
                 { name: 'Pasif', value: 1200 },
                 { name: 'Ziyaretçi', value: 8000 },
             ]);
         }, 500);
     };
     fakeApiCall();
  }, []);

  
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <PieChart width={500} height={300}>
        <Pie
            data={data}
            cx={150}  
            cy={150}  
            innerRadius={40}
            outerRadius={90}
            fill="#8884d8"
            paddingAngle={1}
            dataKey="value"
            label
        >
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
        </Pie>
        
        <Tooltip />
        
        <Legend 
            layout="vertical"       
            verticalAlign="middle" 
            align="right"       
            wrapperStyle={{ paddingLeft: "0px", fontSize: "18px", marginRight: "40px" }} 
            
        />
    </PieChart>
</div>
  );
};

export default UserStatsChart;