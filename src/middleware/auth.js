import jwt          from 'jsonwebtoken'
import { query }    from '../db/pool.js'

const SELECT_USER = `
  SELECT id, name, email, phone, wedding_date, created_at
  FROM users
  WHERE id = $1
`

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer '))
      return res.status(401).json({ error: 'Authentication required' })

    const token   = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const { rows } = await query(SELECT_USER, [decoded.userId])
    if (!rows[0]) return res.status(401).json({ error: 'User not found' })

    req.user = rows[0]
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ error: 'Session expired — please login again' })
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export const optionalAuth = async (req, _res, next) => {
  try {
    const header = req.headers.authorization
    if (!header?.startsWith('Bearer ')) return next()
    const token   = header.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { rows } = await query(SELECT_USER, [decoded.userId])
    req.user = rows[0] || null
  } catch { req.user = null }
  next()
}
