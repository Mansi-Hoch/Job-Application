import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Trash2, Plus, Edit2, Check, X } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const API_AUTH = import.meta.env.VITE_API_AUTH || ''

const getHeaders = (contentType = false): HeadersInit => {
  const headers: HeadersInit = {}
  if (API_AUTH) {
    headers['Authorization'] = `Basic ${btoa(API_AUTH)}`
  }
  if (contentType) {
    headers['Content-Type'] = 'application/json'
  }
  return headers
}

interface Todo {
  id: number
  title: string
  completed: boolean
  createdAt: string
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      setLoading(true)
            const response = await fetch(`${API_URL}/api/todos`, {
              headers: getHeaders()
            })
            if (!response.ok) throw new Error('Failed to fetch todos')
      const data = await response.json()
      setTodos(data)
      setError(null)
    } catch (err) {
      setError('Failed to load todos. Please check if the server is running.')
    } finally {
      setLoading(false)
    }
  }

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
            const response = await fetch(`${API_URL}/api/todos`, {
              method: 'POST',
              headers: getHeaders(true),
              body: JSON.stringify({ title: newTodo })
            })
      if (!response.ok) throw new Error('Failed to add todo')
      const todo = await response.json()
      setTodos([...todos, todo])
      setNewTodo('')
    } catch (err) {
      setError('Failed to add todo')
    }
  }

  const toggleTodo = async (id: number, completed: boolean) => {
    try {
            const response = await fetch(`${API_URL}/api/todos/${id}`, {
              method: 'PUT',
              headers: getHeaders(true),
              body: JSON.stringify({ completed: !completed })
            })
      if (!response.ok) throw new Error('Failed to update todo')
      const updatedTodo = await response.json()
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo))
    } catch (err) {
      setError('Failed to update todo')
    }
  }

  const deleteTodo = async (id: number) => {
    try {
            const response = await fetch(`${API_URL}/api/todos/${id}`, {
              method: 'DELETE',
              headers: getHeaders()
            })
      if (!response.ok) throw new Error('Failed to delete todo')
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (err) {
      setError('Failed to delete todo')
    }
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditingTitle(todo.title)
  }

  const saveEdit = async (id: number) => {
    if (!editingTitle.trim()) return

    try {
            const response = await fetch(`${API_URL}/api/todos/${id}`, {
              method: 'PUT',
              headers: getHeaders(true),
              body: JSON.stringify({ title: editingTitle })
            })
      if (!response.ok) throw new Error('Failed to update todo')
      const updatedTodo = await response.json()
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo))
      setEditingId(null)
      setEditingTitle('')
    } catch (err) {
      setError('Failed to update todo')
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  const completedCount = todos.filter(t => t.completed).length
  const totalCount = todos.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-xl">
            <CardTitle className="text-2xl text-white text-center">
              My To-Do List
            </CardTitle>
            {totalCount > 0 && (
              <p className="text-blue-100 text-center text-sm">
                {completedCount} of {totalCount} tasks completed
              </p>
            )}
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={addTodo} className="flex gap-2 mb-6">
              <Input
                type="text"
                placeholder="Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </form>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
                <button 
                  onClick={() => setError(null)} 
                  className="float-right text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {loading ? (
              <div className="text-center py-8 text-slate-500">
                Loading todos...
              </div>
            ) : todos.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No tasks yet. Add one above!
              </div>
            ) : (
              <ul className="space-y-3">
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                      todo.completed 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-white border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
                      className="h-5 w-5"
                    />
                    
                    {editingId === todo.id ? (
                      <div className="flex-1 flex gap-2">
                        <Input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="flex-1"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(todo.id)
                            if (e.key === 'Escape') cancelEdit()
                          }}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => saveEdit(todo.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={cancelEdit}
                          className="text-slate-500 hover:text-slate-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span
                          className={`flex-1 ${
                            todo.completed 
                              ? 'text-slate-500 line-through' 
                              : 'text-slate-800'
                          }`}
                        >
                          {todo.title}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => startEditing(todo)}
                          className="text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => deleteTodo(todo.id)}
                          className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
