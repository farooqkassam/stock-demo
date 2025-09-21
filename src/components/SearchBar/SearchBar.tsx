import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { useStockSearch } from '../../hooks/useStockData';
import { useStockContext } from '../../context/StockContext';
import { formatCurrency, formatPercentage, getChangeColorClass } from '../../utils/helpers';
import type { Stock } from '../../context/types';

const SearchBar: React.FC = () => {
  const { searchQuery, handleSearchChange } = useStockSearch();
  const { state, addStock } = useStockContext();
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleStockSelect = (stock: Stock) => {
    addStock(stock);
    setIsOpen(false);
    handleSearchChange(''); // Clear search
  };

  const isStockInWatchlist = (symbol: string) => {
    return state.watchlist.some(stock => stock.symbol === symbol);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search stocks"
          value={searchQuery}
          onChange={(e) => {
            handleSearchChange(e.target.value);
            setIsOpen(e.target.value.length > 0);
          }}
          onFocus={() => setIsOpen(searchQuery.length > 0 && state.searchResults.length > 0)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-dark-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => {
              handleSearchChange('');
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-white" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-dark-800 border border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {state.searchLoading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : state.searchResults.length > 0 ? (
            <div className="py-2">
              {state.searchResults.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleStockSelect(stock)}
                  disabled={isStockInWatchlist(stock.symbol)}
                  className={`w-full px-4 py-3 text-left hover:bg-dark-700 transition-colors ${
                    isStockInWatchlist(stock.symbol) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white truncate">
                          {stock.symbol}
                        </span>
                        <span className="text-gray-400 text-sm truncate">
                          {stock.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="font-medium text-white">
                          {formatCurrency(stock.price)}
                        </span>
                        <span className={getChangeColorClass(stock.change)}>
                          {formatPercentage(stock.changePercent)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-2">
                      {isStockInWatchlist(stock.symbol) ? (
                        <span className="text-xs text-gray-500 px-2 py-1 bg-gray-700 rounded">
                          Added
                        </span>
                      ) : (
                        <Plus className="h-4 w-4 text-gray-400 hover:text-primary-500" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery.length > 0 ? (
            <div className="p-4 text-center text-gray-400">
              <p>No stocks found for "{searchQuery}"</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
