import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Chart from './Components/Chart';
import Header from './Components/Header.jsx';
import { selectedSymbolRef } from './Components/Header.jsx';
import './App.css';

const watchlistItems = [
  { symbol: 'BTCUSD', binanceSymbol: 'btcusdt', color: 'green' },
  { symbol: 'ETHUSD', binanceSymbol: 'ethusdt', color: 'green' },
  { symbol: 'BNBUSD', binanceSymbol: 'bnbusdt', color: 'green' },
  { symbol: 'XRPUSD', binanceSymbol: 'xrpusdt', color: 'green' },
  { symbol: 'SOLUSD', binanceSymbol: 'solusdt', color: 'green' },
  { symbol: 'DOGEUSD', binanceSymbol: 'dogeusdt', color: 'green' },
  { symbol: 'ADAUSD', binanceSymbol: 'adausdt', color: 'green' },
  { symbol: 'AVAXUSD', binanceSymbol: 'avaxusdt', color: 'green' },
];

const trackedSymbols = watchlistItems.map(item => item.binanceSymbol);

const App = () => {
  const [currentSymbol, setCurrentSymbol] = useState(selectedSymbolRef.current);
  const [livePrices, setLivePrices] = useState({});
  const [priceChanges, setPriceChanges] = useState({});

  // Fetch live prices and 24h changes
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const data = await res.json();

        const prices = {};
        const changes = {};

        data.forEach(item => {
          const symbol = item.symbol.toLowerCase();
          if (trackedSymbols.includes(symbol)) {
            prices[symbol] = parseFloat(item.lastPrice);
            changes[symbol] = parseFloat(item.priceChangePercent);
          }
        });

        setLivePrices(prices);
        setPriceChanges(changes);
      } catch (err) {
        console.error('Failed to fetch market data:', err);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 10000); // refresh every 10s

    return () => clearInterval(interval);
  }, []);

  // Watch for symbol change
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedSymbolRef.current !== currentSymbol) {
        setCurrentSymbol(selectedSymbolRef.current);
        console.log('Symbol changed:', selectedSymbolRef.current);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [currentSymbol]);

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
      <Header />

      <main className="flex-grow p-6 overflow-hidden flex">
        {/* Market Summary (Top Coins) */}
        <div className="flex-grow mr-4">
          <h2 className="text-2xl font-semibold mb-6 text-blue-400">Crypto Market Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {watchlistItems.slice(0, 4).map((item) => {
              const price = livePrices[item.binanceSymbol];
              const change = priceChanges[item.binanceSymbol];
              const isUp = change >= 0;
              const colorClass = isUp ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300';

              return (
                <div key={item.symbol} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">{item.symbol}</span>
                    <span className={`text-xs px-2 py-1 rounded ${colorClass}`}>
                      {change > 0 ? '+' : ''}{change?.toFixed(2)}%
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {price ? price.toLocaleString() : '...'}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Chart */}
          <Chart symbol={currentSymbol} />
        </div>

        {/* Watchlist */}
        <aside className="w-64 bg-gray-800 p-4 rounded-lg overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">Watchlist</h3>
          <ul className="space-y-2">
            {watchlistItems.map((item) => {
              const price = livePrices[item.binanceSymbol];
              const change = priceChanges[item.binanceSymbol];
              const isUp = change >= 0;
              const textColor = isUp ? 'text-green-400' : 'text-red-400';

              return (
                <li
                  key={item.symbol}
                  onClick={() => {
                    setCurrentSymbol(item.binanceSymbol);
                    selectedSymbolRef.current = item.binanceSymbol; // update global ref
                  }
}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1F2937')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                  className="flex justify-between items-center p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  <div>
                    <span className="font-medium">{item.symbol}</span>
                    <span className="block text-sm text-gray-400">
                      {price ? price.toLocaleString() : '...'}
                    </span>
                  </div>
                  <div className={`flex items-center ${textColor}`}>
                    {isUp ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                    <span>{change ? (change > 0 ? '+' : '') + change.toFixed(2) : ''}%</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>
      </main>
    </div>
  );
};

export default App;
