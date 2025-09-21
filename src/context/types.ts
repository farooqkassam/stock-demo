export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  lastUpdated: string;
}

export interface StockState {
  watchlist: Stock[];
  portfolioValue: number;
  todaysChange: number;
  marketMovers: { up: number; down: number };
  loading: boolean;
  error: string | null;
  searchResults: Stock[];
  searchLoading: boolean;
}

export interface StockAction {
  type: 'ADD_STOCK' | 'REMOVE_STOCK' | 'SET_WATCHLIST' | 'UPDATE_STOCK_DATA' | 'SET_LOADING' | 'SET_ERROR' | 'SET_SEARCH_RESULTS' | 'SET_SEARCH_LOADING' | 'CLEAR_SEARCH';
  payload?: any;
}

export interface APIResponse {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
}

export interface CompanyOverview {
  Symbol: string;
  Name: string;
  MarketCapitalization: string;
  Description: string;
}
