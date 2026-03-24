// script.js

// Get elements
const habitList = document.getElementById('habitList');
const completedCountEl = document.getElementById('completedCount');
const streakCountEl = document.getElementById('streakCount');

let habits = [];

// Load habits from localStorage if any
if (localStorage.getItem('habits')) {
    habits = JSON.parse(localStorage.getItem('habits'));
    renderHabits();
}

// Function to add a new habit
function addHabit() {
    const name = document.getElementById('habitName').value.trim();
    const desc = document.getElementById('habitDesc').value.trim();
    const startDate = document.getElementById('habitStartDate').value;
    const daysGoal = parseInt(document.getElementById('habitDaysGoal').value);

    if (!name || !startDate || !daysGoal) {
        alert('Please fill in all required fields!');
        return;
    }

    const newHabit = {
        id: Date.now(),
        name,
        desc,
        startDate,
        daysGoal,
        completedDays: 0,
        streak: 0,
        lastCompletedDate: null
    };

    habits.push(newHabit);
    saveHabits();
    renderHabits();

    // Clear inputs
    document.getElementById('habitName').value = '';
    document.getElementById('habitDesc').value = '';
    document.getElementById('habitStartDate').value = '';
    document.getElementById('habitDaysGoal').value = '';
}

// Mark a habit day as completed
function completeHabit(id) {
    const habit = habits.find(h => h.id === id);
    const today = new Date().toISOString().split('T')[0];

    if (habit.lastCompletedDate === today) {
        alert("You've already completed this habit today!");
        return;
    }

    habit.completedDays += 1;

    // Update streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (habit.lastCompletedDate === yesterdayStr) {
        habit.streak += 1;
    } else {
        habit.streak = 1;
    }

    habit.lastCompletedDate = today;
    saveHabits();
    renderHabits();
}

// Remove a habit
function removeHabit(id) {
    if (confirm('Are you sure you want to remove this habit?')) {
        habits = habits.filter(h => h.id !== id);
        saveHabits();
        renderHabits();
    }
}

// Save habits to localStorage
function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// Render the habit list
function renderHabits() {
    habitList.innerHTML = '';
    let totalCompleted = 0;
    let maxStreak = 0;

    habits.forEach(habit => {
        totalCompleted += habit.completedDays;
        if (habit.streak > maxStreak) maxStreak = habit.streak;

        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${habit.name}</strong> - Started on: ${habit.startDate} - Goal: ${habit.daysGoal} days<br>
            ${habit.desc ? habit.desc + '<br>' : ''}
            Completed Days: ${habit.completedDays} - Current Streak: ${habit.streak} 
            <button onclick="completeHabit(${habit.id})">✅ Mark Today</button>
            <button onclick="removeHabit(${habit.id})">🗑️ Remove</button>
        `;
        habitList.appendChild(li);
    });

    completedCountEl.textContent = totalCompleted;
    streakCountEl.textContent = maxStreak;
}

// Theme toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    themeToggle.textContent = document.body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
});