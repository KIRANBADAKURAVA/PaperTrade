import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Trades = () => {
  const [activeTab, setActiveTab] = useState('open');
  const [loading, setLoading] = useState(false);
  const [trades, setTrades] = useState([]);
  const [livePrices, setLivePrices] = useState({});
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const tabClass = (tab) =>
    `px-4 py-2 rounded-t-lg transition-all duration-200 font-medium ${
      activeTab === tab
        ? 'bg-blue-700 text-white shadow'
        : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
    }`;

  const fetchTrades = async (status) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/v1/trade/by-status/${status}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.status === 400) {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch trades');
      const data = await res.json();
      setTrades(data.data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const closeTrade = async (tradeId, price) => {
    console.log('Closing trade:', tradeId, 'at price:', price);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/trade/close/${tradeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ price }),
      });
      if (!res.ok) throw new Error('Failed to close trade');
      fetchTrades('open');
    } catch (err) {
      console.error('Error closing trade:', err.message);
    }
  };

  useEffect(() => {
    if (activeTab !== 'open' || trades.length === 0) return;

    const sockets = {};

    trades.forEach((trade) => {
      const symbol = trade.symbol.toLowerCase();
      const ws = new WebSocket(`wss://fstream.binance.com/ws/${symbol}@aggTrade`);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const price = parseFloat(data.p);
        setLivePrices((prev) => ({ ...prev, [trade._id]: price }));
      };

      ws.onerror = (error) => {
        console.error(`WebSocket error for ${symbol}`, error);
      };

      sockets[trade._id] = ws;
    });

    return () => {
      Object.values(sockets).forEach((ws) => ws.close());
    };
  }, [trades, activeTab]);

  useEffect(() => {
    fetchTrades(activeTab);
  }, [activeTab]);

  const renderTradeItem = (trade, showClose = false) => {
    //console.log('Rendering trade:', trade);

    const livePrice = livePrices[trade._id];
  //  console.log('Live price:', livePrice);
    const entry = trade.entryPrice;
    const qty = trade.quantity;
    const isLong = trade.tradeType === 'LONG';

    
    const pnl = livePrice
      ? (isLong ? -(livePrice - entry) : -(entry - livePrice)) * qty
      : null;

    const pnlClass = pnl > 0
      ? 'text-green-400'
      : pnl < 0
      ? 'text-red-500'
      : 'text-gray-300';

    return (
      <li
        key={trade._id}
        className="mb-3 p-4 bg-gray-800 rounded-lg shadow hover:shadow-md transition"
      >
        <div className="flex justify-between items-center">
          <div>
            <p className="text-blue-400 text-lg font-semibold">{trade.symbol}</p>
            <p className="text-gray-400">Quantity: {qty}</p>
            <p className="text-gray-400">Entry Price: ${entry}</p>
            <p className="text-gray-400">Trade Type: {trade.tradeType}</p>
            {showClose && (
              <>
                <p className="text-yellow-400">
                  Live Price: ${livePrice?.toFixed(2) || 'Loading...'}
                </p>
                <p className={`font-semibold ${pnlClass}`}>
                  PnL: {pnl !== null ? `$${pnl.toFixed(2)}` : 'Calculating...'}
                </p>
              </>
            )}
          </div>
          {showClose && livePrice && (
            <button
              onClick={() => closeTrade(trade._id, livePrice)}
              className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition"
            >
              Close
            </button>
          )}
        </div>
      </li>
    );
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <button
        onClick={() => navigate('/')}
        className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
      >
        Home
      </button>

      <h1 className="text-3xl font-bold text-blue-400 mb-2">My Trades</h1>


      <div className="bg-gray-800 rounded-lg shadow-lg">
        <div className="flex space-x-2 border-b border-gray-700 px-4 pt-4">
          {['open', 'closed', 'pending'].map((tab) => (
            <button key={tab} className={tabClass(tab)} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-4">
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4 capitalize">{activeTab} Trades</h2>
              {trades.length === 0 ? (
                <p className="text-gray-400">No {activeTab} trades found.</p>
              ) : (
                <ul>
                  {trades.map((trade) =>
                    renderTradeItem(trade, activeTab === 'open')
                  )}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trades;
