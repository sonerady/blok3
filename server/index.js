import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import eventsRouter from './routes/events.js'
import contactRouter from './routes/contact.js'
import galleryRouter from './routes/gallery.js'
import subscribersRouter from './routes/subscribers.js'
import pressRouter from './routes/press.js'
import linksRouter from './routes/links.js'
import platformStatsRouter from './routes/platformStats.js'
import concertStatsRouter from './routes/concertStats.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

app.use('/api/blok3', authRouter)
app.use('/api/blok3', eventsRouter)
app.use('/api/blok3', contactRouter)
app.use('/api/blok3', galleryRouter)
app.use('/api/blok3', subscribersRouter)
app.use('/api/blok3', pressRouter)
app.use('/api/blok3', linksRouter)
app.use('/api/blok3', platformStatsRouter)
app.use('/api/blok3', concertStatsRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`BLOK3 server running on port ${PORT}`)
})
