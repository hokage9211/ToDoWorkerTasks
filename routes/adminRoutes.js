const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const auth = require('../middleware/auth');

// Reset todos via API (used by seed if desired)
router.post('/reset-todos', auth, async (req, res) => {
  const { todos } = req.body;
  if (!Array.isArray(todos)) return res.status(400).json({ error: 'todos array required' });
  await Todo.deleteMany({});
  const docs = todos.map(t => ({ serial: t.serial, name: t.name, time: t.time }));
  await Todo.insertMany(docs);
  return res.json({ inserted: docs.length });
});

module.exports = router;
