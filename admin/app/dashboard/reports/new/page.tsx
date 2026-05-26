import { query } from '@/lib/db'
import NewReportClient from './NewReportClient'

async function getData() {
  const [patients, products] = await Promise.all([
    query<{ id: string; first_name: string; last_name: string; email: string }>(
      `SELECT id, first_name, last_name, email FROM users WHERE role = 'patient' ORDER BY last_name, first_name`
    ),
    query<{ id: string; title: string }>(
      `SELECT id, title FROM products WHERE available = true ORDER BY title`
    ),
  ])
  return { patients, products }
}

export default async function NewReportPage() {
  const { patients, products } = await getData()
  return <NewReportClient patients={patients} products={products} />
}
