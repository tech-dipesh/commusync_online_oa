import "dotenv/config"
import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import { createTask, deleteTask, getTasks, updateTask } from "./controller.js"

const asyncHandler = (handler) => (req, res, next) => {
  handler(req, res, next).catch(next)
}

const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }))
app.use(express.json())

app.get("/api/tasks", asyncHandler(getTasks))
app.post("/api/tasks", asyncHandler(createTask))
app.patch("/api/tasks/:id", asyncHandler(updateTask))
app.delete("/api/tasks/:id", asyncHandler(deleteTask))

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` })
})

app.use((error, req, res, next) => {
  if (res.headersSent) {
    next(error)
    return
  }
  console.error(error)
  res.status(500).json({ message: "Something went wrong" })
})

const port = process.env.PORT || 4000
const mongodbUri = process.env.MONGODB_URI

try {
  await mongoose.connect(mongodbUri)
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`))
  
} catch (error) {
  console.error("Failed to connect to MongoDB:", error)
}
