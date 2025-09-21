import axios from 'axios';
import type { Stock, APIResponse, CompanyOverview } from '../context/types';

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

// Cache to store API responses and avoid rate limiting
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getFromCache(key: string): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function searchStocks(query: string): Promise<Stock[]> {
  if (!query.trim()) return [];

  try {
    const cacheKey = `search-${query.toLowerCase()}`;
    const cached = getFromCache(cacheKey);
    if (cached) return cached;

    // First, try to get company overview to get the name
    const overviewResponse = await axios.get(BASE_URL, {
      params: {
        function: 'OVERVIEW',
        symbol: query.toUpperCase(),
        apikey: API_KEY,
      },
    });

    const overview: CompanyOverview = overviewResponse.data;

    if (overview.Note || overview.Information) {
      throw new Error('API rate limit exceeded or invalid response');
    }

    if (!overview.Symbol) {
      return []; // No results found
    }

    // Get real-time quote data
    const quoteResponse = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: query.toUpperCase(),
        apikey: API_KEY,
      },
    });

    const quoteData: APIResponse = quoteResponse.data;

    if (quoteData.Note || quoteData.Information) {
      throw new Error('API rate limit exceeded or invalid response');
    }

    if (!quoteData['Global Quote'] || !quoteData['Global Quote']['05. price']) {
      return [];
    }

    const stock: Stock = {
      symbol: overview.Symbol,
      name: overview.Name || overview.Symbol,
      price: parseFloat(quoteData['Global Quote']['05. price']),
      change: parseFloat(quoteData['Global Quote']['09. change']),
      changePercent: parseFloat(quoteData['Global Quote']['10. change percent'].replace('%', '')),
      volume: parseInt(quoteData['Global Quote']['06. volume']),
      marketCap: overview.MarketCapitalization ? parseInt(overview.MarketCapitalization) : 0,
      lastUpdated: new Date().toISOString(),
    };

    const result = [stock];
    setCache(cacheKey, result);
    return result;

  } catch (error) {
    console.error('Error searching stocks:', error);
    throw error;
  }
}

export async function getStockQuote(symbol: string): Promise<Stock | null> {
  try {
    const cacheKey = `quote-${symbol.toUpperCase()}`;
    const cached = getFromCache(cacheKey);
    if (cached) return cached;

    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol.toUpperCase(),
        apikey: API_KEY,
      },
    });

    const data: APIResponse = response.data;

    if (data.Note || data.Information) {
      throw new Error('API rate limit exceeded or invalid response');
    }

    if (!data['Global Quote'] || !data['Global Quote']['05. price']) {
      return null;
    }

    const quote = data['Global Quote'];
    const stock: Stock = {
      symbol: quote['01. symbol'],
      name: quote['01. symbol'], // We'll get the full name separately if needed
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      volume: parseInt(quote['06. volume']),
      marketCap: 0, // Will be populated separately
      lastUpdated: new Date().toISOString(),
    };

    setCache(cacheKey, stock);
    return stock;

  } catch (error) {
    console.error('Error fetching stock quote:', error);
    throw error;
  }
}

export async function getCompanyOverview(symbol: string): Promise<CompanyOverview | null> {
  try {
    const cacheKey = `overview-${symbol.toUpperCase()}`;
    const cached = getFromCache(cacheKey);
    if (cached) return cached;

    const response = await axios.get(BASE_URL, {
      params: {
        function: 'OVERVIEW',
        symbol: symbol.toUpperCase(),
        apikey: API_KEY,
      },
    });

    const data: CompanyOverview = response.data;

    if (data.Note || data.Information) {
      throw new Error('API rate limit exceeded or invalid response');
    }

    if (!data.Symbol) {
      return null;
    }

    setCache(cacheKey, data);
    return data;

  } catch (error) {
    console.error('Error fetching company overview:', error);
    throw error;
  }
}

// Utility function to format large numbers
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

// Utility function to format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
