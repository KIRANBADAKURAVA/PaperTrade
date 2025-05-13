import { useNavigate } from 'react-router-dom';
import { Search, Menu, ChevronRight } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { logout } from '../Store/authSlice.js';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const selectedSymbolRef = { current: 'btcusdt',
                            func: ()=>{}
 }; // default

export default function Header() {
  const [symbols, setSymbols] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [accountBalance, setAccountBalance] = useState(10000); // Example static value in USD

  const authStatus = useSelector((state) => state.auth.status);
  const accessToken= useSelector((state) => state.auth.accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuRef = useRef(null);

  const handlelogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/user/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('accessToken');
        dispatch(logout());
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    const results = symbols.filter((item) => item.toLowerCase().includes(query));
    setSearchResults(results);
  };

  // exchangeInfo
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/exchangeInfo`);
        const data = await response.json();
        const symbolsList = data.symbols.map((item) => item.symbol);
        setSymbols(symbolsList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    selectedSymbolRef.func = fetchData;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/user/balance', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Unable to fetch balance');
        }
  
        const data = await response.json();
        setAccountBalance(data.data); 
        console.log(data);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
  
    if (accessToken) {
      fetchBalance();
    }
  }, []);
  

  return (
    <header className="bg-gray-900 px-6 py-3 flex items-center justify-between shadow-lg">
      {/* Logo + Trades */}
      <div className="flex items-center space-x-6">
        <span
          onClick={() => navigate('/')}
          className="text-3xl font-bold text-blue-500 hover:text-blue-400 transition duration-200 cursor-pointer"
        >
          TY
        </span>

        <button
          onClick={() => navigate('/trades')}
          className="text-white text-lg font-medium hover:text-blue-400 transition duration-200"
        >
          Trades
        </button>
      </div>

      {/* Search + Menu + Account Balance */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative w-60 md:w-72 lg:w-80">
          <input
            type="text"
            placeholder="Search symbols..."
            value={search}
            onChange={handleSearch}
            className="w-full bg-gray-800 text-white rounded-full py-2 px-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />

          {searchResults.length > 0 && (
            <div className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto bg-gray-800 text-white rounded-lg shadow-lg">
              {searchResults.map((result, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedSymbol(result);
                    setSearch('');
                    setSearchResults([]);
                    selectedSymbolRef.current = result;
                  }}
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                >
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account Balance */}
        <div className="text-white flex items-center space-x-2">
          <span className="text-sm">Balance:</span>
          <span className="text-xl font-semibold">${accountBalance.toLocaleString()}</span>
        </div>

        {/* Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition duration-200"
          >
            <Menu className="text-white w-5 h-5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg z-20 py-2 animate-fadeIn">
              {authStatus ? (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handlelogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/login');
                  }}
                  className="block w-full text-left px-4 py-2 text-blue-600 hover:bg-gray-100 transition"
                >
                  Login
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export { selectedSymbolRef };

