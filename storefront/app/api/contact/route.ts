import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend   = new Resend(process.env.RESEND_API_KEY)
const FROM     = process.env.FROM_EMAIL   ?? 'AiwasLabs <noreply@aiwaslabs.co.uk>'
const DOCTOR   = process.env.DOCTOR_EMAIL ?? 'admin@aiwas.co.uk'

export async function POST(req: NextRequest) {
  const { name, email, phone, subject, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 })
  }

  const subjectLabel = subject || 'General Enquiry'

  // Alert to clinic
  resend.emails.send({
    from: FROM,
    to: DOCTOR,
    replyTo: email,
    subject: `New Enquiry: ${subjectLabel} - ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:10px;border:1px solid #dde4f0;overflow:hidden">
        <div style="background:#02034a;padding:24px 28px">
          <p style="color:#00B4D8;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.15em;margin:0">New Contact Form Submission</p>
          <h2 style="color:#fff;font-size:20px;font-weight:700;margin:6px 0 0">${subjectLabel}</h2>
        </div>
        <div style="padding:24px 28px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:8px 0;color:#6b7280;width:90px">Name</td><td style="padding:8px 0;color:#02034a;font-weight:600">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#00B4D8">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding:8px 0;color:#6b7280">Phone</td><td style="padding:8px 0;color:#02034a">${phone}</td></tr>` : ''}
          </table>
          <div style="margin-top:16px;background:#f7f6fc;border-radius:8px;padding:16px">
            <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#9ca3af">Message</p>
            <p style="margin:0;font-size:14px;color:#374151;line-height:1.7;white-space:pre-wrap">${message}</p>
          </div>
        </div>
      </div>
    `,
  }).catch(console.error)

  // Auto-reply to sender
  resend.emails.send({
    from: FROM,
    to: email,
    subject: 'We received your message - AiwasLabs',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:10px;border:1px solid #dde4f0;overflow:hidden">
        <div style="background:#02034a;padding:24px 28px;text-align:center">
          <img src="https://res.cloudinary.com/dky6bti4g/image/upload/v1760604400/Logo_Transparent_ks8ufb.png" alt="AiwasLabs" style="height:32px">
        </div>
        <div style="padding:28px">
          <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 14px">Hi ${name},</p>
          <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 14px">
            Thanks for getting in touch. We've received your message and one of our team will get back to you within <strong>1 working day</strong>.
          </p>
          <p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 20px">
            If you need to book a test urgently, you can do so directly online or call us on <strong>01782 917963</strong>.
          </p>
          <a href="https://aiwaslabs.co.uk/products" style="display:inline-block;background:#00B4D8;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 24px;border-radius:8px">Book a Test</a>
        </div>
        <div style="padding:16px 28px;background:#f7f6fc;border-top:1px solid #e5e7eb;text-align:center">
          <p style="margin:0;font-size:12px;color:#9ca3af">AiwasLabs · Unit 6, Parkhall Business Village · Stoke-on-Trent ST3 5XA<br>01782 917963 · Aiwas@aiwasmedical.com</p>
        </div>
      </div>
    `,
  }).catch(console.error)

  return NextResponse.json({ ok: true })
}
