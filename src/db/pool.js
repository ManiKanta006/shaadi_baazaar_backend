import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

const connectionString = (process.env.DATABASE_URL || '').trim()

if (!connectionString) {
  throw new Error('DATABASE_URL is missing. Set it in environment variables.')
}

if (!/^postgres(ql)?:\/\//i.test(connectionString)) {
  throw new Error('DATABASE_URL must start with postgres:// or postgresql://')
}

const parseBool = (value) => ['1', 'true', 'yes', 'on', 'require'].includes(String(value).toLowerCase())
const hasSslModeRequire = /[?&]sslmode=require/i.test(connectionString)
const useSSL = process.env.DB_SSL !== undefined ? parseBool(process.env.DB_SSL) : hasSslModeRequire

const pool = new Pool({
  connectionString,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

pool.on('error', (err) => {
  console.error('Unexpected error on idle client:', err)
  process.exit(-1)
})

export const query = (text, params) => pool.query(text, params)

export const getClient = () => pool.connect()

export default pool
