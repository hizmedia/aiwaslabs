'use client'

import { groupByCategory, type BiomarkerRow, type Category } from '@/lib/biomarker-categories'

interface Report {
  id: string
  sample_date: string
  notes: string | null
  biomarkers: BiomarkerRow[]
  document_json: {
    personalized_enabled?: boolean
    personalized_content?: string
    category_notes?: Record<string, string>
  } | null
  product_title: string
  first_name: string
  last_name: string
  email: string
}

const FLAG_CLS: Record<string, string> = {
  HIGH:   'text-[#D00000] font-bold',
  LOW:    'text-[#ff8c00] font-bold',
  Normal: 'text-[#228B22] font-bold',
  NORMAL: 'text-[#228B22] font-bold',
}

const COVER_DISCLAIMER = `<p><strong>Clinical Note:</strong> This interpretation is based on the blood results at the time of testing only and must be considered alongside clinical history, examination findings, medications, supplements, and any subsequent results. Blood markers can change over time and a single test does not provide a diagnosis in isolation.</p>
<p style="margin-top:10px"><strong>Follow-Up Responsibility:</strong> Abnormal or borderline results identified in this report require follow-up through the patient's GP or treating clinician, who will assume responsibility for ongoing monitoring, investigation, and treatment where appropriate.</p>
<p style="margin-top:10px"><strong>Safety Notice:</strong> If new, worsening, or concerning symptoms develop after this test such as chest pain, severe abdominal pain, shortness of breath, neurological symptoms, or jaundice, urgent medical assessment should be sought regardless of these results. This report is intended for informational purposes only and does not replace assessment by a registered medical practitioner.</p>`

function flagStyle(flag: string | null) {
  if (flag === 'HIGH') return 'color:#D00000;font-weight:700'
  if (flag === 'LOW') return 'color:#ff8c00;font-weight:700'
  if (flag === 'Normal' || flag === 'NORMAL') return 'color:#228B22;font-weight:700'
  return 'color:#0d104b'
}

function buildPrintHtml(opts: {
  firstName: string; lastName: string; email: string; productTitle: string
  formattedDate: string; bioCount: number
  personalizedEnabled: boolean; personalizedHtml: string
  categories: Category[]; catNotes: Record<string, string>
}) {
  const { firstName, lastName, email, productTitle, formattedDate, bioCount, personalizedEnabled, personalizedHtml, categories, catNotes } = opts
  const LOGO = 'https://res.cloudinary.com/dky6bti4g/image/upload/v1760604400/Logo_Transparent_ks8ufb.png'
  const STAMP = 'https://res.cloudinary.com/dky6bti4g/image/upload/v1764791068/Shabby_stamp_n5u6e7.png'

  const page = (content: string) => `<div class="page">${content}</div>`

  const coverPage = page(`
    <div class="page-content">
      <div class="header"><img src="${LOGO}" class="logo" alt="AiwasLabs"><div class="header-title">${formattedDate}</div></div>
      <p class="patient-name">${firstName} ${lastName}</p>
      <h1 class="title">${productTitle}</h1>
      <p class="biomarkers">- ${bioCount} BIOMARKERS</p>
      <div class="body-text"><p><span class="body-heading">Clinical Note:</span> This interpretation is based on the blood results at the time of testing only and must be considered alongside <strong>clinical history, examination findings, medications, supplements,</strong> and any subsequent results. Blood markers can change over time and <strong>a single test does not provide a diagnosis in isolation.</strong></p>
      <p style="margin-top:12px"><span class="body-heading">Follow-Up Responsibility:</span> Abnormal or borderline results identified in this report require follow-up through the patient's <strong>GP or treating clinician,</strong> who will assume responsibility for <strong>ongoing monitoring, investigation, and treatment</strong> where appropriate.</p>
      <p style="margin-top:12px"><span class="body-heading">Safety Notice:</span> If <strong>new, worsening, or concerning symptoms</strong> develop after this test, <strong>urgent medical assessment should be sought.</strong> This report is intended for <strong>informational purposes only</strong> and does not replace assessment by a <strong>registered medical practitioner.</strong></p></div>
      <p class="contact" style="margin-top:44px">📞 01782 917963</p>
      <p class="contact">📧 Aiwas@aiwasmedical.com</p>
      <p class="contact">📸 @Aiwaslabs</p>
    </div>
    <p class="footer-text page-footer">This report is intended for informational purposes and does not replace assessment by a registered medical practitioner.</p>
  `)

  const personalizedPage = personalizedEnabled ? page(`
    <div class="page-content">
      <div class="cat-header"><img src="${LOGO}" class="logo" alt="AiwasLabs"><div class="cat-title">Personalised Report</div></div>
      <p class="general-comment">DOCTOR'S NOTE</p>
      <div class="note-text" style="min-height:200px">${personalizedHtml}</div>
    </div>
    <div class="category-footer">AiwasLabs · Private Blood Testing · ${formattedDate}<img src="${STAMP}" class="footer-stamp" alt=""></div>
  `) : ''

  const patientInfo = `
    <div class="patient-info">
      <div class="patient-info-left">
        <p class="patient-info-item"><strong>Patient:</strong> ${firstName} ${lastName}</p>
        <p class="patient-info-item"><strong>Email:</strong> ${email}</p>
      </div>
      <div class="patient-info-right">
        <p class="patient-info-item"><strong>Test:</strong> ${productTitle}</p>
        <p class="patient-info-item"><strong>Sample Date:</strong> ${formattedDate}</p>
      </div>
    </div>`

  const categoryPages = categories.map((cat, i) => {
    const rows = cat.rows.map(b => `
      <tr>
        <td>${b.name}</td>
        <td><strong style="${flagStyle(b.flag)}">${b.value ?? '-'}</strong></td>
        <td class="flag-${b.flag ?? 'NA'}">${b.flag || '–'}</td>
        <td>${b.unit ?? ''}</td>
        <td>${b.reference_range ?? ''}</td>
      </tr>`).join('')

    const note = catNotes[cat.name] ?? ''
    return `<div class="category-page" style="page-break-before:${i === 0 && !personalizedEnabled ? 'auto' : 'always'}">
      <div class="page-content">
        <div class="cat-header"><img src="${LOGO}" class="logo" alt="AiwasLabs"><div class="cat-title">${cat.name}</div></div>
        ${i === 0 ? patientInfo : ''}
        <p class="general-comment">GENERAL COMMENT</p>
        <table>
          <thead><tr><th>TEST</th><th>RESULT</th><th>FLAG</th><th>UNITS</th><th>REFERENCE INTERVAL</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        ${note ? `<div class="note-section"><p class="note-title">NOTE</p><div class="note-text">${note}</div></div>` : ''}
      </div>
      <div class="category-footer">AiwasLabs · Private Blood Testing · ${formattedDate}<img src="${STAMP}" class="footer-stamp" alt=""></div>
    </div>`
  }).join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Lab Report - ${firstName} ${lastName}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Roboto:wght@400;600;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Roboto',Arial,sans-serif; color:#0d104b; background:white; }
  .page { width:210mm; height:297mm; padding:12mm; padding-bottom:16mm; background:white; position:relative; display:flex; flex-direction:column; page-break-after:always; }
  .page:last-child { page-break-after:auto; }
  .page-content { flex:1; }
  .page-footer { margin-top:auto; }
  .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; padding-bottom:15px; border-bottom:2px solid #0d104b; }
  .header-title { font-family:'Merriweather',serif; font-size:20pt; font-weight:700; color:#0d104b; }
  .patient-name { font-family:'Merriweather',serif; font-size:44pt; font-weight:700; color:#0d104b; line-height:1.15; margin-bottom:14px; }
  .title { font-family:'Merriweather',serif; font-size:36pt; font-weight:700; color:#0d104b; line-height:1.15; margin-bottom:28px; }
  .biomarkers { font-size:24pt; margin-bottom:36px; font-weight:600; color:#0d104b; }
  .body-heading { font-size:13pt; font-weight:700; text-decoration:underline; }
  .body-text { font-size:11pt; line-height:1.6; margin-bottom:14px; text-align:justify; color:#0d104b; }
  .contact { display:flex; align-items:center; gap:8px; font-size:12pt; margin-bottom:7px; color:#0d104b; }
  .footer-text { font-size:8.5pt; font-style:italic; font-weight:700; text-align:center; margin-top:36px; padding-top:16px; border-top:1px solid #ccc; color:#333; }
  .logo { max-width:180px; height:auto; }
  .category-page { width:210mm; min-height:297mm; padding:12mm; padding-bottom:16mm; background:white; position:relative; display:flex; flex-direction:column; }
  .cat-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; padding-bottom:15px; border-bottom:2px solid #666; }
  .cat-title { font-family:'Merriweather',serif; font-size:18pt; font-weight:700; color:#0d104b; text-align:right; }
  .patient-info { margin-bottom:20px; display:flex; gap:10px; }
  .patient-info-left,.patient-info-right { flex:1; border:2px solid #CFCFCF; padding:8px 12px; border-radius:8px; }
  .patient-info-item { font-size:10pt; margin-bottom:3px; }
  .general-comment { font-size:11pt; font-weight:600; color:#0077b6; background:#E8E8E8; padding:4px 14px; border-radius:6px 6px 0 0; }
  table { width:100%; border-collapse:collapse; font-size:10pt; border:2px solid #E8E8E8; border-top:none; break-inside:avoid; }
  th { text-align:left; padding:8px 5px; border-bottom:2px solid #0d104b; font-weight:700; font-size:10pt; }
  td { padding:7px 5px; border-bottom:1px solid #ddd; }
  .flag-HIGH { color:#D00000; font-weight:700; }
  .flag-LOW { color:#ff8c00; font-weight:700; }
  .flag-Normal,.flag-NORMAL { color:#228B22; font-weight:700; }
  .flag-NA { color:#00B4D8; font-weight:700; }
  .note-section { margin-top:20px; break-inside:auto; }
  .note-title { font-size:11pt; font-weight:400; background:#E8E8E8; color:#00B4D8; padding:8px 14px; border-radius:6px 6px 0 0; break-after:avoid; }
  .note-text { font-size:10pt; line-height:1.8; text-align:justify; border:2px solid #E8E8E8; padding:10px 14px; border-radius:0 0 6px 6px; break-inside:auto; }
  .category-footer { text-align:center; font-size:10pt; padding-top:12px; border-top:1px solid #ccc; color:#0d104b; margin-top:auto; break-inside:avoid; position:relative; }
  .footer-stamp { position:absolute; bottom:4px; right:0; width:180px; height:auto; opacity:0.7; }
</style>
</head>
<body>
${coverPage}
${personalizedPage}
${categoryPages}
</body>
</html>`
}

export default function ReportViewer({ report }: { report: Report }) {
  const docJson = report.document_json ?? {}
  const catNotes: Record<string, string> = docJson.category_notes ?? {}
  const personalizedEnabled = docJson.personalized_enabled ?? false
  const personalizedHtml = docJson.personalized_content ?? ''

  const formattedDate = report.sample_date
    ? new Date(report.sample_date + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Date not recorded'
  const categories = groupByCategory(report.biomarkers ?? [])
  const bioCount = (report.biomarkers ?? []).filter(b => b.name.trim()).length

  function handlePrint() {
    const html = buildPrintHtml({
      firstName: report.first_name,
      lastName: report.last_name,
      email: report.email,
      productTitle: report.product_title,
      formattedDate,
      bioCount,
      personalizedEnabled,
      personalizedHtml,
      categories,
      catNotes,
    })
    const win = window.open('', '_blank', 'width=900,height=700')
    if (!win) { alert('Please allow pop-ups to download your report.'); return }
    win.document.open()
    win.document.write(html)
    win.document.close()
    win.onload = () => { win.focus(); win.print() }
  }

  return (
    <div className="min-h-screen bg-[#F7F6FC]">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 border-b border-[#dde4f0] bg-white px-6 py-3 shadow-[0_2px_8px_rgba(2,3,74,.06)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-poppins text-[11px] text-[#6b7280]">
              <a href="/account" className="text-[#00B4D8] hover:underline">My Account</a>
              {' / '}
              <a href="/account?tab=reports" className="text-[#00B4D8] hover:underline">Reports</a>
              {' / '}
              <span>{report.product_title}</span>
            </p>
            <p className="truncate font-merriweather text-[17px] font-extrabold text-[#02034a]">
              {report.product_title} - {formattedDate}
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="flex-shrink-0 inline-flex items-center gap-2 rounded-full bg-[#02034a] px-5 py-2.5 font-poppins text-[12.5px] font-bold text-white shadow-[0_4px_14px_rgba(2,3,74,.25)] transition hover:bg-[#00B4D8]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Download PDF
          </button>
        </div>
      </div>

      {/* A4 pages */}
      <div className="mx-auto flex flex-col items-center gap-6 px-4 py-10 pb-20" style={{ width: 'fit-content' }}>

        {/* Cover page */}
        <div className="bg-white shadow-[0_4px_32px_rgba(2,3,74,.10)]"
          style={{ width: '210mm', minHeight: '297mm', padding: '12mm', paddingBottom: '16mm', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '15px', borderBottom: '2px solid #0d104b' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://res.cloudinary.com/dky6bti4g/image/upload/v1760604400/Logo_Transparent_ks8ufb.png" alt="AiwasLabs" style={{ maxWidth: '180px', height: 'auto' }} />
              <div style={{ fontFamily: 'Merriweather, serif', fontSize: '20pt', fontWeight: 700, color: '#0d104b' }}>{formattedDate}</div>
            </div>
            <p style={{ fontFamily: 'Merriweather, serif', fontSize: '44pt', fontWeight: 700, color: '#0d104b', lineHeight: 1.15, marginBottom: '14px' }}>
              {report.first_name} {report.last_name}
            </p>
            <h1 style={{ fontFamily: 'Merriweather, serif', fontSize: '36pt', fontWeight: 700, color: '#0d104b', lineHeight: 1.15, marginBottom: '28px' }}>
              {report.product_title}
            </h1>
            <p style={{ fontSize: '24pt', marginBottom: '36px', fontWeight: 600, color: '#0d104b' }}>- {bioCount} BIOMARKERS</p>
            <div style={{ fontSize: '11pt', lineHeight: 1.6, color: '#0d104b' }} dangerouslySetInnerHTML={{ __html: COVER_DISCLAIMER }} />
            <div style={{ marginTop: '44px' }}>
              {[{ i: '📞', t: '01782 917963' }, { i: '📧', t: 'Aiwas@aiwasmedical.com' }, { i: '📸', t: '@Aiwaslabs' }].map(c => (
                <p key={c.t} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12pt', marginBottom: '7px', color: '#0d104b' }}>
                  <span>{c.i}</span>{c.t}
                </p>
              ))}
            </div>
          </div>
          <p style={{ fontSize: '8.5pt', fontStyle: 'italic', fontWeight: 700, textAlign: 'center', marginTop: '36px', paddingTop: '16px', borderTop: '1px solid #ccc', color: '#333' }}>
            This report is intended for informational purposes and does not replace assessment by a registered medical practitioner.
          </p>
        </div>

        {/* Personalised page */}
        {personalizedEnabled && personalizedHtml && (
          <div className="bg-white shadow-[0_4px_32px_rgba(2,3,74,.10)]"
            style={{ width: '210mm', minHeight: '297mm', padding: '12mm', paddingBottom: '16mm', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '2px solid #0d104b' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://res.cloudinary.com/dky6bti4g/image/upload/v1760604400/Logo_Transparent_ks8ufb.png" alt="AiwasLabs" style={{ maxWidth: '180px', height: 'auto' }} />
                <div style={{ fontFamily: 'Merriweather, serif', fontSize: '18pt', fontWeight: 700, color: '#0d104b' }}>Personalised Report</div>
              </div>
              <p style={{ fontSize: '11pt', fontWeight: 600, color: '#0077b6', background: '#E8E8E8', padding: '4px 14px', borderRadius: '6px 6px 0 0', margin: 0 }}>
                DOCTOR&apos;S NOTE
              </p>
              <div style={{ border: '2px solid #E8E8E8', borderTop: 'none', padding: '12px 14px', borderRadius: '0 0 6px 6px', minHeight: '200px', fontSize: '11pt', lineHeight: 1.7, color: '#0d104b' }}
                dangerouslySetInnerHTML={{ __html: personalizedHtml }} />
            </div>
            <div style={{ textAlign: 'center', fontSize: '10pt', paddingTop: '12px', borderTop: '1px solid #ccc', color: '#0d104b', marginTop: 'auto' }}>
              AiwasLabs · Private Blood Testing · {formattedDate}
            </div>
          </div>
        )}

        {/* Category pages */}
        {categories.map((cat, i) => (
          <div key={cat.name} className="bg-white shadow-[0_4px_32px_rgba(2,3,74,.10)]"
            style={{ width: '210mm', minHeight: '297mm', padding: '12mm', paddingBottom: '16mm', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ flex: 1 }}>
              {/* Category header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '2px solid #666' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://res.cloudinary.com/dky6bti4g/image/upload/v1760604400/Logo_Transparent_ks8ufb.png" alt="AiwasLabs" style={{ maxWidth: '160px', height: 'auto' }} />
                <div style={{ fontFamily: 'Merriweather, serif', fontSize: '18pt', fontWeight: 700, color: '#0d104b', textAlign: 'right' }}>{cat.name}</div>
              </div>

              {/* Patient info (first category only) */}
              {i === 0 && (
                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                  <div style={{ flex: 1, border: '2px solid #CFCFCF', padding: '8px 12px', borderRadius: '8px' }}>
                    <p style={{ fontSize: '10pt', marginBottom: '3px' }}><strong>Patient:</strong> {report.first_name} {report.last_name}</p>
                    <p style={{ fontSize: '10pt' }}><strong>Email:</strong> {report.email}</p>
                  </div>
                  <div style={{ flex: 1, border: '2px solid #CFCFCF', padding: '8px 12px', borderRadius: '8px' }}>
                    <p style={{ fontSize: '10pt', marginBottom: '3px' }}><strong>Test:</strong> {report.product_title}</p>
                    <p style={{ fontSize: '10pt' }}><strong>Sample Date:</strong> {formattedDate}</p>
                  </div>
                </div>
              )}

              {/* GENERAL COMMENT header */}
              <p style={{ fontSize: '11pt', fontWeight: 600, color: '#0077b6', background: '#E8E8E8', padding: '4px 14px', borderRadius: '6px 6px 0 0', margin: 0 }}>
                GENERAL COMMENT
              </p>

              {/* Biomarker table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt', border: '2px solid #E8E8E8', borderTop: 'none' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #0d104b' }}>
                    {['TEST', 'RESULT', 'FLAG', 'UNITS', 'REFERENCE INTERVAL'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 5px', fontWeight: 700, fontSize: '10pt' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cat.rows.map((b, ri) => (
                    <tr key={ri} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '7px 5px', fontSize: '10pt', color: '#0d104b' }}>{b.name}</td>
                      <td style={{ padding: '7px 5px' }}>
                        <strong className={FLAG_CLS[b.flag ?? ''] ?? 'text-[#0d104b]'} style={{ fontSize: '10pt' }}>
                          {b.value ?? '-'}
                        </strong>
                      </td>
                      <td style={{ padding: '7px 5px' }}>
                        <span className={`font-bold ${FLAG_CLS[b.flag ?? ''] ?? 'text-[#6b7280]'}`} style={{ fontSize: '10pt' }}>
                          {b.flag || '–'}
                        </span>
                      </td>
                      <td style={{ padding: '7px 5px', fontSize: '10pt', color: '#0d104b' }}>{b.unit ?? ''}</td>
                      <td style={{ padding: '7px 5px', fontSize: '10pt', color: '#6b7280' }}>{b.reference_range ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* NOTE section */}
              {catNotes[cat.name] && (
                <div style={{ marginTop: '20px' }}>
                  <p style={{ fontSize: '11pt', fontWeight: 400, background: '#E8E8E8', color: '#00B4D8', padding: '8px 14px', borderRadius: '6px 6px 0 0', margin: 0 }}>
                    NOTE
                  </p>
                  <div style={{ border: '2px solid #E8E8E8', borderTop: 'none', padding: '10px 14px', borderRadius: '0 0 6px 6px', fontSize: '10pt', lineHeight: 1.8, color: '#0d104b' }}
                    dangerouslySetInnerHTML={{ __html: catNotes[cat.name] }} />
                </div>
              )}
            </div>

            {/* Page footer */}
            <div style={{ textAlign: 'center', fontSize: '10pt', paddingTop: '12px', borderTop: '1px solid #ccc', color: '#0d104b', marginTop: 'auto' }}>
              AiwasLabs · Private Blood Testing · {formattedDate}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
