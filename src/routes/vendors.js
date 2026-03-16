import { Router } from 'express'
import { query }  from '../db/pool.js'
import { optionalAuth } from '../middleware/auth.js'

const router = Router()

// ── GET /api/vendors/categories ─────────────────────────────────────
// Must be BEFORE /:id so "categories" isn't treated as a param
router.get('/categories', async (_req, res) => {
  try {
    const { rows } = await query(`
      SELECT category, COUNT(*) AS count
      FROM vendors
      WHERE is_active = true
      GROUP BY category
      ORDER BY count DESC
    `)
    res.json({ categories: rows })
  } catch (err) {
    console.error('categories error:', err)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// ── GET /api/vendors ─────────────────────────────────────────────────
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category, city, sort = 'featured',
      q, featured, page = 1, limit = 9,
    } = req.query

    const offset     = (Number(page) - 1) * Number(limit)
    const conditions = ['v.is_active = true']
    const params     = []
    let   idx        = 1

    if (category && category !== 'all') {
      conditions.push(`v.category ILIKE $${idx++}`)
      params.push(category)
    }
    if (city && city !== 'All Cities') {
      conditions.push(`v.city ILIKE $${idx++}`)
      params.push(`%${city}%`)
    }
    if (featured === 'true') {
      conditions.push('v.is_featured = true')
    }
    if (q) {
      conditions.push(
        `(v.name ILIKE $${idx} OR v.description ILIKE $${idx} OR v.location ILIKE $${idx} OR v.category ILIKE $${idx})`
      )
      params.push(`%${q}%`)
      idx++
    }

    const where   = `WHERE ${conditions.join(' AND ')}`
    const orderBy = {
      featured:   'v.is_featured DESC, v.rating DESC NULLS LAST',
      rating:     'v.rating DESC NULLS LAST',
      price_asc:  'v.starting_price ASC NULLS LAST',
      price_desc: 'v.starting_price DESC NULLS LAST',
      reviews:    'v.review_count DESC NULLS LAST',
    }[sort] || 'v.is_featured DESC, v.rating DESC NULLS LAST'

    const dataSQL = `
      SELECT
        v.id, v.name, v.slug, v.category, v.location, v.city,
        v.description, v.starting_price, v.rating, v.review_count,
        v.images, v.tags, v.is_featured, v.is_verified
      FROM vendors v
      ${where}
      ORDER BY ${orderBy}
      LIMIT $${idx++} OFFSET $${idx++}
    `
    const countSQL = `SELECT COUNT(*) FROM vendors v ${where}`

    const [data, count] = await Promise.all([
      query(dataSQL,  [...params, Number(limit), offset]),
      query(countSQL, [...params]),
    ])

    res.json({
      vendors:    data.rows,
      total:      Number(count.rows[0].count),
      page:       Number(page),
      totalPages: Math.ceil(Number(count.rows[0].count) / Number(limit)),
    })
  } catch (err) {
    console.error('list vendors error:', err)
    res.status(500).json({ error: 'Failed to fetch vendors' })
  }
})

// ── GET /api/vendors/:id ─────────────────────────────────────────────
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id }    = req.params
    const isNumeric = /^\d+$/.test(id)
    const field     = isNumeric ? 'v.id = $1' : 'v.slug = $1'
    const val       = isNumeric ? Number(id) : id

    const { rows } = await query(
      `SELECT
         v.*,
         (
           SELECT json_agg(p ORDER BY p.price ASC)
           FROM packages p
           WHERE p.vendor_id = v.id
         ) AS packages,
         (
           SELECT json_agg(r ORDER BY r.created_at DESC)
           FROM reviews r
           WHERE r.vendor_id = v.id
           LIMIT 20
         ) AS reviews
       FROM vendors v
       WHERE ${field} AND v.is_active = true`,
      [val]
    )

    if (!rows[0]) return res.status(404).json({ error: 'Vendor not found' })

    // Ensure images is always an array (never null)
    const vendor = rows[0]
    if (!Array.isArray(vendor.images)) vendor.images = []

    res.json(vendor)
  } catch (err) {
    console.error('get vendor error:', err)
    res.status(500).json({ error: 'Failed to fetch vendor' })
  }
})

export default router
