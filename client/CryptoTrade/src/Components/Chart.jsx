import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Chart({ symbol = 'btcusdt' }) {
  const [data, setData] = useState([]);
  const socketSymbol = symbol.toLowerCase() + '@aggTrade';

  useEffect(() => {
    const socket = new WebSocket(`wss://fstream.binance.com/ws/${socketSymbol}`);

    socket.onopen = () => {
      console.log(`WebSocket connected: ${socketSymbol}`);
    };

    socket.onmessage = (event) => {
      const trade = JSON.parse(event.data);
      const date = new Date(trade.E);
      const time = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes()
        .toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

      setData((prev) => {
        const newData = [...prev, { time, value: parseFloat(trade.p) }];
        return newData.slice(-60);
      });
    };

    socket.onclose = () => {
      console.log(`WebSocket closed: ${socketSymbol}`);
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error: ${socketSymbol}`, error);
    };

    return () => socket.close();
  }, [socketSymbol]);

  return (
    <div className="bg-grey-800 p-4 rounded-lg shadow-lg h-64 sm:h-96">
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="#6B7280" />
          <YAxis domain={['auto', 'auto']} stroke="#6B7280" />
          <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
          <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
