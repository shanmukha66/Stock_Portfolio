from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import numpy as np
import json
import plotly
import plotly.graph_objects as go
from datetime import datetime, timedelta
import os

app = Flask(__name__)
CORS(app)

# Investment strategies with corresponding stocks/ETFs
INVESTMENT_STRATEGIES = {
    "Ethical Investing": [
        {"symbol": "AAPL", "name": "Apple Inc.", "allocation": 0.5},
        {"symbol": "ADBE", "name": "Adobe Inc.", "allocation": 0.2},
        {"symbol": "TSLA", "name": "Tesla, Inc.", "allocation": 0.3}
    ],
    "Growth Investing": [
        {"symbol": "OXLC", "name": "Oxford Lane Capital Corp.", "allocation": 0.5},
        {"symbol": "ECC", "name": "Eagle Point Credit Company", "allocation": 0.3},
        {"symbol": "AMD", "name": "Advanced Micro Devices, Inc.", "allocation": 0.2}
    ],
    "Index Investing": [
        {"symbol": "VOO", "name": "Vanguard 500 Index Fund", "allocation": 0.5},
        {"symbol": "VTI", "name": "Vanguard Total Stock Market ETF", "allocation": 0.3},
        {"symbol": "ILTB", "name": "iShares Core 10+ Year USD Bond", "allocation": 0.2}
    ],
    "Quality Investing": [
        {"symbol": "NVDA", "name": "NVIDIA Corporation", "allocation": 0.5},
        {"symbol": "MU", "name": "Micron Technology, Inc.", "allocation": 0.3},
        {"symbol": "CSCO", "name": "Cisco Systems, Inc.", "allocation": 0.2}
    ],
    "Value Investing": [
        {"symbol": "INTC", "name": "Intel Corporation", "allocation": 0.5},
        {"symbol": "BABA", "name": "Alibaba Group Holding Ltd.", "allocation": 0.3},
        {"symbol": "GE", "name": "General Electric Company", "allocation": 0.2}
    ]
}

# Store portfolio history (simulated for now)
portfolio_history = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/results')
def results():
    return render_template('results.html')

@app.route('/api/strategies', methods=['GET'])
def get_strategies():
    return jsonify(list(INVESTMENT_STRATEGIES.keys()))

@app.route('/api/market_overview', methods=['GET'])
def get_market_overview():
    # Get major indices data
    indices = {
        "^GSPC": "S&P 500",
        "^DJI": "Dow Jones",
        "^IXIC": "NASDAQ",
        "^FTSE": "FTSE 100"
    }
    
    # Get forex data
    forex = {
        "EURUSD=X": "EUR/USD",
        "GBPUSD=X": "GBP/USD",
        "USDJPY=X": "USD/JPY"
    }
    
    # Get commodities data
    commodities = {
        "GC=F": "Gold",
        "CL=F": "Crude Oil",
        "SI=F": "Silver"
    }
    
    # Get bonds data
    bonds = {
        "^TNX": "10-Year Treasury",
        "^TYX": "30-Year Treasury"
    }
    
    # Combine all data
    all_symbols = {**indices, **forex, **commodities, **bonds}
    
    try:
        # Download data for the last 2 days to calculate changes
        data = yf.download(list(all_symbols.keys()), period="2d")['Close']
        
        result = {
            "indices": {},
            "forex": {},
            "commodities": {},
            "bonds": {}
        }
        
        # Process indices
        for symbol, name in indices.items():
            if symbol in data.columns:
                # Get today's and yesterday's closing prices
                today_price = float(data[symbol].iloc[-1])
                yesterday_price = float(data[symbol].iloc[-2])
                
                # Calculate change and percent change
                change = today_price - yesterday_price
                percent_change = (change / yesterday_price) * 100
                
                result["indices"][name] = {
                    "price": today_price,
                    "change": change,
                    "percent_change": percent_change
                }
        
        # Process forex
        for symbol, name in forex.items():
            if symbol in data.columns:
                # Get today's and yesterday's closing prices
                today_price = float(data[symbol].iloc[-1])
                yesterday_price = float(data[symbol].iloc[-2])
                
                # Calculate change and percent change
                change = today_price - yesterday_price
                percent_change = (change / yesterday_price) * 100
                
                result["forex"][name] = {
                    "price": today_price,
                    "change": change,
                    "percent_change": percent_change
                }
        
        # Process commodities
        for symbol, name in commodities.items():
            if symbol in data.columns:
                # Get today's and yesterday's closing prices
                today_price = float(data[symbol].iloc[-1])
                yesterday_price = float(data[symbol].iloc[-2])
                
                # Calculate change and percent change
                change = today_price - yesterday_price
                percent_change = (change / yesterday_price) * 100
                
                result["commodities"][name] = {
                    "price": today_price,
                    "change": change,
                    "percent_change": percent_change
                }
        
        # Process bonds
        for symbol, name in bonds.items():
            if symbol in data.columns:
                # Get today's and yesterday's closing prices
                today_price = float(data[symbol].iloc[-1])
                yesterday_price = float(data[symbol].iloc[-2])
                
                # Calculate change and percent change
                change = today_price - yesterday_price
                percent_change = (change / yesterday_price) * 100
                
                result["bonds"][name] = {
                    "price": today_price,
                    "change": change,
                    "percent_change": percent_change
                }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stock_details/<symbol>', methods=['GET'])
def get_stock_details(symbol):
    try:
        stock = yf.Ticker(symbol)
        hist = stock.history(period="1d", interval="5m")
        
        if hist.empty:
            return jsonify({"error": "No data available for this stock"}), 404
        
        # Create time series data for the chart
        times = hist.index.strftime('%H:%M:%S').tolist()
        prices = hist['Close'].tolist()
        
        # Get current price and other info
        info = stock.info
        current_price = hist['Close'].iloc[-1] if not hist.empty else None
        
        result = {
            "symbol": symbol,
            "name": info.get('shortName', symbol),
            "current_price": float(current_price) if current_price is not None else None,
            "open": float(hist['Open'].iloc[0]) if not hist.empty else None,
            "high": float(hist['High'].max()) if not hist.empty else None,
            "low": float(hist['Low'].min()) if not hist.empty else None,
            "volume": int(hist['Volume'].sum()) if not hist.empty else None,
            "times": times,
            "prices": [float(p) for p in prices]
        }
        
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/portfolio', methods=['POST'])
def get_portfolio():
    data = request.json
    amount = float(data.get('amount', 5000))
    strategies = data.get('strategies', [])
    
    if amount < 5000:
        return jsonify({"error": "Investment amount must be at least $5000"}), 400
    
    if not strategies or len(strategies) > 2:
        return jsonify({"error": "Please select one or two investment strategies"}), 400
    
    # Calculate allocation per strategy
    strategy_allocation = amount / len(strategies)
    
    portfolio = {}
    total_invested = 0
    
    for strategy in strategies:
        if strategy not in INVESTMENT_STRATEGIES:
            return jsonify({"error": f"Invalid strategy: {strategy}"}), 400
        
        portfolio[strategy] = []
        
        for stock in INVESTMENT_STRATEGIES[strategy]:
            symbol = stock["symbol"]
            allocation = stock["allocation"]
            invest_amount = strategy_allocation * allocation
            
            try:
                ticker = yf.Ticker(symbol)
                current_price = ticker.history(period="1d")['Close'].iloc[-1]
                
                # Calculate shares and actual investment
                shares = invest_amount / current_price
                actual_investment = shares * current_price
                total_invested += actual_investment
                
                # Calculate daily change
                prev_close = ticker.history(period="2d")['Close'].iloc[0]
                change = current_price - prev_close
                percent_change = (change / prev_close) * 100
                
                portfolio[strategy].append({
                    "symbol": symbol,
                    "name": stock["name"],
                    "price": float(current_price),
                    "invest_amount": float(invest_amount),
                    "shares": float(shares),
                    "change": float(change),
                    "percent_change": float(percent_change)
                })
            except Exception as e:
                return jsonify({"error": f"Error fetching data for {symbol}: {str(e)}"}), 500
    
    # Store portfolio for history tracking (in a real app, this would be in a database)
    portfolio_id = datetime.now().strftime("%Y%m%d%H%M%S")
    portfolio_history[portfolio_id] = {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "amount": amount,
        "strategies": strategies,
        "portfolio": portfolio,
        "total_value": total_invested
    }
    
    # Generate weekly trend data (simulated for now)
    trend_data = generate_trend_data(portfolio, strategies)
    
    result = {
        "portfolio_id": portfolio_id,
        "amount": amount,
        "strategies": strategies,
        "portfolio": portfolio,
        "total_invested": float(total_invested),
        "trend_data": trend_data
    }
    
    return jsonify(result)

def generate_trend_data(portfolio, strategies):
    """Generate weekly trend data for the portfolio using real historical data."""
    # Get end date (today) and start date (7 days ago)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=7)
    
    # Format dates for yfinance
    start_str = start_date.strftime('%Y-%m-%d')
    end_str = end_date.strftime('%Y-%m-%d')
    
    # Collect all symbols from the portfolio
    all_symbols = []
    symbol_to_shares = {}
    symbol_to_strategy = {}
    
    for strategy in strategies:
        for stock in portfolio[strategy]:
            symbol = stock["symbol"]
            shares = stock["shares"]
            
            all_symbols.append(symbol)
            symbol_to_shares[symbol] = shares
            symbol_to_strategy[symbol] = strategy
    
    try:
        # Download historical data for all symbols
        historical_data = yf.download(all_symbols, start=start_str, end=end_str)['Close']
        
        # If only one symbol, convert Series to DataFrame
        if len(all_symbols) == 1:
            historical_data = pd.DataFrame(historical_data)
            historical_data.columns = [all_symbols[0]]
        
        # Get unique dates from the data
        dates = historical_data.index.strftime('%Y-%m-%d').tolist()
        
        # Calculate portfolio value for each date
        portfolio_values = []
        
        for date in historical_data.index:
            daily_value = 0
            
            for symbol in all_symbols:
                if symbol in historical_data.columns and not pd.isna(historical_data.loc[date, symbol]):
                    price = historical_data.loc[date, symbol]
                    shares = symbol_to_shares[symbol]
                    daily_value += price * shares
            
            portfolio_values.append(float(daily_value))
        
        return {
            "dates": dates,
            "values": portfolio_values
        }
    except Exception as e:
        # Fallback to simulated data if there's an error
        print(f"Error generating trend data: {str(e)}")
        
        # Generate simulated data as fallback
        today = datetime.now()
        dates = [(today - timedelta(days=i)).strftime("%Y-%m-%d") for i in range(5)]
        dates.reverse()  # Oldest to newest
        
        # Calculate total portfolio value
        total_value = 0
        for strategy in strategies:
            for stock in portfolio[strategy]:
                total_value += stock["invest_amount"]
        
        # Generate random fluctuations for previous days
        values = []
        base_value = total_value * 0.95  # Start slightly lower than current value
        
        for i in range(len(dates) - 1):
            # Random fluctuation between -2% and +2%
            fluctuation = np.random.uniform(-0.02, 0.02)
            value = base_value * (1 + fluctuation)
            values.append(float(value))
            base_value = value
        
        # Add current value
        values.append(float(total_value))
        
        return {
            "dates": dates,
            "values": values
        }

@app.route('/api/portfolio_history/<portfolio_id>', methods=['GET'])
def get_portfolio_history(portfolio_id):
    if portfolio_id not in portfolio_history:
        return jsonify({"error": "Portfolio not found"}), 404
    
    return jsonify(portfolio_history[portfolio_id])

if __name__ == '__main__':
    app.run(debug=True, port=3000) 