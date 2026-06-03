import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

let timeEntries = []
let todos = []
let taskTemplates = []

const createId = () => Date.now().toString()

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/time-entries', (_req, res) => {
  res.json(timeEntries)
})

app.post('/api/time-entries', (req, res) => {
  const entry = { ...req.body, id: createId() }
  timeEntries.push(entry)
  res.status(201).json(entry)
})

app.patch('/api/time-entries/:id', (req, res) => {
  const { id } = req.params
  timeEntries = timeEntries.map(entry =>
    entry.id === id ? { ...entry, ...req.body } : entry
  )
  res.json(timeEntries.find(entry => entry.id === id))
})

app.delete('/api/time-entries/:id', (req, res) => {
  const { id } = req.params
  timeEntries = timeEntries.filter(entry => entry.id !== id)
  res.json({ success: true })
})

app.get('/api/todos', (_req, res) => {
  res.json(todos)
})

app.post('/api/todos', (req, res) => {
  const todo = { ...req.body, id: createId() }
  todos.push(todo)
  res.status(201).json(todo)
})

app.patch('/api/todos/:id', (req, res) => {
  const { id } = req.params
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, ...req.body } : todo
  )
  res.json(todos.find(todo => todo.id === id))
})

app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params
  todos = todos.filter(todo => todo.id !== id)
  res.json({ success: true })
})

app.get('/api/task-templates', (_req, res) => {
  res.json(taskTemplates)
})

app.post('/api/task-templates', (req, res) => {
  const template = { ...req.body, id: createId() }
  taskTemplates.push(template)
  res.status(201).json(template)
})

app.delete('/api/task-templates/:id', (req, res) => {
  const { id } = req.params
  taskTemplates = taskTemplates.filter(template => template.id !== id)
  res.json({ success: true })
})

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'API route not found' })
})

app.listen(PORT, () => {
  console.log(`Express backend listening on http://localhost:${PORT}`)
})