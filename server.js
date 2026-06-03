import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");

    app.use("/api/auth", authRoutes);
    app.use("/api/tasks", taskRoutes);

    app.listen(PORT, () => {
      console.log("Server running on", PORT);
    });
  })
  .catch((err) => console.log(err));
