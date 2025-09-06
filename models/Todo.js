const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  serial: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  time: { type: String },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);
