import { Router } from 'express'
import { query } from '../db/pool.js'
import { authenticate, optionalAuth } from '../middleware/auth.js'

const router = Router()

// POST /api/inquiries - Submit an inquiry
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { vendor_id, name, email, phone, wedding_date, guest_count, budget, message } = req.body

    if (!vendor_id || !name || !email) {
      return res.status(400).json({ error: 'vendor_id, name, and email are required' })
    }

    const vendorExists = await query('SELECT id FROM vendors WHERE id = $1 AND is_active = true', [vendor_id])
    if (!vendorExists.rows[0]) {
      return res.status(404).json({ error: 'Vendor not found' })
    }

    const { rows } = await query(
      `INSERT INTO inquiries (vendor_id, user_id, name, email, phone, wedding_date, guest_count, budget, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        vendor_id,
        req.user?.id || null,
        name,
        email,
        phone || null,
        wedding_date || null,
        guest_count ? Number(guest_count) : null,
        budget || null,
        message || null,
      ]
    )

    res.status(201).json({ inquiry: rows[0], message: 'Inquiry submitted successfully' })
  } catch (err) {
    console.error('Create inquiry error:', err)
    res.status(500).json({ error: 'Failed to submit inquiry' })
  }
})

// GET /api/inquiries/mine - User's own inquiries
router.get('/mine', authenticate, async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT i.*, v.name as vendor_name, v.category as vendor_category, v.slug as vendor_slug
       FROM inquiries i
       JOIN vendors v ON i.vendor_id = v.id
       WHERE i.user_id = $1
       ORDER BY i.created_at DESC`,
      [req.user.id]
    )
    res.json({ inquiries: rows })
  } catch (err) {
    console.error('Get inquiries error:', err)
    res.status(500).json({ error: 'Failed to fetch inquiries' })
  }
})

// PATCH /api/inquiries/:id/status
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body
    const allowed = ['pending', 'replied', 'booked', 'cancelled']
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }
    const { rows } = await query(
      `UPDATE inquiries SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *`,
      [status, req.params.id, req.user.id]
    )
    if (!rows[0]) return res.status(404).json({ error: 'Inquiry not found' })
    res.json({ inquiry: rows[0] })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update inquiry' })
  }
})

export default router
