import { Search, Menu } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const selectedSymbolRef = { current: 'btcusdt' }; // default

export default function Header() {
    const [symbols, setSymbols] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedSymbol, setSelectedSymbol] = useState(null);

    // handle search input change
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearch(query);
        const results = symbols.filter((item) => item.toLowerCase().includes(query));
        setSearchResults(results);
    };

    //  Fetch symbols from Binance API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://api.binance.com/api/v3/exchangeInfo`);
                const data = await response.json();
                const symbolsList = data.symbols.map(item => item.symbol);
                setSymbols(symbolsList);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <header className="bg-gray-800 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-6">
                <span className="text-2xl font-bold text-blue-500">TY</span>
                {/* <nav className="hidden md:flex space-x-6">
                    {['Products', 'Community', 'Markets', 'News', 'Brokers'].map((item) => (
                        <a key={item} href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">{item}</a>
                    ))}
                </nav> */}
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search symbols..." 
                        className="bg-gray-700 text-white rounded-full py-2 px-4 pl-10 w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        onChange={handleSearch}
                        value={search}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 mt-1 w-full bg-gray-700 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                            {searchResults.map((result, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setSelectedSymbol(result);
                                        setSearch('');
                                        setSearchResults([]);
                                        selectedSymbolRef.current = result; // update global ref
                                    }}
                                    className="p-2 hover:bg-gray-600 cursor-pointer"
                                >
                                    {result}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <button className="bg-blue-600 rounded-full p-2 hover:bg-blue-700 transition-colors duration-200">
                    <Menu className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}

// Export the ref
export { selectedSymbolRef };
