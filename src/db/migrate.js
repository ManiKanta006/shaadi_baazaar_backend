import { query } from './pool.js'

export const migrateDatabase = async () => {
  console.log('🗄️  Running Shaadi Baazaar migrations...\n')
  try {

    // ── Users ──────────────────────────────────────────────────────────
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id            SERIAL PRIMARY KEY,
        name          VARCHAR(255) NOT NULL,
        email         VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        phone         VARCHAR(20),
        wedding_date  DATE,
        avatar_url    TEXT,
        created_at    TIMESTAMPTZ DEFAULT NOW(),
        updated_at    TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    console.log('✅  users')

    // ── Vendors ────────────────────────────────────────────────────────
    await query(`
      CREATE TABLE IF NOT EXISTS vendors (
        id               SERIAL PRIMARY KEY,
        name             VARCHAR(255) NOT NULL,
        slug             VARCHAR(255) UNIQUE NOT NULL,
        category         VARCHAR(100) NOT NULL,
        location         VARCHAR(255),
        city             VARCHAR(100),
        state            VARCHAR(100),
        description      TEXT,
        long_description TEXT,
        starting_price   DECIMAL(12,2),
        rating           DECIMAL(3,2) DEFAULT 0,
        review_count     INTEGER DEFAULT 0,
        phone            VARCHAR(20),
        email            VARCHAR(255),
        website          TEXT,
        images           TEXT[],
        highlights       TEXT[],
        tags             TEXT[],
        is_featured      BOOLEAN DEFAULT false,
        is_verified      BOOLEAN DEFAULT false,
        is_active        BOOLEAN DEFAULT true,
        created_at       TIMESTAMPTZ DEFAULT NOW(),
        updated_at       TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    console.log('✅  vendors')

    // ── Packages ───────────────────────────────────────────────────────
    await query(`
      CREATE TABLE IF NOT EXISTS packages (
        id         SERIAL PRIMARY KEY,
        vendor_id  INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
        name       VARCHAR(100) NOT NULL,
        price      DECIMAL(12,2) NOT NULL,
        description TEXT,
        includes   TEXT[],
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    console.log('✅  packages')

    // ── Reviews ────────────────────────────────────────────────────────
    await query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id            SERIAL PRIMARY KEY,
        vendor_id     INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
        user_id       INTEGER REFERENCES users(id) ON DELETE SET NULL,
        reviewer_name VARCHAR(255) NOT NULL,
        rating        INTEGER CHECK (rating BETWEEN 1 AND 5) NOT NULL,
        content       TEXT NOT NULL,
        wedding_date  DATE,
        created_at    TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    console.log('✅  reviews')

    // ── Inquiries ──────────────────────────────────────────────────────
    await query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id           SERIAL PRIMARY KEY,
        vendor_id    INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
        user_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
        name         VARCHAR(255) NOT NULL,
        email        VARCHAR(255) NOT NULL,
        phone        VARCHAR(20),
        wedding_date DATE,
        guest_count  INTEGER,
        budget       VARCHAR(100),
        message      TEXT,
        status       VARCHAR(50) DEFAULT 'pending',
        created_at   TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    console.log('✅  inquiries')

    // ── Favorites ──────────────────────────────────────────────────────
    await query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id         SERIAL PRIMARY KEY,
        user_id    INTEGER REFERENCES users(id) ON DELETE CASCADE,
        vendor_id  INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, vendor_id)
      )
    `)
    console.log('✅  favorites')

    // ── Indexes ────────────────────────────────────────────────────────
    await query(`CREATE INDEX IF NOT EXISTS idx_vendors_category   ON vendors(category)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_vendors_city       ON vendors(city)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_vendors_featured   ON vendors(is_featured)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_vendors_active     ON vendors(is_active)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_inquiries_user     ON inquiries(user_id)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_favorites_user     ON favorites(user_id)`)
    await query(`CREATE INDEX IF NOT EXISTS idx_reviews_vendor     ON reviews(vendor_id)`)
    console.log('✅  indexes')

    console.log('\n🎊  Migrations complete!\n')
  } catch (err) {
    console.error('\n❌  Migration failed:', err.message)
    console.error(err)
    throw err
  }
}

if (process.argv[1]?.endsWith('migrate.js')) {
  migrateDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
