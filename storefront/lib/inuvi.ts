const API_URL = (process.env.INUVI_API_URL ?? 'https://api.pulse.inuvi.co.uk').replace(/\/$/, '')

export interface InuviPatient {
  title: string             // "Mr" | "Mrs" | "Ms" | "Miss" | "Dr"
  gender: 'Male' | 'Female' | 'Unknown'
  firstName: string
  lastName: string
  dateOfBirth: string       // YYYY-MM-DD
  email: string
  phone: string
  addressLine1: string
  city: string
  postcode: string
  country: string
  clientRef: string         // our inuvi_orders.id
}

// Uses POST /api/v1.0/instructions - creates order + exam in a single call.
// Returns the Inuvi order Id from the response.
export async function submitInuviInstruction(
  patient: InuviPatient,
  requirementCode: string,
): Promise<{ orderId: string }> {
  const token = process.env.INUVI_ACCESS_TOKEN
  if (!token) throw new Error('INUVI_ACCESS_TOKEN not configured')

  const payload = {
    ClientRef: patient.clientRef,
    Customer: {
      Title: patient.title,
      Gender: patient.gender,
      FirstName: patient.firstName,
      LastName: patient.lastName,
      DateOfBirth: patient.dateOfBirth ? `${patient.dateOfBirth}T00:00:00` : undefined,
      MobilePhone: patient.phone,
      Email: patient.email,
      Addresses: [
        {
          AddressTypeId: 1,   // 1 = Home address (from GET /api/v1.0/applicantAddressTypes)
          AddressLine1: patient.addressLine1,
          City: patient.city,
          PostCode: patient.postcode || undefined,
          Country: patient.country || 'United Kingdom',
        },
      ],
    },
    Requirements: [
      { Code: requirementCode },
    ],
  }

  const res = await fetch(`${API_URL}/api/v1.0/instructions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const msg = await res.text().catch(() => '')
    throw new Error(`Inuvi /instructions ${res.status}: ${msg}`)
  }

  const data = await res.json()
  // Response is OrderResponseDTO - Id is the Inuvi order UUID
  return { orderId: data.Id ?? data.id }
}
