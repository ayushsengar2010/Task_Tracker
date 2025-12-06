const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 200
  },
  description: { 
    type: String,
    trim: true,
    maxlength: 1000,
    default: ''
  },
  dueDate: { 
    type: Date,
    default: null
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium'
  },
  status: { 
    type: String, 
    enum: ['todo', 'in-progress', 'done'], 
    default: 'todo'
  },
  completedAt: {
    type: Date,
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  subtasks: [{
    title: String,
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Index for faster queries
TaskSchema.index({ user: 1, status: 1 });
TaskSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Task', TaskSchema);