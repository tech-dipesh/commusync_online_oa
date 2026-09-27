import { z } from "zod"
import { Task } from "./model.js"

export async function getTasks(req, res) {
  const tasks = await Task.find().sort({ createdAt: -1 })
  res.status(200).json(tasks)
}
