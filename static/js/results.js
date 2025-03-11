// Main function to initialize the results page
document.addEventListener('DOMContentLoaded', function() {
    // Get query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const amount = urlParams.get('amount');
    const strategies = urlParams.getAll('strategy');
    
    // If no parameters, redirect to home page
    if (!amount || !strategies.length) {
        window.location.href = '/';
        return;
    }
    
    // Load portfolio data
    loadPortfolio(amount, strategies);
});

// Function to load portfolio data
function loadPortfolio(amount, strategies) {
    // Show loading indicator
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results-container').style.display = 'none';
    
    // Make API request to get portfolio data
    fetch('/api/portfolio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            amount: parseFloat(amount),
            strategies: strategies
        })
    })
    .then(response => response.json())
    .then(data => {
        // Hide loading indicator
        document.getElementById('loading').style.display = 'none';
        document.getElementById('results-container').style.display = 'block';
        
        // Update portfolio information
        document.getElementById('amount-display').textContent = `$ ${parseFloat(data.amount).toFixed(2)}`;
        document.getElementById('strategies-display').textContent = data.strategies.join(' & ');
        document.getElementById('portfolio-value').textContent = `$ ${parseFloat(data.total_invested).toFixed(2)}`;
        
        // Display portfolio results
        displayPortfolioResults(data.portfolio);
    })
    .catch(error => {
        console.error('Error loading portfolio:', error);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('results-container').innerHTML = `
            <div class="alert alert-danger" role="alert">
                Failed to load portfolio data. Please try again.
            </div>
            <div class="d-flex justify-content-center mt-4">
                <a href="/" class="btn btn-primary">Try Again</a>
            </div>
        `;
    });
}

// Function to display portfolio results
function displayPortfolioResults(portfolio) {
    const strategiesResults = document.getElementById('strategies-results');
    strategiesResults.innerHTML = '';
    
    // For each strategy
    for (const [strategy, stocks] of Object.entries(portfolio)) {
        const strategySection = document.createElement('div');
        strategySection.className = 'mb-5';
        
        strategySection.innerHTML = `
            <h2 class="mb-4">${strategy}</h2>
            <div class="row" id="${strategy.replace(/\s+/g, '')}-stocks"></div>
        `;
        
        strategiesResults.appendChild(strategySection);
        
        const stocksContainer = document.getElementById(`${strategy.replace(/\s+/g, '')}-stocks`);
        
        // For each stock in the strategy
        stocks.forEach(stock => {
            const stockCard = document.createElement('div');
            stockCard.className = 'col-md-4 mb-4';
            
            const changeClass = stock.percent_change >= 0 ? 'positive-change' : 'negative-change';
            const changeIcon = stock.percent_change >= 0 ? '▲' : '▼';
            
            stockCard.innerHTML = `
                <div class="stock-card">
                    <div class="stock-card-header">
                        <div>
                            <div class="stock-card-title">${stock.name}</div>
                            <div class="stock-card-symbol">${stock.symbol}</div>
                        </div>
                        <div class="stock-card-price">
                            ${stock.price.toFixed(2)} $
                        </div>
                    </div>
                    <div class="stock-card-change ${changeClass}">
                        ${changeIcon} ${Math.abs(stock.change).toFixed(2)} $ (${Math.abs(stock.percent_change).toFixed(2)} %)
                    </div>
                    <div class="stock-card-details">
                        <div class="stock-card-detail">
                            <div class="stock-card-detail-label">Invest Amount:</div>
                            <div class="stock-card-detail-value">${stock.invest_amount.toFixed(2)} $</div>
                        </div>
                    </div>
                </div>
            `;
            
            stocksContainer.appendChild(stockCard);
        });
    }
}