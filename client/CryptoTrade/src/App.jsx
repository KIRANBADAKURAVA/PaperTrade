import React, { useEffect, useState } from 'react';
import Header, { selectedSymbolRef } from './Components/Header';
import MainComponent from './Components/MainComponent';
import './App.css';


const App = () => {
  const [currentSymbol, setCurrentSymbol] = useState(selectedSymbolRef.current);
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedSymbolRef.current !== currentSymbol) {
        setCurrentSymbol(selectedSymbolRef.current);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [currentSymbol]);

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col overflow-hidden">
      <Header />
      <MainComponent/>
    </div>
  );
};

export default App;
