// Creates the first admin user in the database
// Run once: node database/seed-admin.js
// Change the email/password below before running

const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const EMAIL    = 'admin@aiwas.co.uk'
const PASSWORD = 'AiwasAdmin2024!'

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  })

  const hash = await bcrypt.hash(PASSWORD, 12)

  await pool.query(
    `INSERT INTO users (email, password_hash, role, first_name, last_name)
     VALUES ($1, $2, 'admin', 'Dr', 'Tanzil')
     ON CONFLICT (email) DO UPDATE SET password_hash = $2`,
    [EMAIL, hash]
  )

  console.log(`✓ Admin user created: ${EMAIL}`)
  console.log(`  Password: ${PASSWORD}`)
  console.log('  Change this password after first login.')
  await pool.end()
}

seed().catch(err => { console.error(err); process.exit(1) })
