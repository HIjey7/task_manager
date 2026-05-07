import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import taskRoutes from "./routes/tasks.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/taskmanager");

app.listen(3000, () => {
  console.log("Server running on port 3000 \nMongoDB connected");
});
