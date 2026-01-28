const API_URL = 'http://localhost:3000';

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks`);
        
        if (!response.ok) {
            throw new Error('Failed to load tasks');
        }

        const tasks = await response.json();
        displayTasks(tasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
        showError('Failed to load tasks. Please refresh the page.');
    }
}

async function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Please enter a task');
        return;
    }

    addTaskBtn.disabled = true;
    addTaskBtn.textContent = 'Adding...';

    try {
        const response = await fetch(`${API_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task: taskText }),
        });

        if (!response.ok) {
            throw new Error('Failed to add task');
        }

        taskInput.value = '';
        loadTasks();
    } catch (error) {
        console.error('Error adding task:', error);
        alert('Failed to add task. Please try again.');
    } finally {
        addTaskBtn.disabled = false;
        addTaskBtn.textContent = 'Add Task';
    }
}

function displayTasks(tasks) {
    tasksList.innerHTML = '';

    if (tasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }

    tasks.forEach((task) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.setAttribute('data-id', task.id);

        const taskText = document.createElement('div');
        taskText.className = 'task-text';
        taskText.textContent = task.task;

        taskItem.appendChild(taskText);
        tasksList.appendChild(taskItem);
    });
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'background: #f8d7da; color: #721c24; padding: 10px; border-radius: 5px; margin: 10px 0;';
    
    tasksList.insertBefore(errorDiv, tasksList.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}