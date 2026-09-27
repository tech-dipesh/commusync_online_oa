import mongoose from "mongoose"

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    completed: { type: Boolean, required: true, default: false }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

export const Task = mongoose.model("Task", taskSchema)
