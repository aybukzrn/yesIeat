import React, { useState, useEffect } from 'react';

const LiveClock = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  
  const formattedDate = date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long'
  });

  
  const formattedTime = date.toLocaleTimeString('tr-TR');

  return (
    <div style={{ textAlign: 'right', marginTop:'0' }}>
      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#333' }}>
        {formattedTime}
      </div>
      <div style={{ fontSize: '0.9rem', color: '#888' }}>
        {formattedDate}
      </div>
    </div>
  );
};

export default LiveClock;