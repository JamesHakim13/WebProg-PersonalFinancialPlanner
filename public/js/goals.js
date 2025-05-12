document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('add-goal-form');
    const tableBody = document.querySelector('#goal-table tbody');
    let goals = [];

    // Load existing goals from localStorage if available
    if (localStorage.getItem('goals')) {
        goals = JSON.parse(localStorage.getItem('goals'));
        renderGoals();
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const goalName = document.getElementById('goalName').value.trim();
        const amount = document.getElementById('amount').value.trim();
        const deadline = document.getElementById('deadline').value.trim();
        const priority = document.getElementById('priority').value;

        if (!goalName || !amount || !deadline) return;

        const newGoal = {
            id: Date.now(), // unique ID
            goalName,
            amount,
            deadline,
            priority
        };

        goals.push(newGoal);
        localStorage.setItem('goals', JSON.stringify(goals));
        renderGoals();

        // Clear form
        form.reset();
    });

    function renderGoals() {
        tableBody.innerHTML = '';

        goals.forEach(goal => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${goal.goalName}</td>
                <td>${goal.amount}</td>
                <td>${goal.deadline}</td>
                <td>${goal.priority}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteGoal(${goal.id})">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Make deleteGoal globally accessible
    window.deleteGoal = function (id) {
        const confirmed = confirm('Are you sure you want to delete this goal?');

        if (confirmed) {
            goals = goals.filter(goal => goal.id !== id);
            localStorage.setItem('goals', JSON.stringify(goals));
            renderGoals();
        }
    };
});