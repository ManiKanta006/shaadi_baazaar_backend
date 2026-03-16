import { Router } from 'express'
import { query } from '../db/pool.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// GET /api/dashboard/stats
router.get('/stats', authenticate, async (req, res) => {
  try {
    const userId = req.user.id

    const [inquiriesResult, favoritesResult, userResult] = await Promise.all([
      query('SELECT COUNT(*) FROM inquiries WHERE user_id = $1', [userId]),
      query('SELECT COUNT(*) FROM favorites WHERE user_id = $1', [userId]),
      query('SELECT wedding_date FROM users WHERE id = $1', [userId]),
    ])

    const weddingDate = userResult.rows[0]?.wedding_date
    const daysToWedding = weddingDate
      ? Math.ceil((new Date(weddingDate) - new Date()) / (1000 * 60 * 60 * 24))
      : null

    res.json({
      stats: {
        inquiries: Number(inquiriesResult.rows[0].count),
        favorites: Number(favoritesResult.rows[0].count),
        daysToWedding,
      },
    })
  } catch (err) {
    console.error('Dashboard stats error:', err)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// GET /api/dashboard/favorites
router.get('/favorites', authenticate, async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT v.id, v.name, v.category, v.location, v.rating, v.starting_price, v.images, v.slug
       FROM favorites f
       JOIN vendors v ON f.vendor_id = v.id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [req.user.id]
    )
    res.json({ favorites: rows })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch favorites' })
  }
})

// POST /api/dashboard/favorites/:vendorId
router.post('/favorites/:vendorId', authenticate, async (req, res) => {
  try {
    await query(
      'INSERT INTO favorites (user_id, vendor_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [req.user.id, req.params.vendorId]
    )
    res.json({ message: 'Vendor saved to favorites' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to save favorite' })
  }
})

// DELETE /api/dashboard/favorites/:vendorId
router.delete('/favorites/:vendorId', authenticate, async (req, res) => {
  try {
    await query(
      'DELETE FROM favorites WHERE user_id = $1 AND vendor_id = $2',
      [req.user.id, req.params.vendorId]
    )
    res.json({ message: 'Vendor removed from favorites' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove favorite' })
  }
})

export default router
