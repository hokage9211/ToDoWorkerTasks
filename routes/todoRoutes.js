// const express = require('express');
// const router = express.Router();
// const Todo = require('../models/Todo');
// const ArchivedRun = require('../models/ArchivedRun');
// const auth = require('../middleware/auth');

// // helper: enforce client-side timeout on server
// function enforceClientTimeout(req, res, next) {
//   const started = req.headers['x-client-started-at'];
//   const clientTimeoutMs = parseInt(process.env.CLIENT_TIMEOUT_MS || '4000', 10);
//   if (!started) return res.status(400).json({ error: 'Missing X-Client-Started-At header' });
//   const startedAt = parseInt(started, 10);
//   if (Number.isNaN(startedAt)) return res.status(400).json({ error: 'Bad X-Client-Started-At header' });
//   const now = Date.now();
//   if ((now - startedAt) > clientTimeoutMs) {
//     return res.status(408).json({ error: 'Client timeout exceeded' });
//   }
//   next();
// }

// // get todos
// router.get('/', auth, async (req, res) => {
//   const todos = await Todo.find({}).sort({ serial: 1 }).lean();
//   res.json(todos);
// });

// // complete todo (idempotent)
// router.patch('/:serial/complete', auth, enforceClientTimeout, async (req, res) => {
//   const serial = parseInt(req.params.serial, 10);
//   if (Number.isNaN(serial)) return res.status(400).json({ error: 'Bad serial' });
//   const todo = await Todo.findOne({ serial });
//   if (!todo) return res.status(404).json({ error: 'Not found' });
//   if (todo.completed) return res.json({ ok: true, completed: true, completedAt: todo.completedAt });
//   todo.completed = true;
//   todo.completedAt = new Date();
//   await todo.save();
//   return res.json({ ok: true, completed: todo.completed, completedAt: todo.completedAt });
// });

// // submit: archive & reset
// router.post('/submit', auth, enforceClientTimeout, async (req, res) => {
//   const todos = await Todo.find({}).sort({ serial: 1 }).lean();
//   const now = new Date();
//   const dayKey = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }); // YYYY-MM-DD
//   const arch = new ArchivedRun({ runAt: now, dayKey, tasks: todos.map(t => ({ serial: t.serial, name: t.name, time: t.time, completed: !!t.completed, completedAt: t.completedAt })) });
//   await arch.save();
//   await Todo.updateMany({}, { $set: { completed: false, completedAt: null } });
//   return res.json({ archivedCount: arch.tasks.length, runAt: arch.runAt });
// });

// module.exports = router;
// todoRoutes.js
const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const ArchivedRun = require('../models/ArchivedRun');
const auth = require('../middleware/auth');

// ✅ helper: enforce client-side timeout
function enforceClientTimeout(req, res, next) {
  const tsHeader = req.headers['x-client-started-at'] || req.headers['x-client-timestamp'];
  const clientTimeoutMs = parseInt(process.env.CLIENT_TIMEOUT_MS || '4000', 10);

  if (!tsHeader) return res.status(400).json({ error: 'Missing client timestamp' });

  const clientTs = parseInt(tsHeader, 10);
  if (Number.isNaN(clientTs)) return res.status(400).json({ error: 'Bad client timestamp' });

  const now = Date.now();
  const age = now - clientTs;

  if (age > clientTimeoutMs) {
    console.log(`⏱ Rejecting stale request: ${age}ms old`);
    return res.status(408).json({ error: 'Request expired (too old)' });
  }
  next();
}

// --- ROUTES ---

// get todos (no timeout check, safe)
router.get('/', auth, async (req, res) => {
  const todos = await Todo.find({}).sort({ serial: 1 }).lean();
  res.json(todos);
});

// complete todo
router.patch('/:serial/complete', auth, enforceClientTimeout, async (req, res) => {
  const serial = parseInt(req.params.serial, 10);
  if (Number.isNaN(serial)) return res.status(400).json({ error: 'Bad serial' });

  const todo = await Todo.findOne({ serial });
  if (!todo) return res.status(404).json({ error: 'Not found' });

  if (todo.completed) {
    return res.json({ ok: true, completed: true, completedAt: todo.completedAt });
  }

  todo.completed = true;
  todo.completedAt = new Date();
  await todo.save();

  return res.json({ ok: true, completed: true, completedAt: todo.completedAt });
});

// submit: archive & reset
router.post('/submit', auth, enforceClientTimeout, async (req, res) => {
  const todos = await Todo.find({}).sort({ serial: 1 }).lean();
  const now = new Date();
  const dayKey = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

  const arch = new ArchivedRun({
    runAt: now,
    dayKey,
    tasks: todos.map(t => ({
      serial: t.serial,
      name: t.name,
      time: t.time,
      completed: !!t.completed,
      completedAt: t.completedAt
    }))
  });

  await arch.save();
  await Todo.updateMany({}, { $set: { completed: false, completedAt: null } });

  res.json({ archivedCount: arch.tasks.length, runAt: arch.runAt });
});

module.exports = router;
