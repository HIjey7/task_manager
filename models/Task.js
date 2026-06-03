import mongoose from "mongoose";

console.log("TASK MODEL LOADED, DB:", mongoose.connection.name);

const taskSchema = new mongoose.Schema({
  text: String,
  status: String,
  userId: String,
});

export default mongoose.model("Task", taskSchema);
