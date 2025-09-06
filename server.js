// // require('dotenv').config();
// // const express = require('express');
// // const cors = require('cors');
// // const bodyParser = require('body-parser');
// // const mongoose = require('mongoose');

// // const authRoutes = require('./routes/authRoutes');
// // const todoRoutes = require('./routes/todoRoutes');
// // const adminRoutes = require('./routes/adminRoutes');

// // const app = express();
// // const PORT = process.env.PORT || 3000;

// // app.use(cors({ origin: true, credentials: true })); // allow file:// and other origins
// // app.use(bodyParser.json());

// // // Connect to MongoDB
// // mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// //   .then(() => console.log('MongoDB connected'))
// //   .catch(err => { console.error('MongoDB connection error', err); process.exit(1); });
// // // Sure-shot request middleware
// // // app.use((req, res, next) => {
// // //   // accept either header name
// // //   const tsHeader = req.headers['x-client-timestamp'] || req.headers['x-client-started-at'];

// // //   if (!tsHeader) {
// // //     return res.status(400).json({ error: 'Missing client timestamp' });
// // //   }

// // //   const clientTs = parseInt(tsHeader, 10);
// // //   const now = Date.now();

// // //   if (isNaN(clientTs)) {
// // //     return res.status(400).json({ error: 'Invalid timestamp' });
// // //   }

// // //   // If request arrived more than 4000ms after client sent it → reject
// // //   if (now - clientTs > 4000) {
// // //     return res.status(408).json({ error: 'Request expired (took too long)' });
// // //   }

// // //   next();
// // // });
// // app.use((req, res, next) => {
// //   const tsHeader = req.headers['x-client-timestamp'] || req.headers['x-client-started-at'];
// //   if (!tsHeader) {
// //     return res.status(400).json({ error: 'Missing client timestamp' });
// //   }

// //   const clientTs = parseInt(tsHeader, 10);
// //   if (isNaN(clientTs)) {
// //     return res.status(400).json({ error: 'Invalid timestamp' });
// //   }

// //   const now = Date.now();

// //   // Reject if more than 4s old
// //   if (now - clientTs > 4000) {
// //     return res.status(408).json({ error: 'Request expired (took too long)' });
// //   }

// //   next();
// // });

// // // Routes
// // app.use('/auth', authRoutes);
// // app.use('/todos', todoRoutes);
// // app.use('/admin', adminRoutes);

// // // optional health
// // app.get('/', (req, res) => res.json({ ok: true, now: new Date() }));

// // app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');

// const authRoutes = require('./routes/authRoutes');
// const todoRoutes = require('./routes/todoRoutes');
// const adminRoutes = require('./routes/adminRoutes');

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors({ origin: true, credentials: true }));
// app.use(bodyParser.json());

// // Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => { console.error('MongoDB connection error', err); process.exit(1); });

// // --- Sure-shot request middleware ---
// function sureshotMiddleware(req, res, next) {
//   const tsHeader = req.headers['x-client-timestamp'] || req.headers['x-client-started-at'];
//   if (!tsHeader) {
//     return res.status(400).json({ error: 'Missing client timestamp' });
//   }

//   const clientTs = parseInt(tsHeader, 10);
//   if (isNaN(clientTs)) {
//     return res.status(400).json({ error: 'Invalid timestamp' });
//   }

//   const now = Date.now();
//   if (now - clientTs > 4000) {
//     return res.status(408).json({ error: 'Request expired (took too long)' });
//   }

//   next();
// }

// // Routes
// app.use('/auth', authRoutes); // no sureshot here (allow slower login)
// app.use('/todos', sureshotMiddleware, todoRoutes);
// app.use('/admin', sureshotMiddleware, adminRoutes);

// // health
// app.get('/', (req, res) => res.json({ ok: true, now: new Date() }));

// app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// app.use(cors({ origin: true, credentials: true }));
app.use(cors());

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => { console.error('MongoDB connection error', err); process.exit(1); });


  const archivedRoutes = require("./routes/archivedRoutes");
app.use("/archived", archivedRoutes);

// ✅ Routes
app.use('/auth', authRoutes);              // login/signup allowed slower
app.use('/todos', todoRoutes);             // sure-shot handled inside todoRoutes.js
app.use('/admin', adminRoutes);            // you can add requestTimeout if needed
// Global error handler
app.use((err, req, res, next) => {
  console.error('💥 Backend error:', err.stack || err);
  res.status(500).json({ error: 'Internal server error' });
});
// health
app.get('/', (req, res) => res.json({ ok: true, now: new Date() }));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
