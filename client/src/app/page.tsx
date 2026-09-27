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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${apiUrl}/tasks`)
      .then((res) => res.json())
      .then(setTasks)
      .catch(() => setError("Some error occured"))
      .finally(() => setLoading(false))
  }, [])

  async function handleAdd(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title) return

    const res = await fetch(`${apiUrl}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title})
    })

    if (!res.ok) {
      setError("Failed to add task")
      return
    }

    const task = await res.json()
    setTasks((current) => [task, ...current])
    setTitle("")
  }

  async function Toggle(id: string, completed: boolean) {
      const res = await fetch(`${apiUrl}/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed })
      })
  
      if (!res.ok) {
        setError("error occured")
        return
      }
      const updated = await res.json()
      setTasks((current) => current.map((task) => (task._id === id ? updated : task)) )
    }
 
    async function Delete(id: string) {
        const res = await fetch(`${apiUrl}/tasks/${id}`, { method: "DELETE" })
        if (!res.ok) {
          setError("delete occured")
          return
        }
        setTasks((current) => current.filter((task) => task._id !== id))
      }
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-4 py-16">
      <h1 className="text-2xl text-slate-100">
        Task Manager
      </h1>

      <form onSubmit={handleAdd} className="flex gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          placeholder="Please Enter"
          className="flex-1 rounded-lg border border-slate-700 bg-[#314158] px-4 py-2.5 text-slate-100 placeholder:text-slate-400"
        />
        <button type="submit" disabled={!title.trim()} className="rounded-lg  py-2.5 font-medium cursor-pointer bg-slate-900 transition-colors ">
          Add task
        </button>
      </form>

      {error && (
        <p className="rounded-lg border bg-red-900 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : tasks.length === 0 ? (
        <p className="rounded-lg border border-dashed border-blue-700 px-4 py-8 text-center text-slate-400">
          No Added
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {tasks.map((task) => (
            <li key={task._id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-700 bg-[#314158] px-4 py-3"
            >
              <label className="flex flex-1 items-center gap-3">
                <input type="checkbox" checked={task.completed}
                  onChange={(event) => Toggle(task._id, event.target.checked) }
                  className="h-4 w-4 accent-slate-400 cursor-pointer"
                />
                <span className={ task.completed ? "text-slate-500 line-through" : "text-slate-100" } >
                  {task.title}
                </span>
              </label>
              <button type="button" onClick={() => Delete(task._id)}
                className="rounded-md px-3 py-1.5 text-sm text-slate-300 cursor-pointer"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
