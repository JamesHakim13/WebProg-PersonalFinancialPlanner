// Investment Calculator JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Charts
    const roiChartCtx = document.getElementById('roi-chart').getContext('2d');
    const compoundChartCtx = document.getElementById('compound-chart').getContext('2d');
    const comparisonChartCtx = document.getElementById('comparison-chart').getContext('2d');
    
    // Global variables for charts
    let roiChart, compoundChart, comparisonChart;
    
    // Initialize Charts
    initializeROIChart();
    initializeCompoundChart();
    initializeComparisonChart();
    
    // Event Listeners
    document.getElementById('enable-contributions').addEventListener('change', function() {
        document.getElementById('additional-contribution-container').classList.toggle('d-none', !this.checked);
    });
    
    document.getElementById('compound-time').addEventListener('input', function() {
        document.getElementById('compound-time-value').textContent = this.value + ' years';
    });
    
    document.getElementById('calculate-roi').addEventListener('click', calculateROI);
    document.getElementById('calculate-compound').addEventListener('click', calculateCompound);
    document.getElementById('compare-investments').addEventListener('click', compareInvestments);
    
    // ROI Chart Initialization
    function initializeROIChart() {
        roiChart = new Chart(roiChartCtx, {
            type: 'bar',
            data: {
                labels: ['Initial Investment', 'Final Value'],
                datasets: [
                    {
                        label: 'Principal',
                        backgroundColor: '#3a86ff',
                        data: [10000, 10000]
                    },
                    {
                        label: 'Interest',
                        backgroundColor: '#06d6a0',
                        data: [0, 4025.52]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Compound Chart Initialization
    function initializeCompoundChart() {
        // Sample data for initial display
        const years = Array.from({length: 11}, (_, i) => i);
        const balanceData = [10000, 12900, 15943, 19139.8, 22498.3, 26028.2, 29740.2, 33644.9, 37754.5, 42081.9, 46639.7];
        const principalData = [10000, 12400, 14800, 17200, 19600, 22000, 24400, 26800, 29200, 31600, 34000];
        
        compoundChart = new Chart(compoundChartCtx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Balance',
                        borderColor: '#3a86ff',
                        backgroundColor: 'rgba(58, 134, 255, 0.1)',
                        data: balanceData,
                        fill: true
                    },
                    {
                        label: 'Principal',
                        borderColor: '#adb5bd',
                        borderDash: [5, 5],
                        pointRadius: 0,
                        data: principalData,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Investment Value (RM)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    }
                }
            }
        });
        
        // Populate the initial table data
        populateCompoundTable(years, principalData, balanceData);
    }
    
    // Comparison Chart Initialization
    function initializeComparisonChart() {
        // Sample data for initial display
        const years = Array.from({length: 11}, (_, i) => i);
        const lowRiskData = [10000, 12587, 15260, 18024, 20882, 23837, 26892, 30051, 33318, 36695, 40187];
        const mediumRiskData = [10000, 12970, 16187, 19671, 23441, 27519, 31928, 36693, 41839, 47394, 53386];
        const highRiskData = [10000, 13200, 16720, 20592, 24851, 29536, 34689, 40358, 46594, 53453, 61000];
        
        comparisonChart = new Chart(comparisonChartCtx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Low Risk (3%)',
                        borderColor: '#adb5bd',
                        data: lowRiskData,
                        fill: false
                    },
                    {
                        label: 'Medium Risk (7%)',
                        borderColor: '#3a86ff',
                        data: mediumRiskData,
                        fill: false
                    },
                    {
                        label: 'High Risk (10%)',
                        borderColor: '#ef476f',
                        data: highRiskData,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Investment Value (RM)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    }
                }
            }
        });
        
        // Populate comparison table
        populateComparisonTable();
    }
    
    // ROI Calculator Logic
    function calculateROI() {
        const initialInvestment = parseFloat(document.getElementById('initial-investment').value) || 0;
        const rateOfReturn = parseFloat(document.getElementById('rate-of-return').value) || 0;
        const investmentPeriod = parseInt(document.getElementById('investment-period').value) || 0;
        const monthlyContribution = document.getElementById('enable-contributions').checked ? 
            (parseFloat(document.getElementById('additional-contribution').value) || 0) : 0;
        
        // Calculate future value
        let futureValue = initialInvestment;
        let totalContributions = initialInvestment;
        const monthlyRate = rateOfReturn / 100 / 12;
        
        // If there are monthly contributions
        if (monthlyContribution > 0) {
            // Formula for future value with regular contributions
            // FV = P(1+r)^n + PMT * ((1+r)^n - 1) / r
            // where r is monthly rate, n is total months
            const months = investmentPeriod * 12;
            futureValue = initialInvestment * Math.pow(1 + monthlyRate, months) + 
                        monthlyContribution * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
            totalContributions = initialInvestment + (monthlyContribution * months);
        } else {
            // Simple compound interest formula: FV = P(1+r)^n
            futureValue = initialInvestment * Math.pow(1 + (rateOfReturn / 100), investmentPeriod);
        }
        
        const totalInterest = futureValue - totalContributions;
        const roiPercentage = (totalInterest / totalContributions) * 100;
        
        // Update result elements
        document.getElementById('final-value').textContent = formatCurrency(futureValue);
        document.getElementById('total-interest').textContent = formatCurrency(totalInterest);
        document.getElementById('total-invested').textContent = formatCurrency(totalContributions);
        document.getElementById('roi-percentage').textContent = roiPercentage.toFixed(2) + '%';
        
        // Update the chart
        updateROIChart(initialInvestment, futureValue, totalInterest);
    }
    
    // Update ROI Chart
    function updateROIChart(initial, final, interest) {
        roiChart.data.datasets[0].data = [initial, initial];
        roiChart.data.datasets[1].data = [0, interest];
        roiChart.update();
    }
    
    // Compound Interest Calculator Logic
    function calculateCompound() {
        const principal = parseFloat(document.getElementById('compound-principal').value) || 0;
        const monthlyContribution = parseFloat(document.getElementById('compound-contribution').value) || 0;
        const annualRate = parseFloat(document.getElementById('compound-rate').value) || 0;
        const years = parseInt(document.getElementById('compound-time').value) || 0;
        const compoundFrequency = parseInt(document.getElementById('compound-frequency').value) || 1;
        
        // Calculate compound interest with periodic contributions
        const periodicRate = annualRate / 100 / compoundFrequency;
        const totalPeriods = years * compoundFrequency;
        const contributionsPerPeriod = monthlyContribution * (12 / compoundFrequency);
        
        // Arrays to store yearly data
        const yearLabels = Array.from({length: years + 1}, (_, i) => i);
        const balanceData = new Array(years + 1);
        const principalData = new Array(years + 1);
        
        // Calculate balance for each year
        balanceData[0] = principal;
        principalData[0] = principal;
        
        let balance = principal;
        let totalContributions = principal;
        
        for (let period = 1; period <= totalPeriods; period++) {
            // Add contribution
            balance += contributionsPerPeriod;
            totalContributions += contributionsPerPeriod;
            
            // Apply interest
            balance *= (1 + periodicRate);
            
            // Store yearly data
            if (period % compoundFrequency === 0) {
                const year = period / compoundFrequency;
                balanceData[year] = balance;
                principalData[year] = totalContributions;
            }
        }
        
        // Update results
        const futureValue = balanceData[years];
        const totalInterest = futureValue - totalContributions;
        
        document.getElementById('compound-future-value').textContent = formatCurrency(futureValue);
        document.getElementById('compound-total-contributions').textContent = formatCurrency(totalContributions);
        document.getElementById('compound-total-interest').textContent = formatCurrency(totalInterest);
        
        // Update chart
        updateCompoundChart(yearLabels, balanceData, principalData);
        
        // Update table
        populateCompoundTable(yearLabels, principalData, balanceData);
    }
    
    // Update Compound Chart
    function updateCompoundChart(years, balanceData, principalData) {
        compoundChart.data.labels = years;
        compoundChart.data.datasets[0].data = balanceData;
        compoundChart.data.datasets[1].data = principalData;
        compoundChart.update();
    }
    
    // Populate Compound Interest Table
    function populateCompoundTable(years, principalData, balanceData) {
        const tableBody = document.getElementById('compound-table-body');
        tableBody.innerHTML = '';
        
        for (let i = 0; i < years.length; i++) {
            // Calculate yearly contributions and interest
            const yearContributions = i === 0 ? principalData[i] : (principalData[i] - principalData[i-1]);
            const yearInterest = i === 0 ? 0 : (balanceData[i] - balanceData[i-1] - yearContributions);
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${years[i]}</td>
                <td>${formatCurrency(i === 0 ? principalData[i] : principalData[i-1])}</td>
                <td>${formatCurrency(yearContributions)}</td>
                <td>${formatCurrency(yearInterest)}</td>
                <td>${formatCurrency(balanceData[i])}</td>
            `;
            tableBody.appendChild(row);
        }
    }
    
    // Investment Comparison Logic
    function compareInvestments() {
        const initialAmount = parseFloat(document.getElementById('comparison-amount').value) || 0;
        const monthlyContribution = parseFloat(document.getElementById('comparison-monthly').value) || 0;
        const years = parseInt(document.getElementById('comparison-years').value) || 0;
        
        // Define investment options to compare
        const investmentOptions = [
            { name: 'Savings Account', annualReturn: 0.5 },
            { name: 'Fixed Deposit', annualReturn: 2 },
            { name: 'Low Risk Portfolio', annualReturn: 3 },
            { name: 'Moderate Risk Portfolio', annualReturn: 7 },
            { name: 'High Risk Portfolio', annualReturn: 10 },
            { name: 'Aggressive Growth', annualReturn: 12 }
        ];
        
        // Calculate results for each option
        const results = investmentOptions.map(option => {
            return calculateInvestmentGrowth(
                initialAmount, 
                monthlyContribution, 
                option.annualReturn, 
                years,
                option.name
            );
        });
        
        // Update chart with comparison data
        updateComparisonChart(results, years);
        
        // Update comparison table
        populateComparisonTable(results);
        
        // Update summary
        updateComparisonSummary(results);
    }
    
    // Calculate Investment Growth for Comparison
    function calculateInvestmentGrowth(initial, monthly, rate, years, name) {
        const monthlyRate = rate / 100 / 12;
        const months = years * 12;
        const totalContributions = initial + (monthly * months);
        
        // Calculate future value with monthly compounding
        let futureValue = initial;
        
        if (monthly > 0) {
            futureValue = initial * Math.pow(1 + monthlyRate, months) + 
                        monthly * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
        } else {
            futureValue = initial * Math.pow(1 + monthlyRate, months);
        }
        
        const totalInterest = futureValue - totalContributions;
        const roi = (totalInterest / totalContributions) * 100;
        
        // Calculate yearly growth for chart
        const yearlyData = new Array(years + 1);
        yearlyData[0] = initial;
        
        let balance = initial;
        for (let year = 1; year <= years; year++) {
            balance = balance * Math.pow(1 + monthlyRate, 12) + monthly * ((Math.pow(1 + monthlyRate, 12) - 1) / monthlyRate);
            yearlyData[year] = balance;
        }
        
        return {
            name: name,
            annualReturn: rate,
            futureValue: futureValue,
            totalContributions: totalContributions,
            totalInterest: totalInterest,
            roi: roi,
            yearlyData: yearlyData
        };
    }
    
    // Update Comparison Chart
    function updateComparisonChart(results, years) {
        // Create year labels
        const yearLabels = Array.from({length: years + 1}, (_, i) => i);
        
        // Update chart datasets
        comparisonChart.data.labels = yearLabels;
        comparisonChart.data.datasets = results.map((result, index) => {
            // Choose colors based on risk level
            const colors = ['#adb5bd', '#20c997', '#8338ec', '#3a86ff', '#ff006e', '#ef476f'];
            
            return {
                label: `${result.name} (${result.annualReturn}%)`,
                borderColor: colors[index],
                data: result.yearlyData,
                fill: false
            };
        });
        
        comparisonChart.update();
    }
    
    // Populate Comparison Table
    function populateComparisonTable(results) {
        const tableBody = document.getElementById('comparison-table-body');
        
        if (!results) {
            // Sample data for initial display
            tableBody.innerHTML = `
                <tr>
                    <td>Savings Account</td>
                    <td>0.5%</td>
                    <td>RM 34,450.00</td>
                    <td>RM 34,000.00</td>
                    <td>RM 450.00</td>
                    <td>1.32%</td>
                </tr>
                <tr>
                    <td>Fixed Deposit</td>
                    <td>2%</td>
                    <td>RM 38,270.00</td>
                    <td>RM 34,000.00</td>
                    <td>RM 4,270.00</td>
                    <td>12.56%</td>
                </tr>
                <tr class="table-primary">
                    <td>Low Risk Portfolio</td>
                    <td>3%</td>
                    <td>RM 40,187.00</td>
                    <td>RM 34,000.00</td>
                    <td>RM 6,187.00</td>
                    <td>18.20%</td>
                </tr>
                <tr>
                    <td>Moderate Risk Portfolio</td>
                    <td>7%</td>
                    <td>RM 53,386.00</td>
                    <td>RM 34,000.00</td>
                    <td>RM 19,386.00</td>
                    <td>57.02%</td>
                </tr>
                <tr>
                    <td>High Risk Portfolio</td>
                    <td>10%</td>
                    <td>RM 61,000.00</td>
                    <td>RM 34,000.00</td>
                    <td>RM 27,000.00</td>
                    <td>79.41%</td>
                </tr>
            `;
            return;
        }
        
        // Clear the table
        tableBody.innerHTML = '';
        
        // Find the best option (highest future value)
        const bestOption = results.reduce((prev, current) => 
            (prev.futureValue > current.futureValue) ? prev : current);
        
        // Add rows for each investment option
        results.forEach(result => {
            const row = document.createElement('tr');
            
            // Highlight the best option
            if (result.name === bestOption.name) {
                row.classList.add('table-primary');
            }
            
            row.innerHTML = `
                <td>${result.name}</td>
                <td>${result.annualReturn}%</td>
                <td>${formatCurrency(result.futureValue)}</td>
                <td>${formatCurrency(result.totalContributions)}</td>
                <td>${formatCurrency(result.totalInterest)}</td>
                <td>${result.roi.toFixed(2)}%</td>
            `;
            
            tableBody.appendChild(row);
        });
    }
    
    // Update Comparison Summary
    function updateComparisonSummary(results) {
        const summaryContainer = document.getElementById('comparison-summary');
        
        if (!results) {
            return;
        }
        
        // Find the best option (highest future value)
        const bestOption = results.reduce((prev, current) => 
            (prev.futureValue > current.futureValue) ? prev : current);
        
        // Calculate how much more the best option earns compared to the lowest option
        const lowestOption = results.reduce((prev, current) => 
            (prev.futureValue < current.futureValue) ? prev : current);
        
        const difference = bestOption.futureValue - lowestOption.futureValue;
        const percentageDifference = ((bestOption.futureValue / lowestOption.futureValue) - 1) * 100;
        
        // Update the summary
        summaryContainer.innerHTML = `
            <div class="alert alert-success" role="alert">
                <h6 class="alert-heading"><i class="fa-solid fa-trophy me-2"></i>Best Option</h6>
                <p class="mb-0"><strong>${bestOption.name}</strong> with ${bestOption.annualReturn}% annual return provides the highest future value of ${formatCurrency(bestOption.futureValue)}.</p>
            </div>
            
            <div class="mb-3">
                <p class="mb-2">By choosing the <strong>${bestOption.name}</strong> instead of <strong>${lowestOption.name}</strong>, you could earn:</p>
                <h5 class="text-success">${formatCurrency(difference)} more (${percentageDifference.toFixed(1)}% increase)</h5>
            </div>
            
            <div class="alert alert-warning" role="alert">
                <i class="fa-solid fa-circle-info me-2"></i>
                Remember that higher returns generally come with higher risk. Consider your risk tolerance and investment time horizon when choosing.
            </div>
        `;
    }
    
    // Helper function to format currency
    function formatCurrency(value) {
    return '<i class="fa-solid fa-circle-info me-2"></i>RM ' + 
           value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
});