import React from 'react';
import { TrendingUp, TrendingDown, X } from 'lucide-react';
import { useStockContext } from '../../context/StockContext';
import { formatCurrency, formatPercentage, formatNumber, getChangeColorClass } from '../../utils/helpers';
import type { Stock } from '../../context/types';

interface StockCardProps {
  stock: Stock;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  const { removeStock } = useStockContext();

  const handleRemove = () => {
    removeStock(stock.symbol);
  };

  return (
    <div className="card card-hover relative group">
      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full hover:bg-red-600/20"
        aria-label={`Remove ${stock.symbol} from watchlist`}
      >
        <X className="w-4 h-4 text-gray-400 hover:text-red-400" />
      </button>

      {/* Stock Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white truncate">
            {stock.symbol}
          </h3>
          <p className="text-sm text-gray-400 truncate">
            {stock.name}
          </p>
        </div>
      </div>

      {/* Stock Price */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-white">
          {formatCurrency(stock.price)}
        </p>
      </div>

      {/* Stock Change */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {stock.change >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
          <span className={`text-sm font-medium ${getChangeColorClass(stock.change)}`}>
            {formatPercentage(stock.changePercent)}
          </span>
        </div>
        <span className={`text-sm font-medium ${getChangeColorClass(stock.change)}`}>
          {formatCurrency(Math.abs(stock.change))}
        </span>
      </div>

      {/* Stock Stats */}
      <div className="space-y-2 text-sm text-gray-400">
        <div className="flex justify-between">
          <span>Volume:</span>
          <span className="text-white">
            {formatNumber(stock.volume)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Market Cap:</span>
          <span className="text-white">
            {stock.marketCap > 0 ? formatNumber(stock.marketCap) : 'N/A'}
          </span>
        </div>
      </div>

      {/* Last Updated */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <p className="text-xs text-gray-500">
          Updated {new Date(stock.lastUpdated).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default StockCard;
