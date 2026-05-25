'use client'

import { useState, useEffect, useCallback } from 'react'

interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
  product_count: string
}

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function CategoriesPage() {
  const [cats, setCats]         = useState<Category[]>([])
  const [loading, setLoading]   = useState(true)
  const [editId, setEditId]     = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [editSort, setEditSort] = useState(0)
  const [newName, setNewName]   = useState('')
  const [newSlug, setNewSlug]   = useState('')
  const [newSort, setNewSort]   = useState(0)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  const fetchCats = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/categories')
      if (res.ok) setCats(await res.json())
      else setError('Could not load categories — make sure you have run database/add-categories.sql in Neon.')
    } catch {
      setError('Failed to connect. Check your DATABASE_URL.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCats() }, [fetchCats])

  function startEdit(c: Category) {
    setEditId(c.id); setEditName(c.name); setEditSlug(c.slug); setEditSort(c.sort_order)
  }
  function cancelEdit() { setEditId(null) }

  async function saveEdit(id: string) {
    setSaving(true); setError('')
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, slug: editSlug, sort_order: editSort }),
    })
    if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Error'); setSaving(false); return }
    setEditId(null)
    await fetchCats()
    setSaving(false)
  }

  async function handleDelete(id: string, name: string, count: string) {
    const msg = Number(count) > 0
      ? `"${name}" is used by ${count} product(s). Deleting it won't remove it from those products — it just won't appear in the storefront nav. Continue?`
      : `Delete category "${name}"?`
    if (!confirm(msg)) return
    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    await fetchCats()
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, slug: newSlug, sort_order: newSort }),
    })
    if (!res.ok) { const d = await res.json(); setError(d.error ?? 'Error'); setSaving(false); return }
    setNewName(''); setNewSlug(''); setNewSort(0)
    await fetchCats()
    setSaving(false)
  }

  const INPUT = 'w-full rounded-[6px] border border-[#dde4f0] bg-white px-2.5 py-1.5 font-poppins text-[12.5px] text-[#02034a] placeholder-[#a0aec0] focus:border-[#00B4D8] focus:outline-none transition'

  return (
    <div>
      <div className="mb-6">
        <span className="inline-flex items-center gap-[8px] font-poppins text-[11px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[14px] before:bg-[#00B4D8] before:content-['']">
          Products / Categories
        </span>
        <h1 className="mt-1 font-merriweather text-[26px] font-extrabold text-[#02034a]">Categories</h1>
        <p className="mt-1 font-poppins text-[13px] text-[#6b7280]">
          These tags group products in the storefront navigation. The storefront pulls this list directly from the admin.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-[8px] border border-red-100 bg-red-50 px-4 py-3 font-poppins text-[12.5px] text-red-500">
          {error}
        </div>
      )}

      {/* Category table */}
      <div className="rounded-2xl border border-[#dde4f0] bg-white shadow-[0_1px_3px_rgba(2,3,74,.06)] overflow-hidden mb-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#dde4f0] bg-[#f8faff]">
              <th className="w-16 px-4 py-3 text-left font-poppins text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">Order</th>
              <th className="px-4 py-3 text-left font-poppins text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">Name</th>
              <th className="px-4 py-3 text-left font-poppins text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">Slug</th>
              <th className="w-24 px-4 py-3 text-left font-poppins text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">Products</th>
              <th className="w-32 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f3f4f6]">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center font-poppins text-[13px] text-[#6b7280]">Loading…</td></tr>
            ) : cats.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center font-poppins text-[13px] text-[#6b7280]">No categories yet — add one below.</td></tr>
            ) : cats.map(c => (
              <tr key={c.id} className="hover:bg-[#fafbff] transition">
                {editId === c.id ? (
                  <>
                    <td className="px-3 py-2">
                      <input type="number" value={editSort} onChange={e => setEditSort(Number(e.target.value))} className={INPUT + ' w-14'} />
                    </td>
                    <td className="px-3 py-2">
                      <input value={editName} onChange={e => { setEditName(e.target.value); setEditSlug(slugify(e.target.value)) }} className={INPUT} />
                    </td>
                    <td className="px-3 py-2">
                      <input value={editSlug} onChange={e => setEditSlug(e.target.value)} className={INPUT + ' font-jetbrains text-[11.5px]'} />
                    </td>
                    <td className="px-4 py-2 font-poppins text-[12.5px] text-[#6b7280]">{c.product_count}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-1.5">
                        <button onClick={() => saveEdit(c.id)} disabled={saving}
                          className="rounded-[6px] bg-[#00B4D8] px-3 py-1 font-poppins text-[11px] font-bold text-white hover:bg-[#0094b3] transition disabled:opacity-50">
                          Save
                        </button>
                        <button onClick={cancelEdit} className="rounded-[6px] border border-[#dde4f0] px-3 py-1 font-poppins text-[11px] font-semibold text-[#6b7280] hover:text-[#02034a] transition">
                          Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 font-poppins text-[12.5px] text-[#6b7280]">{c.sort_order}</td>
                    <td className="px-4 py-3 font-poppins text-[13px] font-semibold text-[#02034a]">{c.name}</td>
                    <td className="px-4 py-3 font-jetbrains text-[11.5px] text-[#6b7280]">{c.slug}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-[rgba(2,3,74,.06)] px-2.5 py-[3px] font-poppins text-[11px] font-bold text-[#02034a]">
                        {c.product_count}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => startEdit(c)}
                          className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#dde4f0] text-[#6b7280] hover:border-[#00B4D8] hover:text-[#00B4D8] transition">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(c.id, c.name, c.product_count)}
                          className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#dde4f0] text-[#6b7280] hover:border-red-300 hover:text-red-500 transition">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add new category — separate from table to keep valid HTML */}
      <div className="rounded-2xl border border-[#dde4f0] bg-white p-5 shadow-[0_1px_3px_rgba(2,3,74,.06)]">
        <p className="mb-3 font-poppins text-[11px] font-bold uppercase tracking-[0.12em] text-[#02034a]">Add Category</p>
        <form onSubmit={handleAdd} className="flex items-end gap-3 flex-wrap">
          <div className="flex flex-col gap-1 w-14">
            <label className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-[#6b7280]">Order</label>
            <input type="number" value={newSort} onChange={e => setNewSort(Number(e.target.value))} className={INPUT} />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
            <label className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-[#6b7280]">Name</label>
            <input value={newName} onChange={e => { setNewName(e.target.value); setNewSlug(slugify(e.target.value)) }}
              placeholder="e.g. Women's Health" required className={INPUT} />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
            <label className="font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-[#6b7280]">Slug</label>
            <input value={newSlug} onChange={e => setNewSlug(e.target.value)}
              placeholder="womens-health" required className={INPUT + ' font-jetbrains text-[11.5px]'} />
          </div>
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#02034a] px-4 py-[9px] font-poppins text-[12px] font-bold text-white hover:bg-[#030466] transition disabled:opacity-50">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Add Category
          </button>
        </form>
      </div>
    </div>
  )
}
