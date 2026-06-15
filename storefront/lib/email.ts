import { Resend } from 'resend'

const resend   = new Resend(process.env.RESEND_API_KEY)
const FROM     = process.env.FROM_EMAIL     ?? 'AiwasLabs <noreply@aiwaslabs.co.uk>'
const DOCTOR   = process.env.DOCTOR_EMAIL   ?? 'admin@aiwas.co.uk'
const BASE_URL = process.env.STOREFRONT_URL ?? 'https://aiwaslabs.co.uk'

// ── Shared styles ─────────────────────────────────────────────────────────────
const css = `
  body{margin:0;padding:0;background:#f7f6fc;font-family:'Helvetica Neue',Arial,sans-serif}
  .wrap{max-width:580px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(2,3,74,.08)}
  .hdr{background:#02034a;padding:28px 32px;text-align:center}
  .hdr img{height:36px}
  .hdr h1{color:#fff;font-size:20px;font-weight:700;margin:10px 0 0}
  .body{padding:32px}
  .body p{color:#374151;font-size:15px;line-height:1.6;margin:0 0 16px}
  .detail-box{background:#f7f6fc;border-radius:8px;padding:16px 20px;margin:20px 0}
  .detail-box p{margin:4px 0;font-size:14px;color:#374151}
  .detail-box strong{color:#02034a}
  .btn{display:inline-block;margin:20px 0;padding:12px 28px;background:#02034a;color:#fff!important;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px}
  .ftr{padding:20px 32px;background:#f7f6fc;text-align:center;border-top:1px solid #e5e7eb}
  .ftr p{color:#9ca3af;font-size:12px;margin:0}
`

function base(title: string, bodyHtml: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>${css}</style></head>
<body><div class="wrap">
  <div class="hdr">
    <img src="https://res.cloudinary.com/dky6bti4g/image/upload/v1760604400/Logo_Transparent_ks8ufb.png" alt="AiwasLabs">
    <h1>${title}</h1>
  </div>
  <div class="body">${bodyHtml}</div>
  <div class="ftr">
    <p>AiwasLabs · Private Blood Testing Clinic<br>
    📞 01782 917963 &nbsp;·&nbsp; 📧 Aiwas@aiwasmedical.com</p>
  </div>
</div></body></html>`
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

// ── 1. Patient booking confirmation ──────────────────────────────────────────
export async function sendBookingConfirmation(p: {
  firstName: string; lastName: string; email: string
  productTitle: string; bookingDate: string; bookingTime: string
  bookingType: string; bookingId: string
}) {
  const typeLabel = p.bookingType === 'clinic' ? 'Clinic Visit' : 'Home Visit'
  const html = base('Booking Confirmed', `
    <p>Hi ${p.firstName},</p>
    <p>Your booking is confirmed. We look forward to seeing you!</p>
    <div class="detail-box">
      <p><strong>Test:</strong> ${p.productTitle}</p>
      <p><strong>Date:</strong> ${fmt(p.bookingDate)}</p>
      <p><strong>Time:</strong> ${p.bookingTime}</p>
      <p><strong>Type:</strong> ${typeLabel}</p>
      <p><strong>Reference:</strong> #${p.bookingId.slice(0, 8).toUpperCase()}</p>
    </div>
    <p>Please arrive 5 minutes early and bring a valid form of ID. Avoid heavy exercise or alcohol 24 hours before your test.</p>
    <a href="${BASE_URL}/account" class="btn">View My Bookings</a>
    <p>Need to reschedule? Call us on <strong>01782 917963</strong> or reply to this email.</p>
  `)
  await resend.emails.send({ from: FROM, to: p.email, subject: `Booking Confirmed – ${p.productTitle}`, html }).catch(console.error)
}

// ── 2. Doctor: new booking alert ──────────────────────────────────────────────
export async function sendDoctorBookingAlert(p: {
  firstName: string; lastName: string; email: string; phone: string
  productTitle: string; bookingDate: string; bookingTime: string
  bookingType: string; bookingId: string
}) {
  const typeLabel = p.bookingType === 'clinic' ? 'Clinic Visit' : 'Home Visit'
  const html = base('New Booking Received', `
    <p>A new booking has been made.</p>
    <div class="detail-box">
      <p><strong>Patient:</strong> ${p.firstName} ${p.lastName}</p>
      <p><strong>Email:</strong> ${p.email}</p>
      <p><strong>Phone:</strong> ${p.phone}</p>
      <p><strong>Test:</strong> ${p.productTitle}</p>
      <p><strong>Date:</strong> ${fmt(p.bookingDate)}</p>
      <p><strong>Time:</strong> ${p.bookingTime}</p>
      <p><strong>Type:</strong> ${typeLabel}</p>
      <p><strong>Reference:</strong> #${p.bookingId.slice(0, 8).toUpperCase()}</p>
    </div>
    <a href="http://localhost:3000/dashboard/calendar" class="btn">View Calendar</a>
  `)
  await resend.emails.send({ from: FROM, to: DOCTOR, subject: `New Booking – ${p.firstName} ${p.lastName} · ${p.productTitle}`, html }).catch(console.error)
}

// ── 3. Patient: welcome email on registration ─────────────────────────────────
export async function sendWelcomeEmail(p: { firstName: string; email: string }) {
  const html = base('Welcome to AiwasLabs', `
    <p>Hi ${p.firstName},</p>
    <p>Welcome to AiwasLabs - your private blood testing clinic. Your account is now set up and ready to go.</p>
    <p>From your account you can:</p>
    <ul style="color:#374151;font-size:15px;line-height:1.8;padding-left:20px">
      <li>Book clinic and home visit tests</li>
      <li>Order home test kits</li>
      <li>Access your results and reports online</li>
    </ul>
    <a href="${BASE_URL}/products" class="btn">Browse Tests</a>
    <p>If you have any questions, don't hesitate to get in touch.</p>
  `)
  await resend.emails.send({ from: FROM, to: p.email, subject: 'Welcome to AiwasLabs', html }).catch(console.error)
}

// ── 4. Patient: home kit order confirmation ───────────────────────────────────
export async function sendHomeKitConfirmation(p: {
  firstName: string; email: string
  items: { title: string }[]; orderIds: string[]
}) {
  const itemList = p.items.map(i => `<li>${i.title}</li>`).join('')
  const ref = (ids: string[]) => ids.map(id => `#${id.slice(0, 8).toUpperCase()}`).join(', ')
  const html = base('Home Kit Order Confirmed', `
    <p>Hi ${p.firstName},</p>
    <p>Your home test kit order has been placed. Your kit(s) will be dispatched and an examiner will be in touch to arrange collection.</p>
    <div class="detail-box">
      <p><strong>Tests ordered:</strong></p>
      <ul style="margin:6px 0;padding-left:20px;font-size:14px;color:#374151">${itemList}</ul>
      <p style="margin-top:10px"><strong>Order reference:</strong> ${ref(p.orderIds)}</p>
    </div>
    <a href="${BASE_URL}/account" class="btn">Track My Order</a>
    <p>Questions? Call us on <strong>01782 917963</strong>.</p>
  `)
  await resend.emails.send({ from: FROM, to: p.email, subject: 'Home Kit Order Confirmed', html }).catch(console.error)
}

// ── 5. Password reset ─────────────────────────────────────────────────────────
export async function sendPasswordResetEmail(p: { firstName: string; email: string; token: string }) {
  const link = `${BASE_URL}/account/reset-password?token=${p.token}`
  const html = base('Reset Your Password', `
    <p>Hi ${p.firstName},</p>
    <p>We received a request to reset the password on your AiwasLabs account. Click the button below - this link expires in <strong>1 hour</strong>.</p>
    <a href="${link}" class="btn">Reset Password</a>
    <p style="font-size:13px;color:#6b7280">If you didn't request a password reset, you can safely ignore this email. Your password won't change.</p>
    <p style="font-size:12px;color:#9ca3af;word-break:break-all">Or copy this link: ${link}</p>
  `)
  await resend.emails.send({ from: FROM, to: p.email, subject: 'Reset your AiwasLabs password', html }).catch(console.error)
}

// ── 6. Email verification ─────────────────────────────────────────────────────
export async function sendVerificationEmail(p: { firstName: string; email: string; token: string }) {
  const link = `${BASE_URL}/api/auth/verify-email?token=${p.token}`
  const html = base('Verify Your Email', `
    <p>Hi ${p.firstName},</p>
    <p>Please verify your email address to activate your AiwasLabs account. Click the button below - this link expires in <strong>24 hours</strong>.</p>
    <a href="${link}" class="btn">Verify Email Address</a>
    <p style="font-size:13px;color:#6b7280">If you didn't create an account, you can safely ignore this email.</p>
    <p style="font-size:12px;color:#9ca3af;word-break:break-all">Or copy this link: ${link}</p>
  `)
  await resend.emails.send({ from: FROM, to: p.email, subject: 'Verify your AiwasLabs email address', html }).catch(console.error)
}

// ── 6. Doctor: new home kit order alert ──────────────────────────────────────
export async function sendDoctorHomeKitAlert(p: {
  firstName: string; lastName: string; email: string; phone: string
  items: { title: string }[]; orderIds: string[]
  deliveryAddress: string
}) {
  const itemList = p.items.map(i => `<li>${i.title}</li>`).join('')
  const html = base('New Home Kit Order', `
    <p>A patient has placed a home kit order.</p>
    <div class="detail-box">
      <p><strong>Patient:</strong> ${p.firstName} ${p.lastName}</p>
      <p><strong>Email:</strong> ${p.email}</p>
      <p><strong>Phone:</strong> ${p.phone}</p>
      <p><strong>Delivery address:</strong> ${p.deliveryAddress}</p>
      <p><strong>Tests:</strong></p>
      <ul style="margin:4px 0;padding-left:20px;font-size:14px">${itemList}</ul>
    </div>
    <a href="http://localhost:3000/dashboard" class="btn">View Dashboard</a>
  `)
  await resend.emails.send({ from: FROM, to: DOCTOR, subject: `New Home Kit Order – ${p.firstName} ${p.lastName}`, html }).catch(console.error)
}
