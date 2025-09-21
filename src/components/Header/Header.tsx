import React from 'react';
import { BarChart3 } from 'lucide-react';
import SearchBar from '../SearchBar/SearchBar';

const Header: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      {/* Logo and Title */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 bg-primary-600 rounded-lg">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Stock Tracker
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Your personal investment dashboard
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;
