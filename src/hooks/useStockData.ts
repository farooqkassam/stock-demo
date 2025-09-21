import { useState, useCallback, useEffect } from 'react';
import { searchStocks, getStockQuote } from '../services/stockAPI';
import type { Stock } from '../context/types';
import { useStockContext } from '../context/StockContext';

export function useStockSearch() {
  const { setSearchResults, setSearchLoading, clearSearch } = useStockContext();
  const [searchQuery, setSearchQuery] = useState('');

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      clearSearch();
      return;
    }

    setSearchLoading(true);
    try {
      const results = await searchStocks(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, [setSearchResults, setSearchLoading, clearSearch]);

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      search(query);
    }, 300),
    [search]
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  }, [debouncedSearch]);

  return {
    searchQuery,
    handleSearchChange,
    search,
  };
}

export function useStockRefresh() {
  const { state, updateStockData } = useStockContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshAllStocks = useCallback(async () => {
    if (state.watchlist.length === 0) return;

    setIsRefreshing(true);
    try {
      const refreshPromises = state.watchlist.map(async (stock) => {
        try {
          const updatedStock = await getStockQuote(stock.symbol);
          if (updatedStock) {
            // Preserve the name and market cap from the original stock
            const refreshedStock: Stock = {
              ...updatedStock,
              name: stock.name,
              marketCap: stock.marketCap,
            };
            updateStockData(refreshedStock);
          }
        } catch (error) {
          console.error(`Error refreshing ${stock.symbol}:`, error);
        }
      });

      await Promise.all(refreshPromises);
    } catch (error) {
      console.error('Error refreshing stocks:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [state.watchlist, updateStockData]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (state.watchlist.length === 0) return;

    const interval = setInterval(refreshAllStocks, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refreshAllStocks, state.watchlist.length]);

  return {
    refreshAllStocks,
    isRefreshing,
  };
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
