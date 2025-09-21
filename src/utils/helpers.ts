import type { Stock } from '../context/types';

// Format currency values
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format large numbers (volume, market cap)
export function formatNumber(num: number): string {
  if (num >= 1e12) {
    return (num / 1e12).toFixed(1) + 'T';
  } else if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K';
  }
  return num.toString();
}

// Format percentage values
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

// Get color class based on value (positive/negative)
export function getChangeColorClass(value: number): string {
  return value >= 0 ? 'text-positive' : 'text-negative';
}

// Calculate portfolio metrics
export function calculatePortfolioMetrics(stocks: Stock[]) {
  const portfolioValue = stocks.reduce((total, stock) => total + stock.price, 0);
  const todaysChange = stocks.reduce((total, stock) => total + stock.change, 0);
  const marketMovers = {
    up: stocks.filter(stock => stock.change > 0).length,
    down: stocks.filter(stock => stock.change < 0).length,
  };

  return {
    portfolioValue,
    todaysChange,
    marketMovers,
    totalStocks: stocks.length,
  };
}

// Validate stock symbol format
export function isValidStockSymbol(symbol: string): boolean {
  const symbolRegex = /^[A-Z]{1,5}$/;
  return symbolRegex.test(symbol.toUpperCase());
}

// Sanitize search input
export function sanitizeSearchInput(input: string): string {
  return input.trim().toUpperCase().replace(/[^A-Z0-9\s]/g, '');
}

// Generate stock card ID for accessibility
export function generateStockCardId(symbol: string): string {
  return `stock-card-${symbol.toLowerCase()}`;
}

// Format time ago string
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days}d ago`;
  }
}

// Debounce function for search input
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Error message helpers
export function getErrorMessage(error: any): string {
  if (error?.message) {
    if (error.message.includes('rate limit')) {
      return 'API rate limit exceeded. Please try again later.';
    }
    if (error.message.includes('network')) {
      return 'Network error. Please check your connection.';
    }
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}

// Stock symbol validation with common symbols
export const COMMON_STOCK_SYMBOLS = [
  'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
  'AMD', 'INTC', 'CRM', 'ADBE', 'PYPL', 'UBER', 'SPOT', 'ZM',
  'SQ', 'ROKU', 'PINS', 'SNAP', 'TWTR', 'DIS', 'NKE', 'WMT'
];

export function isCommonStock(symbol: string): boolean {
  return COMMON_STOCK_SYMBOLS.includes(symbol.toUpperCase());
}
