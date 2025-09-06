const mongoose = require('mongoose');

const archivedRunSchema = new mongoose.Schema({
  runAt: { type: Date, default: Date.now },
  dayKey: { type: String },
  tasks: [{
    serial: Number,
    name: String,
    time: String,
    completed: Boolean,
    completedAt: Date
  }]
}, { timestamps: true });

module.exports = mongoose.model('ArchivedRun', archivedRunSchema);
