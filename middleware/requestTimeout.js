// // // middlewares/requestTimeout.js
// // module.exports = function (req, res, next) {
// //   const tsHeader = req.headers['x-client-timestamp'] || req.headers['x-client-started-at'];
// //   if (!tsHeader) {
// //     return res.status(400).json({ error: 'Missing client timestamp' });
// //   }

// //   const clientTs = parseInt(tsHeader, 10);
// //   if (isNaN(clientTs)) {
// //     return res.status(400).json({ error: 'Invalid timestamp' });
// //   }

// //   const now = Date.now();
// //   if (now - clientTs > 4000) {
// //     return res.status(408).json({ error: 'Request expired (took too long)' });
// //   }

// //   next();
// // };
// // middleware/requestTimeout.js
// module.exports = function requestTimeout(req, res, next) {
//   const started = req.headers["x-client-started-at"];
//   const clientTimeoutMs = parseInt(process.env.CLIENT_TIMEOUT_MS || "4000", 10);

//   if (!started) {
//     return res.status(400).json({ error: "Missing X-Client-Started-At header" });
//   }

//   const startedAt = parseInt(started, 10);
//   if (Number.isNaN(startedAt)) {
//     return res.status(400).json({ error: "Bad X-Client-Started-At header" });
//   }

//   const now = Date.now();
//   if (now - startedAt > clientTimeoutMs) {
//     return res.status(408).json({ error: "Client timeout exceeded" });
//   }

//   next();
// };
// middleware/requestTimeout.js
module.exports = function requestTimeout(req, res, next) {
  const started = req.headers["x-client-started-at"];
  const clientTimeoutMs = parseInt(process.env.CLIENT_TIMEOUT_MS || "4000", 10);

  if (!started) {
    return res.status(400).json({ error: "Missing X-Client-Started-At header" });
  }

  const startedAt = parseInt(started, 10);
  if (Number.isNaN(startedAt)) {
    return res.status(400).json({ error: "Invalid X-Client-Started-At header" });
  }

  const now = Date.now();
  if (now - startedAt > clientTimeoutMs) {
    return res.status(408).json({ error: "Request expired (took too long)" });
  }

  next();
};
