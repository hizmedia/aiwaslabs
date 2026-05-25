import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F6FC]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-[#dde4f0] bg-white px-6 py-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="inline-block h-[6px] w-[6px] rounded-full bg-[#0DAB76] shadow-[0_0_0_3px_rgba(13,171,118,.18)]" />
            <span className="font-poppins text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
              Dashboard · Live
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-[#dde4f0] bg-[#F7F6FC] px-3 py-[5px]">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#02034a]">
                <span className="font-merriweather text-[10px] font-extrabold text-[#00B4D8]">
                  {session.email[0].toUpperCase()}
                </span>
              </div>
              <span className="font-poppins text-[12px] font-semibold text-[#02034a]">
                {session.email}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
