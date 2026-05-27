import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'aav_time-api',
    timestamp: new Date().toISOString(),
  })
})

app.get('/api/time', (_req, res) => {
  res.json({
    now: new Date().toISOString(),
  })
})

app.use('/api', (_req, res) => {
  res.status(404).json({
    error: 'API route not found',
  })
})

app.use((error, _req, res, _next) => {
  console.error(error)

  res.status(500).json({
    error: 'Internal server error',
  })
})

app.listen(PORT, () => {
  console.log(`Express backend listening on http://localhost:${PORT}`)
})
