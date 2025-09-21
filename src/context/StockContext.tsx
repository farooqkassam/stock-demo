import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Stock, StockState, StockAction } from './types';

const initialState: StockState = {
  watchlist: [],
  portfolioValue: 0,
  todaysChange: 0,
  marketMovers: { up: 0, down: 0 },
  loading: false,
  error: null,
  searchResults: [],
  searchLoading: false,
};

function stockReducer(state: StockState, action: StockAction): StockState {
  switch (action.type) {
    case 'ADD_STOCK':
      const newStock = action.payload;
      const isDuplicate = state.watchlist.some(stock => stock.symbol === newStock.symbol);
      if (isDuplicate) return state;
      
      const updatedWatchlist = [...state.watchlist, newStock];
      return {
        ...state,
        watchlist: updatedWatchlist,
        portfolioValue: calculatePortfolioValue(updatedWatchlist),
        todaysChange: calculateTodaysChange(updatedWatchlist),
        marketMovers: calculateMarketMovers(updatedWatchlist),
        error: null,
      };

    case 'REMOVE_STOCK':
      const symbolToRemove = action.payload;
      const filteredWatchlist = state.watchlist.filter(stock => stock.symbol !== symbolToRemove);
      return {
        ...state,
        watchlist: filteredWatchlist,
        portfolioValue: calculatePortfolioValue(filteredWatchlist),
        todaysChange: calculateTodaysChange(filteredWatchlist),
        marketMovers: calculateMarketMovers(filteredWatchlist),
      };

    case 'SET_WATCHLIST':
      const watchlist = action.payload;
      return {
        ...state,
        watchlist,
        portfolioValue: calculatePortfolioValue(watchlist),
        todaysChange: calculateTodaysChange(watchlist),
        marketMovers: calculateMarketMovers(watchlist),
      };

    case 'UPDATE_STOCK_DATA':
      const updatedStock = action.payload;
      const updatedWatchlistData = state.watchlist.map(stock =>
        stock.symbol === updatedStock.symbol ? updatedStock : stock
      );
      return {
        ...state,
        watchlist: updatedWatchlistData,
        portfolioValue: calculatePortfolioValue(updatedWatchlistData),
        todaysChange: calculateTodaysChange(updatedWatchlistData),
        marketMovers: calculateMarketMovers(updatedWatchlistData),
      };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload, searchLoading: false };

    case 'SET_SEARCH_LOADING':
      return { ...state, searchLoading: action.payload };

    case 'CLEAR_SEARCH':
      return { ...state, searchResults: [], searchLoading: false };

    default:
      return state;
  }
}

// Helper functions
function calculatePortfolioValue(stocks: Stock[]): number {
  return stocks.reduce((total, stock) => total + stock.price, 0);
}

function calculateTodaysChange(stocks: Stock[]): number {
  return stocks.reduce((total, stock) => total + stock.change, 0);
}

function calculateMarketMovers(stocks: Stock[]): { up: number; down: number } {
  const up = stocks.filter(stock => stock.change > 0).length;
  const down = stocks.filter(stock => stock.change < 0).length;
  return { up, down };
}

interface StockContextType {
  state: StockState;
  dispatch: React.Dispatch<StockAction>;
  addStock: (stock: Stock) => void;
  removeStock: (symbol: string) => void;
  updateStockData: (stock: Stock) => void;
  setSearchResults: (results: Stock[]) => void;
  setSearchLoading: (loading: boolean) => void;
  clearSearch: () => void;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export function StockProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(stockReducer, initialState);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('stock-watchlist');
    if (savedWatchlist) {
      try {
        const watchlist = JSON.parse(savedWatchlist);
        dispatch({ type: 'SET_WATCHLIST', payload: watchlist });
      } catch (error) {
        console.error('Error loading watchlist from localStorage:', error);
      }
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('stock-watchlist', JSON.stringify(state.watchlist));
  }, [state.watchlist]);

  const addStock = (stock: Stock) => {
    dispatch({ type: 'ADD_STOCK', payload: stock });
  };

  const removeStock = (symbol: string) => {
    dispatch({ type: 'REMOVE_STOCK', payload: symbol });
  };

  const updateStockData = (stock: Stock) => {
    dispatch({ type: 'UPDATE_STOCK_DATA', payload: stock });
  };

  const setSearchResults = (results: Stock[]) => {
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
  };

  const setSearchLoading = (loading: boolean) => {
    dispatch({ type: 'SET_SEARCH_LOADING', payload: loading });
  };

  const clearSearch = () => {
    dispatch({ type: 'CLEAR_SEARCH' });
  };

  const value: StockContextType = {
    state,
    dispatch,
    addStock,
    removeStock,
    updateStockData,
    setSearchResults,
    setSearchLoading,
    clearSearch,
  };

  return (
    <StockContext.Provider value={value}>
      {children}
    </StockContext.Provider>
  );
}

export function useStockContext() {
  const context = useContext(StockContext);
  if (context === undefined) {
    throw new Error('useStockContext must be used within a StockProvider');
  }
  return context;
}
