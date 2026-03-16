import express  from 'express'
import cors     from 'cors'
import dotenv   from 'dotenv'
import authRoutes      from './routes/auth.js'
import vendorRoutes    from './routes/vendors.js'
import inquiryRoutes   from './routes/inquiries.js'
import dashboardRoutes from './routes/dashboard.js'
import { initializeDatabase } from './db/init.js'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000

// ── CORS ──────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim())

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return cb(null, true)
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
    cb(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Request logger (dev) ──────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`  ${req.method} ${req.path}`)
    next()
  })
}

// ── Routes ────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes)
app.use('/api/vendors',   vendorRoutes)
app.use('/api/inquiries', inquiryRoutes)
app.use('/api/dashboard', dashboardRoutes)

// ── Health check ──────────────────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
)

// ── 404 ───────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }))

// ── Global error handler ──────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  const status = err.status || 500
  console.error(`[Error ${status}]`, err.message)
  res.status(status).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// ── Start ─────────────────────────────────────────────────────────────
const start = async () => {
  try {
    await initializeDatabase()
    app.listen(PORT, () => {
      console.log(`\n🌸  Shaadi Baazaar API  →  http://localhost:${PORT}`)
      console.log(`🩺  Health check       →  http://localhost:${PORT}/api/health`)
      console.log(`🌐  Allowed origins    →  ${ALLOWED_ORIGINS.join(', ')}\n`)
    })
  } catch (err) {
    console.error('❌ Failed to initialize database:', err.message)
    process.exit(1)
  }
}

start()

export default app
