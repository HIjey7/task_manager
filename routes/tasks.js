import express from "express";
import Task from "../models/Task.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId });
  res.json(tasks);
});

// CREATE
router.post("/", auth, async (req, res) => {
  const task = new Task({
    text: req.body.text,
    userId: req.userId,
    status: "none",
  });

  const saved = await task.save();
  res.json(saved);
});

// DELETE ONE
router.delete("/:id", auth, async (req, res) => {
  await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });

  res.json({ ok: true });
});

// BULK DELETE
router.post("/bulk-delete", auth, async (req, res) => {
  const { ids } = req.body;

  await Task.deleteMany({
    _id: { $in: ids },
    userId: req.userId,
  });

  res.json({ ok: true });
});

// CHANGE STATUS
router.patch("/:id/status", auth, async (req, res) => {
  const { status } = req.body;

  const updated = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { status },
    { new: true },
  );

  res.json(updated);
});

// BULK STATUS
router.patch("/bulk-status", auth, async (req, res) => {
  const { ids, status } = req.body;

  await Task.updateMany(
    { _id: { $in: ids }, userId: req.userId },
    { $set: { status } },
  );

  const updated = await Task.find({
    _id: { $in: ids },
    userId: req.userId,
  });

  res.json(updated);
});

// ⭐ FIX: EDIT TEXT (ВОТ ЧТО У ТЕБЯ НЕ РАБОТАЛО)
router.patch("/:id/text", auth, async (req, res) => {
  const { text } = req.body;

  const updated = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    { text },
    { new: true },
  );

  res.json(updated);
});

export default router;
