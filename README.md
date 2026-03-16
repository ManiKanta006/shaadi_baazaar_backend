# 🌸 Shaadi Baazaar — Backend API

Node.js + Express + PostgreSQL REST API.

## Quick Start

```bash
npm install

# 1. Copy and fill in your credentials
cp .env.example .env

# 2. Create the PostgreSQL database
psql -U postgres -c "CREATE DATABASE shaadi_baazaar;"

# 3. Run migrations (creates all tables)
npm run db:migrate

# 4. Seed sample data
npm run db:seed

# 5. Start the server
npm run dev    # → http://localhost:5000
```

## Demo Credentials (after seed)

| Field | Value |
|---|---|
| Email | `demo@shaadibaazaar.in` |
| Password | `password123` |

## API Routes

### Auth
```
POST  /api/auth/signup        Create account
POST  /api/auth/login         Login, get JWT token
GET   /api/auth/me            Get current user (JWT required)
PATCH /api/auth/me            Update profile (JWT required)
```

### Vendors
```
GET   /api/vendors            List vendors (filters: category, city, sort, q, page, limit)
GET   /api/vendors/categories Category counts
GET   /api/vendors/:id        Single vendor detail with packages & reviews
```

### Inquiries
```
POST  /api/inquiries          Submit inquiry (JWT optional)
GET   /api/inquiries/mine     My inquiries (JWT required)
```

### Dashboard
```
GET   /api/dashboard/stats              Stats (JWT required)
GET   /api/dashboard/favorites          Saved vendors (JWT required)
POST  /api/dashboard/favorites/:id      Save a vendor (JWT required)
DELETE /api/dashboard/favorites/:id     Remove a vendor (JWT required)
```

### Health
```
GET   /api/health             { status: "ok" }
```

## JWT Auth

Include the token in all protected requests:
```
Authorization: Bearer <token>
```

## Database Schema

```sql
users       — id, name, email, password_hash, phone, wedding_date
vendors     — id, name, slug, category, location, city, description,
              starting_price, rating, review_count, images[], highlights[],
              tags[], is_featured, is_verified, is_active
packages    — id, vendor_id, name, price, includes[]
reviews     — id, vendor_id, user_id, reviewer_name, rating, content
inquiries   — id, vendor_id, user_id, name, email, phone, wedding_date,
              guest_count, budget, message, status
favorites   — id, user_id, vendor_id (unique pair)
```
