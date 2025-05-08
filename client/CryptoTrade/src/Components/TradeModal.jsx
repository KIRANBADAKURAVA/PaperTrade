import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const TradeModal = ({ isOpen, onClose, onSuccess, symbol }) => {
  const [price, setPrice] = useState('');
  const [lastPrice, setLastPrice] = useState(null);
  const [tradeType, setTradeType] = useState('market'); // market or limit
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (lastPrice && tradeType === 'market') {
      setPrice(lastPrice.toFixed(2));
    }
  }, [lastPrice, tradeType]);

  useEffect(() => {
    if (!symbol) return;

    const socket = new WebSocket(`wss://fstream.binance.com/ws/${symbol.toLowerCase()}@aggTrade`);
    socket.onmessage = (event) => {
      const trade = JSON.parse(event.data);
      const price = parseFloat(trade.p);
      setLastPrice(price);
    };
    return () => socket.close();
  }, [symbol]);

  useEffect(() => {
    if (!isOpen) {
      setPrice('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authStatus) {
      alert('Please log in to trade');
      navigate('/login');
      return;
    }

    const form = e.target;
    const quantity = parseFloat(form.quantity.value);
    const tradePrice = parseFloat(price);
    const action = form.action.value;

    if (quantity <= 0 || tradePrice <= 0) {
      alert('Price and quantity must be positive numbers.');
      return;
    }

    const tradeData = {
      symbol,
      quantity,
      price: tradePrice,
      action,
      type: tradeType // pass trade type to backend
    };

    try {
      const response = await fetch('http://localhost:8000/api/v1/trade/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: JSON.stringify(tradeData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Trade failed');
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      alert(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-gray-800 text-white p-6 rounded-xl w-full max-w-md shadow-xl">
        <h2 className="text-xl font-semibold mb-4">
          Place Trade - {symbol?.toUpperCase() || 'N/A'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Trade Type */}
          <div>
            <label className="block text-sm mb-1">Trade Type</label>
            <select
              value={tradeType}
              onChange={(e) => setTradeType(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            >
              <option value="market">Market</option>
              <option value="limit">Limit</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              step="any"
              required
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Price</label>
            <input
              type="number"
              name="price"
              step="any"
              required
              disabled={tradeType === 'market'}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
            <p className="text-xs text-gray-400 mt-1">
              {tradeType === 'market' ? 'Using live market price.' : 'Custom price for limit order.'}
            </p>
          </div>

          <div>
            <label className="block text-sm mb-1">Action</label>
            <select
              name="action"
              required
              className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeModal;
