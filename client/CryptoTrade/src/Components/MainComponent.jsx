import React from "react";
import { useState, useEffect  } from "react";
import  { selectedSymbolRef } from './Header';
import Chart from "./Chart";
import { TrendingUp, TrendingDown } from 'lucide-react';
import TradeModal from "./TradeModal";
import Toast from './Toast'



export default function MainComponent(){

    
const watchlistItems = [
    { symbol: 'BTCUSD', binanceSymbol: 'btcusdt' },
    { symbol: 'ETHUSD', binanceSymbol: 'ethusdt' },
    { symbol: 'BNBUSD', binanceSymbol: 'bnbusdt' },
    { symbol: 'XRPUSD', binanceSymbol: 'xrpusdt' },
    { symbol: 'SOLUSD', binanceSymbol: 'solusdt' },
    { symbol: 'DOGEUSD', binanceSymbol: 'dogeusdt' },
    { symbol: 'ADAUSD', binanceSymbol: 'adausdt' },
    { symbol: 'AVAXUSD', binanceSymbol: 'avaxusdt' },
  ];

  const trackedSymbols = watchlistItems.map(item => item.binanceSymbol);

   const [livePrices, setLivePrices] = useState({});
   const [currentSymbol, setCurrentSymbol] = useState(selectedSymbolRef.current);
   const [priceChanges, setPriceChanges] = useState({});
   const [isTradeOpen, setIsTradeOpen] = useState(false);
   const [toastVisible, setToastVisible] = useState(false);


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
        const interval = setInterval(fetchMarketData, 10000);
        return () => clearInterval(interval);
   }, []);



    return (
        <><main className="flex-grow flex overflow-hidden p-4">
        {/* Market Overview */}
        <div className="flex-grow mr-4 flex flex-col overflow-hidden">
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

          {/* Trade Actions */}
          <div className="flex justify-end mb-4 space-x-4">
            <button
              onClick={() => setIsTradeOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition"
            >
              Trade {currentSymbol.toUpperCase()}
            </button>
          </div>

          {/* Live Chart */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex-grow overflow-hidden">
            <Chart symbol={currentSymbol} />
          </div>
        </div>

        {/* Watchlist Sidebar */}
        <aside className="w-64 bg-gray-800 p-4 rounded-lg overflow-y-auto max-h-[calc(100vh-100px)]">
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
                    selectedSymbolRef.current = item.binanceSymbol;
                  }}
                  className="flex justify-between items-center p-2 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer"
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
        <TradeModal
        isOpen={isTradeOpen}
        onClose={() => setIsTradeOpen(false)}
        onSuccess={() => setToastVisible(true)}
        symbol={currentSymbol}
        
      />
      {toastVisible && (
        <Toast message="Trade submitted successfully!" onClose={() => setToastVisible(false)} />
      )}
      </>

    )
}