import User from "../models/User.js";
import jwt from "jsonwebtoken";
import express from "express";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    console.log("REGISTER HIT");

    const user = await User.create({
      username: req.body.username,
      password: req.body.password,
    });

    console.log("USER CREATED:", user);

    const token = jwt.sign({ id: user._id }, "secret123", {
      expiresIn: "7d",
    });

    res.json({
      token,
      username: user.username,
    });
  } catch (e) {
    console.log("ERROR:", e);
    res.status(500).json({ error: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Empty fields" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign({ id: user._id }, "secret123", { expiresIn: "7d" });

    return res.json({
      token,
      username: user.username,
    });
  } catch (e) {
    console.log("ERROR:", e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
