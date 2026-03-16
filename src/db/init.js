import { query } from './pool.js'
import { migrateDatabase } from './migrate.js'
import { seedDatabase } from './seed.js'

const bool = (value, defaultValue = false) => {
  if (value === undefined) return defaultValue
  return String(value).toLowerCase() === 'true'
}

export const initializeDatabase = async () => {
  await migrateDatabase()

  const alwaysSeed = bool(process.env.DB_SEED_ON_START, false)
  const autoSeedIfEmpty = bool(process.env.DB_AUTO_SEED_IF_EMPTY, true)
  const shouldConsiderSeed = alwaysSeed || autoSeedIfEmpty

  if (!shouldConsiderSeed) {
    console.log('⏭️  Skipping seed on startup')
    return
  }

  const { rows } = await query('SELECT COUNT(*)::int AS count FROM vendors')
  const vendorCount = rows?.[0]?.count ?? 0

  if (alwaysSeed || vendorCount === 0) {
    console.log(alwaysSeed ? '🌱 Forcing seed (DB_SEED_ON_START=true)' : '🌱 Empty vendors table detected, seeding...')
    await seedDatabase()
  } else {
    console.log(`⏭️  Seed skipped: ${vendorCount} vendors already present`)
  }
}
