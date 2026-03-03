import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'
import eventsRouter from './routes/events.js'
import contactRouter from './routes/contact.js'
import galleryRouter from './routes/gallery.js'
import subscribersRouter from './routes/subscribers.js'
import pressRouter from './routes/press.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/blok3', authRouter)
app.use('/api/blok3', eventsRouter)
app.use('/api/blok3', contactRouter)
app.use('/api/blok3', galleryRouter)
app.use('/api/blok3', subscribersRouter)
app.use('/api/blok3', pressRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`BLOK3 server running on http://localhost:${PORT}`)
})
