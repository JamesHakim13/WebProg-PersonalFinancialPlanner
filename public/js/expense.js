document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("add-expense-form");
  const expenseList = document.getElementById("expense-list");
  const chartCanvas = document.getElementById("weekly-expense-chart");
  const categoryFilter = document.getElementById("category-filter");
  const toggleChartBtn = document.getElementById("toggle-chart");
  const chartSection = document.getElementById("expense-chart-section");

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const categoryColors = {
    Food: "#2b6777",
    Transport: "#ffaf40",
    Shopping: "#ff6b6b",
    Bills: "#9b59b6",
    Others: "#7f8c8d"
  };

  //let expenses = [];
  let expenses = [
    { date: new Date("2025-05-05"), category: "Food", amount: 12.50 },    // Monday
    { date: new Date("2025-05-05"), category: "Transport", amount: 8.00 },
    { date: new Date("2025-05-06"), category: "Food", amount: 15.00 },    // Tuesday
    { date: new Date("2025-05-06"), category: "Shopping", amount: 25.00 },
    { date: new Date("2025-05-07"), category: "Bills", amount: 45.00 },   // Wednesday
    { date: new Date("2025-05-07"), category: "Food", amount: 10.00 },
    { date: new Date("2025-05-08"), category: "Transport", amount: 6.00 },// Thursday
    { date: new Date("2025-05-08"), category: "Others", amount: 5.50 },
    { date: new Date("2025-05-09"), category: "Food", amount: 13.20 },    // Friday
    { date: new Date("2025-05-10"), category: "Shopping", amount: 40.00 },// Saturday
    { date: new Date("2025-05-11"), category: "Food", amount: 20.00 },    // Sunday
    { date: new Date("2025-05-11"), category: "Bills", amount: 50.00 }
  ];
  
  let chart;
  renderExpenseList();
  updateChart();
  
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const date = new Date(document.getElementById("expense-date").value);
    const category = document.getElementById("expense-category").value;
    const amount = parseFloat(document.getElementById("expense-amount").value);

    if (!date || !category || isNaN(amount)) {
      return;
    }
    alert(date + " " + category + " " + amount);

    expenses.push({ date, category, amount });
    renderExpenseList();
    updateChart();
    form.reset();
  });

  function renderExpenseList() {
    expenseList.innerHTML = "";
    expenses.forEach((expense, index) => {
      const day = weekdays[expense.date.getDay() === 0 ? 6 : expense.date.getDay() - 1];
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${expense.date.toISOString().split('T')[0]} | ${day} | ${expense.category}: $${expense.amount.toFixed(2)}</span>
        <button class="remove-btn" data-index="${index}">Remove</button>
      `;
      expenseList.appendChild(li);
    });

    document.querySelectorAll(".remove-btn").forEach((btn) =>
      btn.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        expenses.splice(index, 1);
        renderExpenseList();
        updateChart();
      })
    );
  }

  function updateChart() {
    const selectedCategory = categoryFilter.value;
    const categories = Object.keys(categoryColors);
    const dataPerCategory = {};

    // Initialize totals
    categories.forEach((cat) => {
      dataPerCategory[cat] = [0, 0, 0, 0, 0, 0, 0];
    });

    // Fill in data
    expenses.forEach((expense) => {
      if (selectedCategory !== "All" && expense.category !== selectedCategory) return;
      const dayIndex = expense.date.getDay() === 0 ? 6 : expense.date.getDay() - 1;
      dataPerCategory[expense.category][dayIndex] += expense.amount;
    });

    // Convert to Chart.js datasets
    const datasets = categories
      .filter(cat => selectedCategory === "All" || cat === selectedCategory)
      .map((cat) => ({
        label: cat,
        data: dataPerCategory[cat],
        backgroundColor: categoryColors[cat],
        stack: "expenses"
      }));

    if (chart) chart.destroy();

    chart = new Chart(chartCanvas, {
      type: "bar",
      data: {
        labels: weekdays,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: { mode: 'index', intersect: false },
          title: {
            display: true,
            text: `Expenses Breakdown (${selectedCategory})`
          }
        },
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


  categoryFilter.addEventListener("change", updateChart);

  toggleChartBtn.addEventListener("click", function () {
    const isVisible = chartSection.style.display !== "none";
    chartSection.style.display = isVisible ? "none" : "block";
    toggleChartBtn.textContent = isVisible ? "Show Chart" : "Hide Chart";
  });
});
