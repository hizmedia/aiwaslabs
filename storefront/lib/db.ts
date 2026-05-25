import { Pool } from 'pg'

const globalForPg = globalThis as unknown as { pool: Pool }

export const pool = globalForPg.pool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
})

if (process.env.NODE_ENV !== 'production') globalForPg.pool = pool

export async function query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
  const { rows } = await pool.query(text, params)
  return rows as T[]
}
