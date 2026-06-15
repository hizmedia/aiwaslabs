import { Resend } from 'resend'

const resend   = new Resend(process.env.RESEND_API_KEY)
const FROM     = process.env.FROM_EMAIL     ?? 'AiwasLabs <noreply@aiwaslabs.co.uk>'
const BASE_URL = process.env.STOREFRONT_URL ?? 'https://aiwaslabs.co.uk'

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
  .btn{display:inline-block;margin:20px 0;padding:12px 28px;background:#0DAB76;color:#fff!important;text-decoration:none;border-radius:8px;font-weight:700;font-size:14px}
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

// ── Patient: report ready notification ───────────────────────────────────────
export async function sendReportReady(p: {
  firstName: string; lastName: string; email: string
  productTitle: string; reportId: string; sampleDate: string | null
}) {
  const dateStr = p.sampleDate
    ? new Date(p.sampleDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'recently'

  const html = base('Your Results Are Ready', `
    <p>Hi ${p.firstName},</p>
    <p>Great news — your <strong>${p.productTitle}</strong> results from ${dateStr} have been finalised and are ready to view.</p>
    <p>Your full report is now available in your AiwasLabs account. Log in to see your detailed results, biomarker breakdown, and any personalised notes from our team.</p>
    <a href="${BASE_URL}/account/reports/${p.reportId}" class="btn">View My Results</a>
    <p style="font-size:13px;color:#6b7280">If you have questions about your results, please contact us and we'll be happy to help.</p>
    <div class="detail-box">
      <p><strong>Test:</strong> ${p.productTitle}</p>
      <p><strong>Sample date:</strong> ${dateStr}</p>
      <p><strong>Report reference:</strong> #${p.reportId.slice(0, 8).toUpperCase()}</p>
    </div>
    <p style="font-size:13px;color:#6b7280;font-style:italic">This report is for informational purposes only and does not replace assessment by a registered medical practitioner.</p>
  `)

  await resend.emails.send({
    from: FROM,
    to: p.email,
    subject: `Your ${p.productTitle} Results Are Ready`,
    html,
  }).catch(console.error)
}
