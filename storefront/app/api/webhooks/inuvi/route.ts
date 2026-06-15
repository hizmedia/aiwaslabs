import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { query } from '@/lib/db'

export const runtime = 'nodejs'

// Inuvi event code → our internal status
// Event codes from Inuvi Pulse API docs (section: Webhooks > Event Types)
const EVENT_STATUS_MAP: Record<number, string> = {
  601: 'submitted',       // New Order Creation Completed
  603: 'submitted',       // Assigned to Examiner
  605: 'kit_dispatched',  // Scheduled Exam
  606: 'kit_dispatched',  // Rescheduled Exam
  610: 'results_ready',   // Completed
  611: 'results_ready',   // Completed with Problems
  614: 'cancelled',       // Status updated to Cancelled
  655: 'cancelled',       // Cancelled due to 90 days inactivity
}

export async function HEAD() {
  // Inuvi validates the webhook URL with a HEAD request first
  return new NextResponse(null, { status: 200 })
}

export async function POST(req: NextRequest) {
  // Read raw body once - needed for HMAC verification
  const rawBody = await req.text()

  // Verify HMAC-SHA256 signature if webhook key is configured
  const webhookKey = process.env.INUVI_WEBHOOK_SECRET
  if (webhookKey) {
    const incomingSig = req.headers.get('webhook-signature') ?? ''
    const expectedSig = createHmac('sha256', webhookKey)
      .update(rawBody, 'utf8')
      .digest('base64')

    if (incomingSig !== expectedSig) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  let body: Record<string, unknown>
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Inuvi webhook payload contains OrderId and EventCode
  const orderId    = (body.OrderId ?? body.orderId) as string | undefined
  const eventCode  = (body.EventCode ?? body.eventCode) as number | undefined
  const rawStatus  = String(body.EventDescription ?? body.eventDescription ?? eventCode ?? 'unknown')

  if (!orderId) {
    return NextResponse.json({ error: 'OrderId required' }, { status: 400 })
  }

  const mappedStatus = eventCode !== undefined ? EVENT_STATUS_MAP[eventCode] : undefined

  if (mappedStatus) {
    await query(
      `UPDATE inuvi_orders SET status = $1, inuvi_status_raw = $2 WHERE inuvi_order_id = $3`,
      [mappedStatus, rawStatus, orderId]
    )
  } else {
    // Unknown event code - store raw description only
    await query(
      `UPDATE inuvi_orders SET inuvi_status_raw = $1 WHERE inuvi_order_id = $2`,
      [rawStatus, orderId]
    )
  }

  return NextResponse.json({ ok: true })
}
