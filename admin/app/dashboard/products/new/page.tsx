import { query } from '@/lib/db'
import ProductForm from '@/components/ProductForm'

export default async function NewProductPage() {
  const categories = await query<{ id: string; name: string; slug: string }>(
    'SELECT id, name, slug FROM categories ORDER BY sort_order, name'
  )

  return (
    <div>
      <div className="mb-6">
        <span className="inline-flex items-center gap-[8px] font-poppins text-[11px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[14px] before:bg-[#00B4D8] before:content-['']">
          Products / New
        </span>
        <h1 className="mt-1 font-merriweather text-[26px] font-extrabold text-[#02034a]">Add Product</h1>
      </div>

      <div className="rounded-2xl border border-[#dde4f0] bg-white p-6 shadow-[0_1px_3px_rgba(2,3,74,.06)]">
        <ProductForm mode="new" categories={categories} />
      </div>
    </div>
  )
}
