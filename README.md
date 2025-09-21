# Stock Tracker

A responsive React.js application for tracking stock prices with watchlist functionality, built with TypeScript and Tailwind CSS.

![Stock Tracker Dashboard](https://via.placeholder.com/800x400/1a1a2e/ffffff?text=Stock+Tracker+Dashboard)

## Features

- 🔍 **Stock Search**: Search and add stocks to your watchlist
- 📊 **Real-time Data**: Display current prices, changes, volume, and market cap
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- 🌙 **Dark Theme**: Modern dark UI for comfortable viewing
- 💾 **Persistent Storage**: Watchlist saved locally in your browser
- ⚡ **Fast Performance**: Optimized with caching and debounced search

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context + useReducer
- **API**: Alpha Vantage (free tier)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Alpha Vantage API key (free)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd stock-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Get API Key**
   - Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
   - Sign up for a free API key
   - Copy the key

4. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` and add your API key:
   ```
   VITE_ALPHA_VANTAGE_API_KEY=your_api_key_here
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## Usage

1. **Search for stocks**: Use the search bar to find stocks by symbol (e.g., AAPL, GOOGL, MSFT)
2. **Add to watchlist**: Click the plus icon next to search results
3. **View portfolio**: See your total portfolio value and daily changes
4. **Monitor stocks**: Track real-time prices, changes, and market data
5. **Remove stocks**: Hover over stock cards and click the X button

## API Limits

The free Alpha Vantage API has the following limits:
- 5 API requests per minute
- 500 requests per day
- The app includes caching to minimize API calls

## Deployment

### AWS Amplify

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Amplify**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Connect your GitHub repository
   - Add environment variable: `VITE_ALPHA_VANTAGE_API_KEY`

3. **Deploy**
   - Amplify will auto-detect React settings
   - Build and deploy automatically

## Project Structure

```
src/
├── components/
│   ├── Header/           # App header with logo and search
│   ├── SummaryCards/     # Portfolio overview cards
│   ├── StockCard/        # Individual stock display
│   ├── Watchlist/        # Watchlist grid layout
│   └── SearchBar/        # Stock search functionality
├── context/
│   ├── StockContext.tsx  # Global state management
│   └── types.ts          # TypeScript interfaces
├── hooks/
│   ├── useStockData.ts   # Stock data fetching logic
│   └── useLocalStorage.ts # Local storage utilities
├── services/
│   └── stockAPI.ts       # Alpha Vantage API integration
├── utils/
│   └── helpers.ts        # Utility functions
└── App.tsx               # Main application component
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your API key is correct
3. Ensure you haven't exceeded API rate limits
4. Create an issue on GitHub

## Roadmap

- [ ] Price charts and historical data
- [ ] Push notifications for price alerts
- [ ] Multiple watchlists
- [ ] Portfolio analytics
- [ ] Social features (share watchlists)
- [ ] Advanced filtering and sorting