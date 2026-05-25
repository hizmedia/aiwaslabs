import { notFound } from 'next/navigation'
import { query } from '@/lib/db'
import ProductForm from '@/components/ProductForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [categories, products] = await Promise.all([
    query<{ id: string; name: string; slug: string }>(
      'SELECT id, name, slug FROM categories ORDER BY sort_order, name'
    ),
    query<{
      id: string
      title: string
      slug: string
      description: string
      price: string
      biomarker_count: number
      badge: string | null
      product_type: 'booking' | 'ship' | 'both'
      available: boolean
      category_tags: string[]
      images: string[]
      faqs: { question: string; answer: string }[]
      test_info: unknown
    }>(`
      SELECT p.*,
             COALESCE(json_agg(f ORDER BY f.sort_order) FILTER (WHERE f.id IS NOT NULL), '[]') AS faqs
      FROM products p
      LEFT JOIN faqs f ON f.product_id = p.id
      WHERE p.id = $1
      GROUP BY p.id
    `, [id]),
  ])

  const product = products[0]
  if (!product) notFound()

  return (
    <div>
      <div className="mb-6">
        <span className="inline-flex items-center gap-[8px] font-poppins text-[11px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[14px] before:bg-[#00B4D8] before:content-['']">
          Products / Edit
        </span>
        <h1 className="mt-1 font-merriweather text-[26px] font-extrabold text-[#02034a]">{product.title}</h1>
      </div>

      <div className="rounded-2xl border border-[#dde4f0] bg-white p-6 shadow-[0_1px_3px_rgba(2,3,74,.06)]">
        <ProductForm
          mode="edit"
          id={product.id}
          categories={categories}
          initial={{
            title: product.title,
            slug: product.slug,
            description: product.description,
            price: product.price,
            biomarker_count: String(product.biomarker_count),
            badge: product.badge ?? '',
            product_type: product.product_type,
            available: product.available,
            category_tags: product.category_tags,
            images: product.images.length ? product.images : [''],
            faqs: product.faqs.length ? product.faqs : [{ question: '', answer: '' }],
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            test_info: (product.test_info as any) ?? null,
          }}
        />
      </div>
    </div>
  )
}
