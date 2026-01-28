const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'student-task-manager', 'public')));

const tasksFilePath = path.join(__dirname, 'tasks.json');

function readTasks() {
  try {
    const data = fs.readFileSync(tasksFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeTasks(tasks) {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8');
}

app.get('/tasks', (req, res) => {
  try {
    const tasks = readTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read tasks' });
  }
});

app.post('/tasks', (req, res) => {
  try {
    const { task } = req.body;

    if (!task || task.trim() === '') {
      return res.status(400).json({ error: 'Task cannot be empty' });
    }

    const tasks = readTasks();
    const newTask = {
      id: Date.now().toString(),
      task: task.trim(),
      createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});