import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useStockContext } from '../../context/StockContext';
import { formatCurrency, formatPercentage, getChangeColorClass } from '../../utils/helpers';

const SummaryCards: React.FC = () => {
  const { state } = useStockContext();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Portfolio Value Card */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-600 rounded-lg">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Portfolio Value</h3>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(state.portfolioValue)}
            </p>
          </div>
        </div>
      </div>

      {/* Today's Change Card */}
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Today's Change</h3>
            <p className={`text-2xl font-bold ${getChangeColorClass(state.todaysChange)}`}>
              {formatCurrency(state.todaysChange)}
            </p>
          </div>
        </div>
      </div>

      {/* Market Movers Card */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Market Movers</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-lg font-semibold text-green-400">
                  {state.marketMovers.up}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-red-400" />
                <span className="text-lg font-semibold text-red-400">
                  {state.marketMovers.down}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">
              {state.watchlist.length}
            </p>
            <p className="text-sm text-gray-400">Stocks</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
