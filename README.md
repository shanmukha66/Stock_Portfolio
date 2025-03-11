# Stock Portfolio Suggestion Engine

A web-based application that provides personalized stock portfolio suggestions based on different investment strategies. The application fetches real-time market data and provides detailed portfolio analysis.

## Features

- **Investment Amount Input**: Users can specify their investment amount (minimum $5,000 USD)
- **Strategy Selection**: Choose from five different investment strategies:
  - Ethical Investing
  - Growth Investing
  - Index Investing
  - Quality Investing
  - Value Investing
- **Real-time Data**: Fetches current stock prices and market data using Yahoo Finance API
- **Portfolio Allocation**: Shows how the investment is divided among selected stocks
- **Weekly Trend**: Displays a 7-day historical trend of the portfolio value
- **Stock Details**: Provides detailed information for each stock in the portfolio
- **Market Overview**: Shows current market indices, forex, commodities, and bonds data

## Technologies Used

- **Backend**: Python, Flask
- **Frontend**: HTML, CSS, JavaScript
- **Data Visualization**: Chart.js
- **Data Source**: Yahoo Finance API (yfinance)
- **Data Processing**: Pandas, NumPy

## Investment Strategies

Each investment strategy maps to at least three different stocks or ETFs:

1. **Ethical Investing**:
   - Apple Inc. (AAPL)
   - Adobe Inc. (ADBE)
   - Tesla, Inc. (TSLA)

2. **Growth Investing**:
   - Oxford Lane Capital Corp. (OXLC)
   - Eagle Point Credit Company (ECC)
   - Advanced Micro Devices, Inc. (AMD)

3. **Index Investing**:
   - Vanguard 500 Index Fund (VOO)
   - Vanguard Total Stock Market ETF (VTI)
   - iShares Core 10+ Year USD Bond (ILTB)

4. **Quality Investing**:
   - NVIDIA Corporation (NVDA)
   - Micron Technology, Inc. (MU)
   - Cisco Systems, Inc. (CSCO)

5. **Value Investing**:
   - Intel Corporation (INTC)
   - Alibaba Group Holding Ltd. (BABA)
   - General Electric Company (GE)

## Installation and Setup

1. **Clone the repository**:
   ```
   git clone (https://github.com/shanmukha66/Stock_Portfolio.git)
   cd stock-portfolio-engine
   ```

2. **Create and activate a virtual environment**:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```
   pip install -r requirements.txt
   ```

4. **Run the application**:
   ```
   python app.py
   ```

5. **Access the application**:
   Open your browser and navigate to `http://127.0.0.1:3000`

## Usage

1. Enter your investment amount (minimum $5,000)
2. Select one or two investment strategies
3. Click "Generate Portfolio" to view your personalized portfolio
4. Explore the portfolio breakdown, weekly trend, and individual stock details
5. Click on any stock card to view detailed information about that stock

## API Endpoints

- `/api/strategies` - Get available investment strategies
- `/api/market_overview` - Get current market data
- `/api/stock_details/<symbol>` - Get detailed information for a specific stock
- `/api/portfolio` - Generate a portfolio based on investment amount and strategies
- `/api/portfolio_history/<portfolio_id>` - Get historical data for a specific portfolio

## Project Structure

```
stock_portfolio_engine/
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── static/                 # Static files
│   ├── css/                # CSS stylesheets
│   │   └── styles.css      # Main stylesheet
│   └── js/                 # JavaScript files
│       ├── index.js        # Home page script
│       └── results.js      # Results page script
└── templates/              # HTML templates
    ├── index.html          # Home page template
    └── results.html        # Results page template
```

## Future Enhancements

- User authentication and portfolio saving
- More investment strategies and stock options
- Advanced portfolio analytics and risk assessment
- Comparison between different investment strategies
- Mobile-responsive design improvements

## Contributors

- [Shanmukha Manoj Kakani](https://github.com/shanmukha66)
- [Vineela Mukkamala](https://github.com/vinny3m)
- [Team Member 2](https://github.com/teammember2)
- [Team Member 3](https://github.com/teammember3)


## Acknowledgments

- Yahoo Finance API for providing real-time stock data
- Flask framework for the web application
- Chart.js for data visualization 
