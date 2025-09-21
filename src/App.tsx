import React from 'react';
import { StockProvider } from './context/StockContext';
import Header from './components/Header/Header';
import SummaryCards from './components/SummaryCards/SummaryCards';
import Watchlist from './components/Watchlist/Watchlist';

function App() {
  return (
    <StockProvider>
      <div className="min-h-screen bg-dark-900">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Header />
          <main className="mt-8 space-y-8">
            <SummaryCards />
            <Watchlist />
          </main>
        </div>
      </div>
    </StockProvider>
  );
}

export default App;