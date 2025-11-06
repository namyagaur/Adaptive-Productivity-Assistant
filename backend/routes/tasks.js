const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Task = require('../models/Task');

// ✅ Create new task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    const task = new Task({ 
      user: req.user.userId, 
      title, 
      description, 
      priority, 
      dueDate 
    });
    await task.save();
    res.json({ message: 'Task created successfully ✅', task });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get all tasks for user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Update a task
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { title, description, completed, priority, dueDate },
      { new: true }
    );
    res.json({ message: 'Task updated ✅', task });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted 🗑' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
