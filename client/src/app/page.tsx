"use client"

import { useEffect, useState } from "react"
import type { SubmitEvent } from "react"

interface Task {
  _id: string
  title: string
  completed: boolean
  createdAt: string
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api"

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState("")
 

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-4 py-16">
      <h1 className="text-2xl font-semibold text-slate-100">
        Mini Task Manager
      </h1>

      <form  className="flex gap-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 rounded-lg border border-slate-700 bg-[#314158] px-4 py-2.5 text-slate-100 placeholder:text-slate-400 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        />
        <button type="submit" disabled={!title.trim()} className="rounded-lg bg-blue-500 px-5 py-2.5 cursor-pointer" >
          Add task
        </button>
      </form>
        <ul className="flex flex-col gap-2">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-700 bg-[#314158] px-4 py-3"
            >
              <label className="flex flex-1 cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  className="h-4 w-4 accent-cyan-400"
                />
                <span
                  className={
                    task.completed
                      ? "text-slate-500 line-through"
                      : "text-slate-100"
                  }
                >
                  {task.title}
                </span>
              </label>
              <button
                type="button"
                className="rounded-md px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-slate-700 hover:text-red-400"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
    </main>
  )
}
