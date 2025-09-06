// routes/archivedRoutes.js
const express = require("express");
const router = express.Router();
const ArchivedRun = require("../models/ArchivedRun");

// Get archived runs (optional filter by dayKey)
router.get("/", async (req, res) => {
  const { dayKey } = req.query;
  let filter = {};
  if (dayKey) filter.dayKey = dayKey;

  const runs = await ArchivedRun.find(filter).sort({ runAt: -1 }).lean();
  res.json(runs);
});

module.exports = router;
