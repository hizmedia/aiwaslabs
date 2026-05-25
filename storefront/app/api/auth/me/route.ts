import { NextResponse } from 'next/server'
import { getPatientSession } from '@/lib/auth'

export async function GET() {
  const session = await getPatientSession()
  if (!session) return NextResponse.json(null)
  return NextResponse.json(session)
}
