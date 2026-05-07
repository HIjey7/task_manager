import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["none", "todo", "progress", "done"],
    default: "none",
  },
  userId: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Task", taskSchema);
