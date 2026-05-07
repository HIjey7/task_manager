import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// routes (проверь пути под себя)
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());

app.use(
  cors({
    origin: "*",
  }),
);

// ===== ROUTES =====
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ===== DB CONNECT =====
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

// ===== START SERVER (ВАЖНО ДЛЯ RENDER) =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
