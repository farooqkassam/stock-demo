import React from 'react';
import { useStockContext } from '../../context/StockContext';
import StockCard from '../StockCard/StockCard';
import { Plus, TrendingUp } from 'lucide-react';

const Watchlist: React.FC = () => {
  const { state } = useStockContext();

  if (state.watchlist.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <div className="flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No stocks in your watchlist
          </h3>
          <p className="text-gray-400 mb-6">
            Search for stocks above to start building your watchlist
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Plus className="w-4 h-4" />
            <span>Add your first stock</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Watchlist Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Watchlist</h2>
          <p className="text-gray-400">
            {state.watchlist.length} {state.watchlist.length === 1 ? 'stock' : 'stocks'}
          </p>
        </div>
      </div>

      {/* Stock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {state.watchlist.map((stock) => (
          <StockCard key={stock.symbol} stock={stock} />
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
