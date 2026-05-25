import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const SECRET = process.env.JWT_SECRET!

export interface PatientPayload {
  id: string
  email: string
  first_name: string
  last_name: string
  role: 'patient'
}

export function signToken(payload: PatientPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): PatientPayload | null {
  try {
    return jwt.verify(token, SECRET) as PatientPayload
  } catch {
    return null
  }
}

export async function getPatientSession(): Promise<PatientPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('patient_token')?.value
  if (!token) return null
  return verifyToken(token)
}
