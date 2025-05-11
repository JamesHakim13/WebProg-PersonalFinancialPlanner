// Market Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const currentDate = document.getElementById('current-date');
    const today = new Date();
    currentDate.textContent = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Initialize charts
    initMarketTrendChart();
    initSectorPerformanceChart();
    initRegionalPerformanceChart();
    
    // Initialize event listeners
    initEventListeners();
});

// Global variables for charts
let marketTrendChart;
let sectorPerformanceChart;
let regionalPerformanceChart;

// Sample data for charts
const marketData = {
    '1d': generateDailyMarketData(24), // 24 hours
    '7d': generateDailyMarketData(7),  // 7 days
    '1m': generateDailyMarketData(30), // 30 days
    '3m': generateDailyMarketData(90), // 90 days
    '6m': generateDailyMarketData(180), // 180 days
    '1y': generateDailyMarketData(365), // 365 days
    'ytd': generateDailyMarketData(Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000))), // Year to date
    'max': generateDailyMarketData(1825) // 5 years (approx)
};

// Sample data for sector performance
const sectorData = {
    'technology': 4.8,
    'healthcare': 2.7,
    'finance': -1.3,
    'energy': 3.5,
    'consumer': -0.8,
    'industrial': 1.9,
    'materials': 0.5,
    'utilities': -0.3,
    'real-estate': -1.7
};

// Sample data for regional performance
const regionData = {
    'north-america': 3.2,
    'europe': 1.7,
    'asia-pacific': 2.5,
    'latin-america': -0.8,
    'africa': 0.3,
    'middle-east': 1.2
};

// Initialize event listeners for filters and interactions
function initEventListeners() {
    // Apply filters button
    const applyFiltersBtn = document.getElementById('apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            applyFilters();
            });
        }
    }
    
    // Reset filters button
    const resetFiltersBtn = document.getElementById('reset-filters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            resetFilters();
        });
    }
    
    // Search button
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const keywordSearch = document.getElementById('keyword-search');
            if (keywordSearch) {
                applyFilters();
            }
        });
    }
    
    // Enter key in search box
    const keywordSearch = document.getElementById('keyword-search');
    if (keywordSearch) {
        keywordSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyFilters();
            }
        });
    }
    
    // Time range selector
    const timeRange = document.getElementById('time-range');
    if (timeRange) {
        timeRange.addEventListener('change', function() {
            updateChartTimeframe(timeRange.value);
        });
    }
    
    // Sector filter
    const sectorFilter = document.getElementById('sector-filter');
    if (sectorFilter) {
        sectorFilter.addEventListener('change', function() {
            // Auto-apply filter when sector is changed
            applyFilters();
        });
    }
    
    // Region filter
    const regionFilter = document.getElementById('region-filter');
    if (regionFilter) {
        regionFilter.addEventListener('change', function() {
            // Auto-apply filter when region is changed
            applyFilters();
        });
    }