import { z } from "zod"
import { Task } from "./model.js"
export async function getTasks(req, res) {
  const tasks = await Task.find().sort({ createdAt: -1 })
  res.status(200).json(tasks)
}
export async function createTask(req, res) {
  const {title}=req.body ?? {}
  if (!title) {
    return res.status(400).json({message: "validation failed", errors: "Please Enter a Title"})
  }
  const task = await Task.create({title})
  res.status(201).json(task)
}
export async function updateTask(req, res) {
  const { completed } = req.body ?? {};
  if (!completed || typeof completed !== 'boolean') {
    res.status(400).json({
      message: "Validation failed",
      errors: "Please Enter a completed on either true of the false form"
    })
  }
  const task = await Task.findByIdAndUpdate(req.params.id, {completed})
  if (!task) {
    res.status(404).json({ message: "Task not found" })
    return
  }
  res.status(200).json(task)
}
export async function deleteTask(req, res) {
  const { id } = req.params ?? {};
  const output = await Task.findByIdAndDelete(id)
  if (!output) {
    res.status(404).json({ message: "Task not found" })
    return
  }
  res.status(200).json({ message: "Task deleted" })
}
