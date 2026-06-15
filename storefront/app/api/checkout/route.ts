import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { getPatientSession } from '@/lib/auth'
import { submitInuviInstruction } from '@/lib/inuvi'
import { sendHomeKitConfirmation, sendDoctorHomeKitAlert } from '@/lib/email'

export async function POST(req: NextRequest) {
  const session = await getPatientSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json()
  const {
    title, gender,
    delivery_phone,
    date_of_birth,
    address_line1, city, postcode, country,
  } = body

  if (!address_line1?.trim()) return NextResponse.json({ error: 'Address line 1 is required' }, { status: 400 })
  if (!city?.trim())          return NextResponse.json({ error: 'City is required' }, { status: 400 })
  if (!delivery_phone?.trim()) return NextResponse.json({ error: 'Phone number is required' }, { status: 400 })

  const cleanPhone  = String(delivery_phone).slice(0, 30).trim()
  const cleanLine1  = String(address_line1).slice(0, 250).trim()
  const cleanCity   = String(city).slice(0, 250).trim()
  const cleanPost   = postcode ? String(postcode).slice(0, 20).trim() : ''
  const cleanCountry = country ? String(country).slice(0, 250).trim() : 'United Kingdom'
  const cleanDob    = date_of_birth ? String(date_of_birth) : null
  const cleanTitle  = title ? String(title).slice(0, 20).trim() : 'Mr'
  const cleanGender = ['Male', 'Female', 'Unknown'].includes(gender) ? gender : 'Unknown'

  // Combined address string for display/storage
  const fullAddress = [cleanLine1, cleanCity, cleanPost, cleanCountry].filter(Boolean).join(', ')

  // Fetch all cart items with product details
  const cartItems = await query<{
    cart_id: string
    product_id: string
    product_title: string
    inuvi_requirement_code: string | null
  }>(
    `SELECT ci.id AS cart_id, ci.product_id,
            p.title AS product_title,
            p.inuvi_requirement_code
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id
     WHERE ci.patient_id = $1`,
    [session.id]
  )

  if (cartItems.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  // Update patient profile with latest details
  await query(
    `UPDATE users
     SET phone = $1, address = $2, date_of_birth = COALESCE($3, date_of_birth)
     WHERE id = $4`,
    [cleanPhone, fullAddress, cleanDob, session.id]
  )

  const orderIds: string[] = []

  for (const item of cartItems) {
    // Create inuvi_orders record
    const [rec] = await query<{ id: string }>(
      `INSERT INTO inuvi_orders
         (patient_id, product_id, delivery_name, delivery_email, delivery_phone, delivery_address, date_of_birth)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        session.id,
        item.product_id,
        `${session.first_name} ${session.last_name}`,
        session.email,
        cleanPhone,
        fullAddress,
        cleanDob,
      ]
    )

    orderIds.push(rec.id)

    // Submit to Inuvi if credentials + requirement code are configured
    if (process.env.INUVI_ACCESS_TOKEN && item.inuvi_requirement_code) {
      try {
        const { orderId } = await submitInuviInstruction(
          {
            title: cleanTitle,
            gender: cleanGender as 'Male' | 'Female' | 'Unknown',
            firstName: session.first_name,
            lastName: session.last_name,
            dateOfBirth: cleanDob ?? '',
            email: session.email,
            phone: cleanPhone,
            addressLine1: cleanLine1,
            city: cleanCity,
            postcode: cleanPost,
            country: cleanCountry,
            clientRef: rec.id,
          },
          item.inuvi_requirement_code,
        )

        await query(
          `UPDATE inuvi_orders SET inuvi_order_id = $1, status = 'submitted' WHERE id = $2`,
          [orderId, rec.id]
        )
      } catch (err) {
        console.error(`[Inuvi] failed for order ${rec.id}:`, err)
        // Order stays as 'pending' - visible in admin for manual retry
      }
    }
  }

  // Clear the patient's cart
  await query(`DELETE FROM cart_items WHERE patient_id = $1`, [session.id])

  // Send order confirmation emails (non-blocking)
  const items = cartItems.map(i => ({ title: i.product_title }))
  const emailBase = {
    firstName: session.first_name,
    lastName: session.last_name,
    email: session.email,
    phone: cleanPhone,
    items,
    orderIds,
    deliveryAddress: fullAddress,
  }
  await Promise.all([
    sendHomeKitConfirmation(emailBase),
    sendDoctorHomeKitAlert(emailBase),
  ])

  return NextResponse.json({ order_ids: orderIds }, { status: 201 })
}
