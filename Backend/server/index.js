const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const Task = require('./models/Task');
const auth = require('./middleware/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✓ MongoDB Connected'))
  .catch(err => {
    console.error('✗ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Validation Helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ msg: 'Internal Server Error', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

// --- AUTH ROUTES ---

// Register User
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ msg: 'Please provide a valid email address' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
  }

  try {
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) return res.status(400).json({ msg: 'User already exists with this email' });

    user = new User({ 
      email: email.toLowerCase(), 
      password 
    });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    
    await user.save();

    // Create Token
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.status(201).json({ token, msg: 'Registration successful' });
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ msg: 'Server error during registration' });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    let user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ msg: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid email or password' });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, msg: 'Login successful' });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error during login' });
  }
});

// --- TASK ROUTES ---

// Get All Tasks (Protected)
app.get('/api/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, tasks, count: tasks.length });
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ msg: 'Error fetching tasks' });
  }
});

// Get Single Task
app.get('/api/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to view this task' });
    }

    res.json({ success: true, task });
  } catch (err) {
    console.error('Get task error:', err);
    res.status(500).json({ msg: 'Error fetching task' });
  }
});

// Create Task
app.post('/api/tasks', auth, async (req, res) => {
  const { title, description, priority, status, dueDate } = req.body;

  // Validation
  if (!title || title.trim() === '') {
    return res.status(400).json({ msg: 'Task title is required' });
  }

  if (title.length > 200) {
    return res.status(400).json({ msg: 'Task title cannot exceed 200 characters' });
  }

  if (description && description.length > 1000) {
    return res.status(400).json({ msg: 'Task description cannot exceed 1000 characters' });
  }

  const validPriorities = ['low', 'medium', 'high'];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({ msg: 'Invalid priority level' });
  }

  const validStatuses = ['todo', 'in-progress', 'done'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ msg: 'Invalid status' });
  }

  try {
    const newTask = new Task({
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'medium',
      status: status || 'todo',
      dueDate: dueDate ? new Date(dueDate) : null,
      user: req.user.id
    });
    const task = await newTask.save();
    res.status(201).json({ success: true, task, msg: 'Task created successfully' });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ msg: 'Error creating task' });
  }
});

// Update Task
app.put('/api/tasks/:id', auth, async (req, res) => {
  const { title, description, priority, status, dueDate } = req.body;

  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Authorization check
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to update this task' });
    }

    // Validation for updates
    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ msg: 'Task title cannot be empty' });
    }

    if (title && title.length > 200) {
      return res.status(400).json({ msg: 'Task title cannot exceed 200 characters' });
    }

    if (description && description.length > 1000) {
      return res.status(400).json({ msg: 'Task description cannot exceed 1000 characters' });
    }

    const validPriorities = ['low', 'medium', 'high'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ msg: 'Invalid priority level' });
    }

    const validStatuses = ['todo', 'in-progress', 'done'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    // Update fields
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (priority !== undefined) task.priority = priority;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;

    task = await task.save();
    res.json({ success: true, task, msg: 'Task updated successfully' });
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ msg: 'Error updating task' });
  }
});

// Delete Task
app.delete('/api/tasks/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: 'Task not found' });

    // Authorization check
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true, msg: 'Task deleted successfully' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ msg: 'Error deleting task' });
  }
});

// Get Task Statistics
app.get('/api/tasks/stats/summary', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      done: tasks.filter(t => t.status === 'done').length,
      highPriority: tasks.filter(t => t.priority === 'high').length
    };
    res.json({ success: true, stats });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ msg: 'Error fetching statistics' });
  }
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  POST   /api/auth/register`);
  console.log(`  POST   /api/auth/login`);
  console.log(`  GET    /api/tasks`);
  console.log(`  POST   /api/tasks`);
  console.log(`  GET    /api/tasks/:id`);
  console.log(`  PUT    /api/tasks/:id`);
  console.log(`  DELETE /api/tasks/:id`);
  console.log(`  GET    /api/tasks/stats/summary\n`);
});