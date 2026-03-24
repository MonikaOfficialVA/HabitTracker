const habitList = document.getElementById('habitList');
const completedList = document.getElementById('completedList');
const completedCountEl = document.getElementById('completedCount');
const streakCountEl = document.getElementById('streakCount');

let habits = [];

// Load habits
if (localStorage.getItem('habits')) {
    habits = JSON.parse(localStorage.getItem('habits'));
    renderHabits();
}

// ADD HABIT
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

// COMPLETE HABIT
function completeHabit(id) {
    const habit = habits.find(h => h.id === id);
    const today = new Date().toISOString().split('T')[0];

    if (habit.lastCompletedDate === today) {
        alert("Already completed today!");
        return;
    }

    habit.completedDays += 1;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    habit.streak = (habit.lastCompletedDate === yesterdayStr) ? habit.streak + 1 : 1;
    habit.lastCompletedDate = today;

    saveHabits();
    renderHabits();
}

// REMOVE HABIT
function removeHabit(id) {
    if (confirm('Remove this habit?')) {
        habits = habits.filter(h => h.id !== id);
        saveHabits();
        renderHabits();
    }
}

// SAVE
function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// RENDER
function renderHabits() {
    habitList.innerHTML = '';
    completedList.innerHTML = '';

    let totalCompleted = 0;
    let maxStreak = 0;

    habits.forEach(habit => {
        totalCompleted += habit.completedDays;
        if (habit.streak > maxStreak) maxStreak = habit.streak;

        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${habit.name}</strong> - Started: ${habit.startDate} - Goal: ${habit.daysGoal} days<br>
            ${habit.desc ? habit.desc + '<br>' : ''}
            Completed Days: ${habit.completedDays} - Current Streak: ${habit.streak}
            <button onclick="completeHabit(${habit.id})">✅ Mark Today</button>
            <button onclick="removeHabit(${habit.id})">🗑️ Remove</button>
        `;
        habitList.appendChild(li);

        // Add to completed list if completedDays >= goal
        if (habit.completedDays >= habit.daysGoal) {
            const cLi = document.createElement('li');
            cLi.textContent = habit.name;
            completedList.appendChild(cLi);
        }
    });

    completedCountEl.textContent = totalCompleted;
    streakCountEl.textContent = maxStreak;
}

// HAMBURGER MENU
const sidebar = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');

hamburger.addEventListener('click', () => {
    if (sidebar.style.width === '250px') {
        sidebar.style.width = '0';
        document.querySelector('.main').style.marginLeft = '0';
    } else {
        sidebar.style.width = '250px';
        document.querySelector('.main').style.marginLeft = '250px';
    }
});

// THEME TOGGLE
const themeToggle = document.getElementById('themeToggle');
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️ Light Mode';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
        themeToggle.textContent = '☀️ Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.textContent = '🌙 Dark Mode';
        localStorage.setItem('theme', 'light');
    }
});
