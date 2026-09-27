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
        <button type="submit" disabled={!title.trim()} className="rounded-lg  py-2.5 font-medium text-slate-900 transition-colors">
          Add task
        </button>
      </form>

      {error && (
        <p className="rounded-lg border border-red-900 bg-red-950/40 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      
    </main>
  )
}
