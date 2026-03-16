import { Router } from 'express'
import bcrypt      from 'bcryptjs'
import jwt         from 'jsonwebtoken'
import { query }   from '../db/pool.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

const signToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })

const PUBLIC_USER_FIELDS =
  'id, name, email, phone, wedding_date, created_at'

// ── POST /api/auth/signup ────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name?.trim() || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required' })
    if (password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters' })

    const existing = await query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
    if (existing.rows[0])
      return res.status(409).json({ error: 'An account with this email already exists' })

    const hash = await bcrypt.hash(password, 12)
    const { rows } = await query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1,$2,$3)
       RETURNING ${PUBLIC_USER_FIELDS}`,
      [name.trim(), email.toLowerCase().trim(), hash]
    )
    res.status(201).json({ user: rows[0], token: signToken(rows[0].id) })
  } catch (err) {
    console.error('signup error:', err)
    res.status(500).json({ error: 'Failed to create account' })
  }
})

// ── POST /api/auth/login ─────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' })

    const { rows } = await query(
      `SELECT id, name, email, phone, wedding_date, password_hash FROM users WHERE email = $1`,
      [email.toLowerCase().trim()]
    )
    const user = rows[0]
    if (!user || !(await bcrypt.compare(password, user.password_hash)))
      return res.status(401).json({ error: 'Invalid email or password' })

    const { password_hash, ...safe } = user
    res.json({ user: safe, token: signToken(user.id) })
  } catch (err) {
    console.error('login error:', err)
    res.status(500).json({ error: 'Login failed' })
  }
})

// ── GET /api/auth/me ─────────────────────────────────────────────────
router.get('/me', authenticate, (req, res) => res.json({ user: req.user }))

// ── PATCH /api/auth/me ────────────────────────────────────────────────
router.patch('/me', authenticate, async (req, res) => {
  try {
    const { name, phone, wedding_date } = req.body
    const { rows } = await query(
      `UPDATE users
       SET name         = COALESCE($1, name),
           phone        = COALESCE($2, phone),
           wedding_date = COALESCE($3, wedding_date),
           updated_at   = NOW()
       WHERE id = $4
       RETURNING ${PUBLIC_USER_FIELDS}`,
      [name || null, phone || null, wedding_date || null, req.user.id]
    )
    res.json({ user: rows[0] })
  } catch (err) {
    console.error('update user error:', err)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

export default router
