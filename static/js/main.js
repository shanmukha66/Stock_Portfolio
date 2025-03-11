document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    let currentStep = 0;
    const steps = document.querySelectorAll('.step');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const form = document.getElementById('portfolioForm');
    const amountInput = document.getElementById('amount');
    const strategiesContainer = document.getElementById('strategies-container');
    const summaryDiv = document.getElementById('summary');
    
    // Load investment strategies
    loadStrategies();
    
    // Load market overview data
    loadMarketOverview();
    
    // Load stock ticker
    loadStockTicker();
    
    // Event listeners for navigation buttons
    prevBtn.addEventListener('click', function() {
        if (currentStep > 0) {
            goToStep(currentStep - 1);
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (currentStep < steps.length - 1) {
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1);
            }
        } else {
            // Submit form
            submitForm();
        }
    });
    
    // Function to go to a specific step
    function goToStep(stepIndex) {
        // Update current step
        steps[currentStep].classList.remove('active');
        steps[stepIndex].classList.add('active');
        currentStep = stepIndex;
        
        // Update button states
        prevBtn.disabled = currentStep === 0;
        nextBtn.textContent = currentStep === steps.length - 1 ? 'Submit' : 'Next';
        
        // If we're on the confirmation step, update the summary
        if (currentStep === 2) {
            updateSummary();
        }
    }
    
    // Function to validate the current step
    function validateStep(stepIndex) {
        if (stepIndex === 0) {
            // Validate investment amount
            const amount = parseFloat(amountInput.value);
            if (isNaN(amount) || amount < 5000) {
                alert('Please enter an investment amount of at least $5000.');
                return false;
            }
            return true;
        } else if (stepIndex === 1) {
            // Validate strategy selection
            const selectedStrategies = document.querySelectorAll('input[name="strategy"]:checked');
            if (selectedStrategies.length === 0 || selectedStrategies.length > 2) {
                alert('Please select one or two investment strategies.');
                return false;
            }
            return true;
        }
        return true;
    }
    
    // Function to load investment strategies
    function loadStrategies() {
        fetch('/api/strategies')
            .then(response => response.json())
            .then(strategies => {
                strategiesContainer.innerHTML = '';
                strategies.forEach(strategy => {
                    const strategyOption = document.createElement('div');
                    strategyOption.className = 'strategy-option';
                    strategyOption.innerHTML = `
                        <input type="checkbox" id="${strategy.replace(/\s+/g, '')}" name="strategy" value="${strategy}">
                        <label for="${strategy.replace(/\s+/g, '')}">${strategy}</label>
                    `;
                    strategiesContainer.appendChild(strategyOption);
                    
                    // Add click event to the entire div
                    strategyOption.addEventListener('click', function(e) {
                        const checkbox = this.querySelector('input[type="checkbox"]');
                        const selectedCount = document.querySelectorAll('input[name="strategy"]:checked').length;
                        
                        // If clicking on the checkbox itself, don't toggle
                        if (e.target !== checkbox) {
                            // If already selected, unselect
                            if (checkbox.checked) {
                                checkbox.checked = false;
                                this.classList.remove('selected');
                            } else {
                                // If not selected and less than 2 are selected, select
                                if (selectedCount < 2) {
                                    checkbox.checked = true;
                                    this.classList.add('selected');
                                } else {
                                    alert('You can select at most 2 strategies.');
                                }
                            }
                        }
                        
                        // Update the selected class
                        if (checkbox.checked) {
                            this.classList.add('selected');
                        } else {
                            this.classList.remove('selected');
                        }
                    });
                    
                    // Add change event to the checkbox
                    const checkbox = strategyOption.querySelector('input[type="checkbox"]');
                    checkbox.addEventListener('change', function() {
                        if (this.checked) {
                            strategyOption.classList.add('selected');
                            
                            // If more than 2 are selected, uncheck the last one
                            const selectedCheckboxes = document.querySelectorAll('input[name="strategy"]:checked');
                            if (selectedCheckboxes.length > 2) {
                                selectedCheckboxes[0].checked = false;
                                selectedCheckboxes[0].closest('.strategy-option').classList.remove('selected');
                                alert('You can select at most 2 strategies.');
                            }
                        } else {
                            strategyOption.classList.remove('selected');
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Error loading strategies:', error);
                strategiesContainer.innerHTML = '<p class="text-danger">Error loading investment strategies. Please try again later.</p>';
            });
    }
    
    // Function to update the summary
    function updateSummary() {
        const amount = parseFloat(amountInput.value);
        const selectedStrategies = Array.from(document.querySelectorAll('input[name="strategy"]:checked')).map(input => input.value);
        
        summaryDiv.innerHTML = `
            <p><strong>Investment Amount:</strong> $${amount.toFixed(2)}</p>
            <p><strong>Selected Strategies:</strong> ${selectedStrategies.join(', ')}</p>
        `;
    }
    
    // Function to submit the form
    function submitForm() {
        const amount = parseFloat(amountInput.value);
        const selectedStrategies = Array.from(document.querySelectorAll('input[name="strategy"]:checked')).map(input => input.value);
        
        // Construct the URL with query parameters
        const queryParams = new URLSearchParams();
        queryParams.append('amount', amount);
        selectedStrategies.forEach(strategy => {
            queryParams.append('strategy', strategy);
        });
        
        // Redirect to results page
        window.location.href = `/results?${queryParams.toString()}`;
    }
    
    // Function to load market overview data
    function loadMarketOverview() {
        fetch('/api/market_overview')
            .then(response => response.json())
            .then(data => {
                // Update indices
                updateMarketSection('indices', data.indices);
                
                // Update commodities
                updateMarketSection('commodities', data.commodities);
                
                // Update bonds
                updateMarketSection('bonds', data.bonds);
                
                // Update forex
                updateMarketSection('forex', data.forex);
            })
            .catch(error => {
                console.error('Error loading market overview:', error);
                document.querySelectorAll('.market-data-container').forEach(container => {
                    container.innerHTML = '<p class="text-danger">Error loading market data. Please try again later.</p>';
                });
            });
    }
    
    // Function to update a market section
    function updateMarketSection(sectionId, data) {
        const container = document.getElementById(`${sectionId}-container`);
        container.innerHTML = '';
        
        if (!data || Object.keys(data).length === 0) {
            container.innerHTML = '<p class="text-muted">No data available.</p>';
            return;
        }
        
        for (const [name, info] of Object.entries(data)) {
            const marketItem = document.createElement('div');
            marketItem.className = 'market-item';
            
            const changeClass = info.percent_change >= 0 ? 'positive-change' : 'negative-change';
            const changeIcon = info.percent_change >= 0 ? '▲' : '▼';
            
            marketItem.innerHTML = `
                <div class="market-item-title">${name}</div>
                <div class="market-item-price">${info.price.toFixed(2)}</div>
                <div class="market-item-change ${changeClass}">
                    ${changeIcon} ${Math.abs(info.change).toFixed(2)} (${Math.abs(info.percent_change).toFixed(2)}%)
                </div>
            `;
            
            container.appendChild(marketItem);
        }
    }
    
    // Function to load stock ticker
    function loadStockTicker() {
        const tickerSymbols = [
            { symbol: 'AAPL', name: 'Apple' },
            { symbol: 'MSFT', name: 'Microsoft' },
            { symbol: 'GOOGL', name: 'Google' },
            { symbol: 'AMZN', name: 'Amazon' },
            { symbol: 'META', name: 'Facebook' },
            { symbol: 'TSLA', name: 'Tesla' },
            { symbol: 'NVDA', name: 'NVIDIA' },
            { symbol: 'JPM', name: 'JPMorgan' },
            { symbol: 'V', name: 'Visa' },
            { symbol: 'WMT', name: 'Walmart' }
        ];
        
        const tickerContainer = document.getElementById('stock-ticker');
        tickerContainer.innerHTML = '';
        
        // Create a duplicate set of ticker items for seamless looping
        const allSymbols = [...tickerSymbols, ...tickerSymbols];
        
        // Fetch current prices for all symbols
        const symbols = tickerSymbols.map(item => item.symbol);
        
        Promise.all(symbols.map(symbol => 
            fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d`)
                .then(response => response.json())
                .catch(error => ({ error }))
        ))
        .then(results => {
            results.forEach((result, index) => {
                if (!result.error && result.chart && result.chart.result) {
                    const price = result.chart.result[0].meta.regularMarketPrice;
                    const previousClose = result.chart.result[0].meta.previousClose;
                    const change = price - previousClose;
                    const percentChange = (change / previousClose) * 100;
                    
                    tickerSymbols[index].price = price;
                    tickerSymbols[index].change = change;
                    tickerSymbols[index].percentChange = percentChange;
                }
            });
            
            // Create ticker items
            allSymbols.forEach(item => {
                if (item.price) {
                    const tickerItem = document.createElement('div');
                    tickerItem.className = 'ticker-item';
                    
                    const changeClass = item.change >= 0 ? 'positive-change' : 'negative-change';
                    const changeIcon = item.change >= 0 ? '▲' : '▼';
                    
                    tickerItem.innerHTML = `
                        <span class="ticker-symbol">${item.symbol}</span>
                        <span class="ticker-price">${item.price.toFixed(2)}</span>
                        <span class="ticker-change ${changeClass}">
                            ${changeIcon} ${Math.abs(item.change).toFixed(2)} (${Math.abs(item.percentChange).toFixed(2)}%)
                        </span>
                    `;
                    
                    tickerContainer.appendChild(tickerItem);
                }
            });
        })
        .catch(error => {
            console.error('Error loading ticker data:', error);
            tickerContainer.innerHTML = '<div class="ticker-item">Error loading ticker data</div>';
        });
    }
}); 