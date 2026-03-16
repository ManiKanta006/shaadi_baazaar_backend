import { query } from './pool.js'
import bcrypt from 'bcryptjs'

const P = 'https://images.pexels.com/photos'
const q = 'auto=compress&cs=tinysrgb&w=800'

const PHOTOS = {
  bride:    `${P}/2253870/pexels-photo-2253870.jpeg?${q}`,
  couple:   `${P}/3662630/pexels-photo-3662630.jpeg?${q}`,
  mandap:   `${P}/1456613/pexels-photo-1456613.jpeg?${q}`,
  lehenga:  `${P}/1024993/pexels-photo-1024993.jpeg?${q}`,
  pheras:   `${P}/3014856/pexels-photo-3014856.jpeg?${q}`,
  haldi:    `${P}/5710079/pexels-photo-5710079.jpeg?${q}`,
  mehendi:  `${P}/2827431/pexels-photo-2827431.jpeg?${q}`,
  south:    `${P}/3014963/pexels-photo-3014963.jpeg?${q}`,
  guests:   `${P}/1024960/pexels-photo-1024960.jpeg?${q}`,
  food:     `${P}/958545/pexels-photo-958545.jpeg?${q}`,
}

export const seedDatabase = async () => {
  console.log('🌸 Seeding Shaadi Baazaar database...\n')
  try {
    // ── Demo user ─────────────────────────────────────────────────────
    const hash = await bcrypt.hash('password123', 12)
    await query(
      `INSERT INTO users (name, email, password_hash, phone)
       VALUES ($1,$2,$3,$4) ON CONFLICT (email) DO NOTHING`,
      ['Priya Sharma', 'demo@shaadibaazaar.in', hash, '+91 98765 43210']
    )
    console.log('✅ Demo user — demo@shaadibaazaar.in / password123')

    // ── Vendors ───────────────────────────────────────────────────────
    const vendors = [
      {
        name: 'Ritu Clicks Studio',
        slug: 'ritu-clicks-studio',
        category: 'Photography',
        location: 'Karol Bagh, New Delhi',
        city: 'Delhi',
        state: 'Delhi',
        description: 'Award-winning candid wedding photography studio. 12+ years covering North Indian weddings — from grand Punjabi baraats to intimate ceremonies.',
        long_description: 'Our style is a blend of traditional portraits and candid storytelling. We document your shaadi as it unfolds — with all its colours, laughter, and emotions.\n\nWe have covered weddings across Delhi, Rajasthan, Himachal Pradesh and destination weddings in Udaipur, Goa, and Rishikesh.',
        starting_price: 45000,
        rating: 4.9,
        review_count: 312,
        email: 'hello@rituclicks.in',
        phone: '+91 98765 43210',
        images: [PHOTOS.bride, PHOTOS.couple, PHOTOS.mandap, PHOTOS.lehenga, PHOTOS.pheras],
        highlights: ['Candid Photography', 'Pre-wedding Shoot', 'Drone Aerial Shots', 'Cinematic Film', 'Same-day Edit', 'Destination Weddings'],
        tags: ['Best in Delhi', 'Destination Expert', '12 Yrs Experience'],
        is_featured: true,
        is_verified: true,
      },
      {
        name: 'Royal Rajwada Palace',
        slug: 'royal-rajwada-palace',
        category: 'Venues',
        location: 'Civil Lines, Jaipur',
        city: 'Jaipur',
        state: 'Rajasthan',
        description: 'Heritage palace venue with royal Rajasthani architecture, majestic lawns and impeccable hospitality. Perfect for grand Indian weddings.',
        long_description: 'Royal Rajwada Palace spans 5 acres of heritage property with ornate architecture, manicured lawns, a grand ballroom, and traditional haveli-style courtyards.\n\nCapacity: 500 to 3,000 guests. In-house catering with Rajasthani, Mughlai and multi-cuisine options.',
        starting_price: 350000,
        rating: 4.8,
        review_count: 189,
        email: 'events@royalrajwada.in',
        phone: '+91 98200 11223',
        images: [PHOTOS.mandap, PHOTOS.couple, PHOTOS.guests, PHOTOS.pheras],
        highlights: ['Heritage Architecture', '500–3000 Guests', 'In-house Catering', 'Ample Parking', 'Bridal Suite', 'Lawn & Indoor Both'],
        tags: ['Heritage Venue', 'Best in Jaipur', 'Palace Wedding'],
        is_featured: true,
        is_verified: true,
      },
      {
        name: 'Rani Shringar Bridal Studio',
        slug: 'rani-shringar-bridal',
        category: 'Makeup',
        location: 'Bandra West, Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        description: 'Celebrity bridal makeup artist. Expert in all Indian bridal looks — Bengali, Punjabi, South Indian, Marathi, and more.',
        long_description: 'With 15 years of experience and 2,000+ brides transformed, Rani Shringar is Mumbai\'s most sought-after bridal makeup studio.\n\nSpecialising in long-lasting airbrush makeup, HD bridal looks, and all skin tones.',
        starting_price: 18000,
        rating: 4.9,
        review_count: 456,
        email: 'book@ranishringar.in',
        phone: '+91 98100 44556',
        images: [PHOTOS.bride, PHOTOS.couple, PHOTOS.lehenga],
        highlights: ['HD Airbrush Makeup', 'All Indian Styles', 'Trial Included', 'Mehendi Coordination', 'Pre-bridal Package', 'Home Service'],
        tags: ['Best in Mumbai', 'Celebrity Artist', '2000+ Brides'],
        is_featured: true,
        is_verified: true,
      },
      {
        name: 'Shahi Dawat Caterers',
        slug: 'shahi-dawat-caterers',
        category: 'Catering',
        location: 'Connaught Place, Delhi',
        city: 'Delhi',
        state: 'Delhi',
        description: 'Premium Mughlai, North Indian & multi-cuisine wedding caterers. Serving 200 to 10,000 guests with elegance since 1998.',
        long_description: 'Shahi Dawat has been the caterer of choice for Delhi\'s elite weddings for 25+ years. Our chefs trained in 5-star kitchens bring restaurant-quality food to your shaadi.\n\nWe handle everything — setup, service staff, crockery, live counters and dessert stations.',
        starting_price: 800,
        rating: 4.7,
        review_count: 534,
        email: 'bookings@shahidawat.in',
        phone: '+91 11 4000 5566',
        images: [PHOTOS.food, PHOTOS.guests, PHOTOS.mandap],
        highlights: ['North Indian Cuisine', 'Mughlai Speciality', 'Continental Options', 'Live Counters', 'Staff Included', '200–10,000 Guests'],
        tags: ['25 Yrs Experience', 'Best in Delhi', 'Per Plate Pricing'],
        is_featured: false,
        is_verified: true,
      },
      {
        name: 'Phool Bangla Decor',
        slug: 'phool-bangla-decor',
        category: 'Decor',
        location: 'Andheri, Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        description: 'Exotic floral mandap and stage decorations. Specialising in marigold, rose, and jasmine arrangements with traditional & contemporary styles.',
        long_description: 'Phool Bangla transforms ordinary venues into breathtaking wedding settings. From intimate mehndi night decor to grand reception stages — every detail is crafted with precision and passion.',
        starting_price: 60000,
        rating: 4.8,
        review_count: 267,
        email: 'hello@phoolbangla.in',
        phone: '+91 98200 77889',
        images: [PHOTOS.mandap, PHOTOS.couple, PHOTOS.pheras, PHOTOS.lehenga],
        highlights: ['Floral Mandap', 'Stage Decoration', 'Table Centrepieces', 'Entrance Design', 'Mehndi Décor', 'Full Venue Transformation'],
        tags: ['Floral Expert', 'Best in Mumbai', 'Traditional Styles'],
        is_featured: false,
        is_verified: true,
      },
      {
        name: 'Heena Mehendi Artists',
        slug: 'heena-mehendi-artists',
        category: 'Mehendi',
        location: 'Johari Bazaar, Jaipur',
        city: 'Jaipur',
        state: 'Rajasthan',
        description: 'Rajasthani mehndi specialists — 3 generations of artistry. Bridal full arm mehendi, dulhe ki mehndi, and guest patterns.',
        long_description: 'The Heena family has been practising the art of mehndi for 3 generations in Jaipur\'s heart. Our intricate Rajasthani patterns, fine Arabic designs, and hidden dulha faces are our signature.\n\nWe travel pan-India for bridal bookings.',
        starting_price: 5000,
        rating: 4.9,
        review_count: 891,
        email: 'heena@jaipur-mehendi.in',
        phone: '+91 94100 33221',
        images: [PHOTOS.mehendi, PHOTOS.bride, PHOTOS.couple],
        highlights: ['Rajasthani Patterns', 'Arabic Designs', 'Bridal Full Arm', 'Dulha Mehndi', 'Guest Mehndi', 'Pan-India Travel'],
        tags: ['3 Gen Legacy', 'Best in Jaipur', '890+ Reviews'],
        is_featured: false,
        is_verified: true,
      },
      {
        name: 'Pandit Ramesh Sharma Ji',
        slug: 'pandit-ramesh-sharma',
        category: 'Pandit',
        location: 'Dashashwamedh Ghat, Varanasi',
        city: 'Varanasi',
        state: 'Uttar Pradesh',
        description: 'Experienced Vedic pandit for all Hindu wedding rituals. Saptapadi, Kanyadaan, Ganesh Puja explained in Hindi & English.',
        long_description: 'Pandit Ramesh Sharma Ji comes from a long line of Varanasi pandits. With 30+ years of experience performing weddings across all Hindu traditions — North Indian, South Indian, Bengali, Maharashtrian — he ensures every ritual is performed correctly and meaningfully.\n\nHe travels pan-India and explains each ritual to both families.',
        starting_price: 11000,
        rating: 5.0,
        review_count: 1240,
        email: 'panditramesh@hinduvedic.in',
        phone: '+91 94150 55443',
        images: [PHOTOS.pheras, PHOTOS.couple, PHOTOS.mandap],
        highlights: ['Saptapadi Ceremony', 'Kanyadaan', 'Ganesh Puja', 'Satyanarayan Katha', 'Pan-India Travel', 'Hindi & English Explanation'],
        tags: ['5.0 Rating', '1200+ Weddings', 'Vedic Expert'],
        is_featured: false,
        is_verified: true,
      },
      {
        name: 'DJ Naksh & Royal Band',
        slug: 'dj-naksh-royal-band',
        category: 'Music',
        location: 'Banjara Hills, Hyderabad',
        city: 'Hyderabad',
        state: 'Telangana',
        description: 'Top wedding DJ and live band. Bollywood, Telugu, Punjabi, Tamil — we play it all. Baraat dhol specialists.',
        long_description: 'DJ Naksh & Royal Band is Hyderabad\'s #1 entertainment team for weddings. Our 15-member band, dhol players, and DJ setup ensure non-stop energy from baraat to reception.\n\nEquipment: JBL Professional sound, LED dance floor, fog machines, and spot lights.',
        starting_price: 25000,
        rating: 4.8,
        review_count: 398,
        email: 'book@djnaksh.in',
        phone: '+91 98490 66778',
        images: [PHOTOS.guests, PHOTOS.couple, PHOTOS.lehenga],
        highlights: ['Baraat Dhol', 'Live Band (15 members)', 'DJ Setup', 'LED Dance Floor', 'Fog Machine', 'All Languages'],
        tags: ['Best in Hyderabad', 'Baraat Specialist', '15-member Band'],
        is_featured: false,
        is_verified: true,
      },
      {
        name: 'South Silk Weddings',
        slug: 'south-silk-weddings',
        category: 'Photography',
        location: 'Koramangala, Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        description: 'South Indian wedding specialists. Tamil, Telugu, Kannada and Malayali wedding traditions documented with authenticity and artistry.',
        long_description: 'South Silk Weddings is Bangalore\'s premier photography studio for South Indian weddings. We understand every ritual — from the Nalangu to the Muhurtham, the Sapta Padi to the Talambralu.\n\nBilingual team (Kannada, Tamil, Telugu, English).',
        starting_price: 55000,
        rating: 4.8,
        review_count: 203,
        email: 'hello@southsilkweddings.in',
        phone: '+91 80 4556 7788',
        images: [PHOTOS.south, PHOTOS.couple, PHOTOS.bride, PHOTOS.pheras],
        highlights: ['South Indian Specialist', 'All Traditions', 'Bilingual Team', 'Cinematic Videos', 'Drone Shots', 'Same-day Highlights'],
        tags: ['South India Expert', 'Best in Bangalore'],
        is_featured: false,
        is_verified: false,
      },
    ]

    for (const v of vendors) {
      await query(
        `INSERT INTO vendors (
           name, slug, category, location, city, state,
           description, long_description, starting_price, rating, review_count,
           email, phone, images, highlights, tags, is_featured, is_verified
         ) VALUES (
           $1,$2,$3,$4,$5,$6,
           $7,$8,$9,$10,$11,
           $12,$13,$14,$15,$16,$17,$18
         ) ON CONFLICT (slug) DO UPDATE SET
           description    = EXCLUDED.description,
           starting_price = EXCLUDED.starting_price,
           rating         = EXCLUDED.rating,
           review_count   = EXCLUDED.review_count,
           images         = EXCLUDED.images,
           is_featured    = EXCLUDED.is_featured,
           updated_at     = NOW()`,
        [
          v.name, v.slug, v.category, v.location, v.city, v.state,
          v.description, v.long_description, v.starting_price, v.rating, v.review_count,
          v.email, v.phone,
          v.images,       // JS array — pg driver converts to Postgres array automatically
          v.highlights,
          v.tags,
          v.is_featured, v.is_verified,
        ]
      )
      console.log(`  ✅ ${v.name}`)
    }

    // ── Packages for first vendor ─────────────────────────────────────
    const { rows: [vendor1] } = await query(
      `SELECT id FROM vendors WHERE slug = 'ritu-clicks-studio'`
    )
    if (vendor1) {
      await query(`DELETE FROM packages WHERE vendor_id = $1`, [vendor1.id])
      const pkgs = [
        { name: 'Mangal',    price: 45000,  inc: ['1 Photographer', '8 hours', '300+ edited photos', 'Online gallery', 'USB drive'] },
        { name: 'Shagun',    price: 90000,  inc: ['2 Photographers + Videographer', '12 hours', '600+ photos', 'Cinematic film', 'Drone footage', 'Pre-wedding shoot', 'Premium album'] },
        { name: 'Saptapadi', price: 175000, inc: ['Full team (4 people)', 'Unlimited hours', '1000+ photos', 'Feature-length film', 'Drone aerial', 'Pre & post wedding coverage', 'Same-day reel', 'Luxury album + prints'] },
      ]
      for (const p of pkgs) {
        await query(
          `INSERT INTO packages (vendor_id, name, price, includes) VALUES ($1,$2,$3,$4)`,
          [vendor1.id, p.name, p.price, p.inc]
        )
      }
      console.log('  ✅ Packages for Ritu Clicks Studio')
    }

    // ── Sample reviews ────────────────────────────────────────────────
    const { rows: [v1] } = await query(`SELECT id FROM vendors WHERE slug='ritu-clicks-studio'`)
    if (v1) {
      await query(`DELETE FROM reviews WHERE vendor_id = $1`, [v1.id])
      const reviews = [
        { name: 'Ananya & Rohan Kapoor',    rating: 5, text: 'Ritu didi ne hamare photos ko itna sundar banaya ke hum soch bhi nahi sakte the. Har ek moment capture kiya. 1000/10 recommend!', date: '2024-12-10' },
        { name: 'Sneha & Vikram Nair',       rating: 5, text: 'We had a South Indian wedding in Delhi and they understood every ritual perfectly. The shots of mala exchange and kanyadaan were stunning.', date: '2024-11-22' },
        { name: 'Divya & Arjun Malhotra',    rating: 5, text: 'Destination wedding in Udaipur. They captured every sunset, every dance. The feature film made our families cry with joy.', date: '2024-10-15' },
      ]
      for (const r of reviews) {
        await query(
          `INSERT INTO reviews (vendor_id, reviewer_name, rating, content, wedding_date)
           VALUES ($1,$2,$3,$4,$5)`,
          [v1.id, r.name, r.rating, r.text, r.date]
        )
      }
      console.log('  ✅ Reviews for Ritu Clicks Studio')
    }

    console.log('\n🎊 Seeding complete! Shaadi Baazaar is ready.\n')
  } catch (err) {
    console.error('\n❌ Seeding failed:', err.message)
    throw err
  }
}

if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}
