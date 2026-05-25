'use client'

import { useRouter } from 'next/navigation'

export default function ReportActions({ id }: { id: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Delete this report? This cannot be undone.')) return
    await fetch(`/api/reports/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="flex items-center gap-1">
      <a
        href={`/dashboard/reports/${id}`}
        className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#dde4f0] text-[#6b7280] hover:border-[#00B4D8] hover:text-[#00B4D8] transition"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </a>
      <button
        onClick={handleDelete}
        className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-[#dde4f0] text-[#6b7280] hover:border-red-300 hover:text-red-500 transition"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
        </svg>
      </button>
    </div>
  )
}
