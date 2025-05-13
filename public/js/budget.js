document.addEventListener('DOMContentLoaded', function() {    
    // Initialize charts
    initBudgetDistributionChart();
    // Add event listeners
    initEventListeners();
});
/**
 * Initialize the budget distribution doughnut chart
 */
function initBudgetDistributionChart() {
    const budgetDistributionCtx = document.getElementById('budgetDistributionChart').getContext('2d');
    const budgetDistributionChart = new Chart(budgetDistributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Housing', 'Food', 'Transportation', 'Healthcare', 'Shopping'],
            datasets: [{
                data: [1500, 800, 400, 300, 400],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: RM${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}
/**
 * Initialize event listeners for interactive elements
 */
function initEventListeners() {
    // Add event listener for save category button
    document.getElementById('saveCategoryBtn').addEventListener('click', function() {
        const form = document.getElementById('addCategoryForm');
        if (form.checkValidity()) {
            // Get form values
            const categoryName = document.getElementById('categoryName').value;
            const categoryIcon = document.getElementById('categoryIcon').value || 'fa-folder'; // Default icon if none selected
            const categoryAmount = document.getElementById('budgetAmount').value;
            
            // Create category object
            const newCategory = {
                name: categoryName,
                icon: categoryIcon,
                amount: categoryAmount
            };
            
            // Add the category to the table
            addCategoryToTable(newCategory);
            
            // Update the budget distribution chart
            updateBudgetDistributionWithNewCategory(newCategory);
            
            // Close the modal - Fixed approach
            const modalElement = document.getElementById('addCategoryModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();
            
            // Reset the form
            form.reset();
            
            // Show success message
            alert('Category added successfully!');
        } else {
            form.reportValidity();
        }
    });
    
    // Add event listeners for edit and delete buttons
    setupCategoryActions();
}
/**
 * Set up event listeners for category actions (edit, delete)
 */
function setupCategoryActions() {
    // Edit buttons
    const editButtons = document.querySelectorAll('.btn-outline-primary');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const categoryName = row.querySelector('td:first-child').textContent.trim();
            // Open edit form or modal with category data
            alert(`Edit category: ${categoryName}`);
            // In a real app, you would populate a form with the category data
        });
    });
    
    // Delete buttons
    const deleteButtons = document.querySelectorAll('.btn-outline-danger');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const categoryName = row.querySelector('td:first-child').textContent.trim();
            if (confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
                // Delete the category
                // In a real app, you would call an API to delete the category
                row.remove();
                
                // Update the budget distribution chart
                updateBudgetDistributionChart(categoryName);
                
                alert(`Category "${categoryName}" has been deleted.`);
            }
        });
    });
}

/**
 * Update the budget distribution chart after a category is deleted
 * @param {string} deletedCategory - The name of the deleted category
 */
function updateBudgetDistributionChart(deletedCategory) {
    // Get the chart instance
    const chart = Chart.getChart('budgetDistributionChart');
    
    if (chart) {
        // Find the index of the deleted category
        const index = chart.data.labels.findIndex(label => 
            label === deletedCategory || label.includes(deletedCategory));
        
        if (index !== -1) {
            // Remove the category from the chart data
            chart.data.labels.splice(index, 1);
            chart.data.datasets[0].data.splice(index, 1);
            chart.data.datasets[0].backgroundColor.splice(index, 1);
            chart.data.datasets[0].borderColor.splice(index, 1);
            
            // Update the chart
            chart.update();
        }
    }
}
/**
 * Add a new budget category to the table
 * @param {Object} category - The category object with name, icon, amount properties
 */
function addCategoryToTable(category) {
    const table = document.querySelector('.table tbody');
    const newRow = document.createElement('tr');
    
    // Calculate values based on spending (assumed zero for new categories)
    const allocated = parseFloat(category.amount);
    const spent = 0;
    const remaining = allocated;
    const progress = 100; // 100% remaining
    
    newRow.innerHTML = `
        <td><i class="fas ${category.icon} me-2 category-icon"></i> ${category.name}</td>
        <td>RM${allocated.toFixed(2)}</td>
        <td>RM${spent.toFixed(2)}</td>
        <td>RM${remaining.toFixed(2)}</td>
        <td>
            <div class="progress">
                <div class="progress-bar bg-success" role="progressbar" style="width: ${progress}%;" 
                    aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        </td>
        <td>
            <button class="btn btn-sm btn-outline-primary me-1"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
        </td>
    `;
    
    table.appendChild(newRow);
    // Update event listeners for the new buttons
    setupCategoryActions();
    // In a real app, you would also update the charts
    // updateCharts();
}
/**
 * Update the budget distribution chart after a new category is added
 * @param {Object} newCategory - The newly added category
 */
function updateBudgetDistributionWithNewCategory(newCategory) {
    // Get the chart instance
    const chart = Chart.getChart('budgetDistributionChart');
    
    if (chart) {
        // Add the new category to the chart data
        chart.data.labels.push(newCategory.name);
        chart.data.datasets[0].data.push(parseFloat(newCategory.amount));
        
        // Generate a random color for the new category
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        
        chart.data.datasets[0].backgroundColor.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
        chart.data.datasets[0].borderColor.push(`rgba(${r}, ${g}, ${b}, 1)`);
        
        // Update the chart
        chart.update();
    }
}

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
    initBudgetDistributionChart();
    // Add event listeners
    initEventListeners();
});