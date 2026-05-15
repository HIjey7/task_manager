import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Empty fields" });
  }

  const token = jwt.sign({ id: username }, "secret123", {
    expiresIn: "7d",
  });

  return res.json({
    token,
    username,
  });
});

export default router;
