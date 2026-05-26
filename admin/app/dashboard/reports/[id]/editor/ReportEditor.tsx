'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { useState, useCallback } from 'react'
import CategoryPage from './CategoryPage'
import { groupByCategory, getCategoryForBiomarker, type BiomarkerRow, type Category } from '@/lib/biomarker-categories'

interface Report {
  id: string
  first_name: string
  last_name: string
  email: string
  product_title: string
  sample_date: string
  notes: string | null
  biomarkers: BiomarkerRow[]
  source_file_url: string | null
  document_json: {
    personalized_enabled?: boolean
    personalized_content?: string
    category_notes?: Record<string, string>
  } | null
  status: string
}

const COVER_DISCLAIMER = `<p><strong>Clinical Note:</strong> This interpretation is based on the blood results at the time of testing only and must be considered alongside clinical history, examination findings, medications, supplements, and any subsequent results. Blood markers can change over time and a single test does not provide a diagnosis in isolation.</p>
<p style="margin-top:10px"><strong>Follow-Up Responsibility:</strong> Abnormal or borderline results identified in this report require follow-up through the patient's GP or treating clinician, who will assume responsibility for ongoing monitoring, investigation, and treatment where appropriate.</p>
<p style="margin-top:10px"><strong>Safety Notice:</strong> If new, worsening, or concerning symptoms develop after this test such as chest pain, severe abdominal pain, shortness of breath, neurological symptoms, or jaundice, urgent medical assessment should be sought regardless of these results. This report is intended for informational purposes only and does not replace assessment by a registered medical practitioner.</p>`

export default function ReportEditor({ report }: { report: Report }) {
  const docJson = report.document_json ?? {}
  const [status, setStatus] = useState(report.status)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showPersonalized, setShowPersonalized] = useState(docJson.personalized_enabled ?? false)

  // ── Biomarkers: flat list, editable; categories derived on render ──────────
  const [biomarkers, setBiomarkers] = useState<BiomarkerRow[]>(
    report.biomarkers?.length ? report.biomarkers : []
  )
  // ── Category notes: keyed by category name ────────────────────────────────
  const [catNotes, setCatNotes] = useState<Record<string, string>>(
    docJson.category_notes ?? {}
  )

  // ── Personalized TipTap ───────────────────────────────────────────────────
  const personalizedEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Write the personalized report section here…' }),
    ],
    content: docJson.personalized_content ?? '',
    editorProps: {
      attributes: { class: 'focus:outline-none text-[11pt] leading-[1.7] text-[#0d104b]' },
    },
  })

  const sampleDate = String(report.sample_date).slice(0, 10)
  const formattedDate = new Date(sampleDate + 'T12:00:00').toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const categories: Category[] = groupByCategory(biomarkers)
  const bioCount = biomarkers.filter(b => b.name.trim()).length

  // ── Biomarker row editing ─────────────────────────────────────────────────
  function setRow(catName: string, rowIdx: number, field: keyof BiomarkerRow, val: string) {
    setBiomarkers(prev => {
      let catRowCount = 0
      return prev.map(b => {
        if (!b.name.trim()) return b
        if (getCategoryForBiomarker(b.name) === catName) {
          if (catRowCount === rowIdx) { catRowCount++; return { ...b, [field]: val || null } }
          catRowCount++
        }
        return b
      })
    })
  }

  function addRow(catName: string) {
    setBiomarkers(prev => {
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i].name.trim() && getCategoryForBiomarker(prev[i].name) === catName) {
          return [...prev.slice(0, i + 1), { name: '', value: null, unit: null, reference_range: null, flag: null }, ...prev.slice(i + 1)]
        }
      }
      return [...prev, { name: '', value: null, unit: null, reference_range: null, flag: null }]
    })
  }

  function removeRow(catName: string, rowIdx: number) {
    setBiomarkers(prev => {
      let catRowCount = 0
      return prev.filter(b => {
        if (!b.name.trim()) return true
        if (getCategoryForBiomarker(b.name) === catName) {
          const keep = catRowCount !== rowIdx
          catRowCount++
          return keep
        }
        return true
      })
    })
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  const save = useCallback(async (newStatus?: string) => {
    setSaving(true)
    setSaved(false)
    await fetch(`/api/reports/${report.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        biomarkers,
        document_json: {
          personalized_enabled: showPersonalized,
          personalized_content: personalizedEditor?.getHTML() ?? '',
          category_notes: catNotes,
        },
        status: newStatus ?? status,
      }),
    })
    setSaving(false)
    setSaved(true)
    if (newStatus) setStatus(newStatus)
    setTimeout(() => setSaved(false), 2500)
  }, [biomarkers, catNotes, personalizedEditor, report.id, showPersonalized, status])

  // ── Print: open in new window ──────────────────────────────────────────────
  function handlePrint() {
    const cats = groupByCategory(biomarkers)
    const printHtml = buildPrintHtml({
      firstName: report.first_name,
      lastName: report.last_name,
      email: report.email,
      productTitle: report.product_title,
      formattedDate,
      bioCount,
      showPersonalized,
      personalizedHtml: personalizedEditor?.getHTML() ?? '',
      categories: cats,
      catNotes,
    })
    const win = window.open('', '_blank', 'width=900,height=700')
    if (!win) { alert('Allow pop-ups to export PDF'); return }
    win.document.open()
    win.document.write(printHtml)
    win.document.close()
    win.onload = () => { win.focus(); win.print() }
  }

  const ToolBtn = ({ onClick, title, children, active }: {
    onClick: () => void; title: string; children: React.ReactNode; active?: boolean
  }) => (
    <button type="button" onClick={onClick} title={title}
      className={`flex h-7 w-7 items-center justify-center rounded-[5px] transition ${active ? 'bg-[#02034a] text-white' : 'text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#02034a]'}`}>
      {children}
    </button>
  )

  return (
    <div>
      {/* ── Admin toolbar ── */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-poppins text-[#6b7280]">
            <a href="/dashboard/reports" className="text-[#00B4D8] hover:underline">Reports</a>
            <span>/</span><span>{report.first_name} {report.last_name}</span><span>/</span><span>Editor</span>
          </div>
          <h1 className="mt-0.5 font-merriweather text-[22px] font-extrabold text-[#02034a]">
            {report.first_name} {report.last_name} — {report.product_title}
          </h1>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Personalized toggle */}
          <button
            onClick={() => setShowPersonalized(v => !v)}
            className={`inline-flex items-center gap-1.5 rounded-[8px] border px-3 py-1.5 font-poppins text-[11px] font-semibold transition ${
              showPersonalized
                ? 'border-[#02034a] bg-[#02034a] text-white'
                : 'border-[#dde4f0] text-[#6b7280] hover:border-[#02034a] hover:text-[#02034a]'
            }`}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/></svg>
            {showPersonalized ? 'Personalised: On' : 'Personalised Report'}
          </button>

          <span className={`inline-flex items-center rounded-full px-3 py-1 font-poppins text-[10px] font-bold uppercase tracking-[0.08em] ${
            status === 'finalised' ? 'bg-[rgba(34,139,34,.1)] text-[#228B22]' : 'bg-[rgba(0,180,216,.1)] text-[#0077b6]'
          }`}>{status}</span>

          {report.source_file_url && (
            <a href={report.source_file_url} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#dde4f0] px-3 py-1.5 font-poppins text-[11px] font-semibold text-[#6b7280] hover:border-[#00B4D8] hover:text-[#00B4D8] transition">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Source
            </a>
          )}

          <button onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#dde4f0] px-3 py-1.5 font-poppins text-[11px] font-semibold text-[#6b7280] hover:border-[#02034a] hover:text-[#02034a] transition">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Export PDF
          </button>

          <button onClick={() => save()} disabled={saving}
            className="inline-flex items-center gap-1.5 rounded-[8px] border border-[#02034a] px-3 py-1.5 font-poppins text-[11px] font-semibold text-[#02034a] hover:bg-[#02034a] hover:text-white transition disabled:opacity-50">
            {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save Draft'}
          </button>

          {status !== 'finalised' && (
            <button onClick={() => save('finalised')} disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#228B22] px-4 py-1.5 font-poppins text-[11px] font-bold text-white shadow hover:bg-[#1a6b1a] transition disabled:opacity-50">
              Finalise
            </button>
          )}
        </div>
      </div>

      {/* ── A4 document preview ── */}
      <div className="mx-auto flex flex-col gap-6 pb-16" style={{ width: '210mm' }}>

        {/* Page 1: Cover */}
        <div className="a4-page bg-white shadow-[0_4px_32px_rgba(2,3,74,.10)]"
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
            <h1 style={{ fontFamily: 'Merriweather, serif', fontSize: '38pt', fontWeight: 700, color: '#0d104b', lineHeight: 1.15, marginBottom: '28px' }}>
              {report.product_title}
            </h1>
            <p style={{ fontSize: '26pt', marginBottom: '36px', fontWeight: 600, color: '#0d104b' }}>— {bioCount} BIOMARKERS</p>
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

        {/* Page 2 (optional): Personalized section */}
        {showPersonalized && (
          <div className="a4-page bg-white shadow-[0_4px_32px_rgba(2,3,74,.10)]"
            style={{ width: '210mm', minHeight: '297mm', padding: '12mm', paddingBottom: '16mm', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '2px solid #0d104b' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://res.cloudinary.com/dky6bti4g/image/upload/v1760604400/Logo_Transparent_ks8ufb.png" alt="AiwasLabs" style={{ maxWidth: '180px', height: 'auto' }} />
                <div style={{ fontFamily: 'Merriweather, serif', fontSize: '18pt', fontWeight: 700, color: '#0d104b' }}>Personalised Report</div>
              </div>
              <div className="mb-2 flex items-center gap-2">
                <span style={{ fontSize: '11pt', fontWeight: 600, color: '#0077b6', background: '#E8E8E8', padding: '4px 14px', borderRadius: '6px 6px 0 0' }}>
                  DOCTOR&apos;S NOTE
                </span>
              </div>
              {personalizedEditor && (
                <div className="mb-2 flex items-center gap-1 border-x-2 border-[#E8E8E8] bg-[#fafafa] px-2 py-1.5">
                  <ToolBtn onClick={() => personalizedEditor.chain().focus().toggleBold().run()} title="Bold" active={personalizedEditor.isActive('bold')}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 4h8a4 4 0 010 8H6zM6 12h9a4 4 0 010 8H6z"/></svg>
                  </ToolBtn>
                  <ToolBtn onClick={() => personalizedEditor.chain().focus().toggleItalic().run()} title="Italic" active={personalizedEditor.isActive('italic')}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
                  </ToolBtn>
                  <ToolBtn onClick={() => personalizedEditor.chain().focus().toggleUnderline().run()} title="Underline" active={personalizedEditor.isActive('underline')}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 3v7a6 6 0 0012 0V3M4 21h16"/></svg>
                  </ToolBtn>
                  <div className="mx-1 h-4 w-px bg-[#dde4f0]" />
                  <ToolBtn onClick={() => personalizedEditor.chain().focus().toggleBulletList().run()} title="Bullet list" active={personalizedEditor.isActive('bulletList')}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
                  </ToolBtn>
                  <ToolBtn onClick={() => personalizedEditor.chain().focus().toggleOrderedList().run()} title="Ordered list" active={personalizedEditor.isActive('orderedList')}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/></svg>
                  </ToolBtn>
                </div>
              )}
              <div style={{ border: '2px solid #E8E8E8', borderTop: 'none', padding: '12px 14px', borderRadius: '0 0 6px 6px', minHeight: '200px', fontSize: '11pt', lineHeight: 1.7, color: '#0d104b' }}>
                <EditorContent editor={personalizedEditor} />
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '10pt', paddingTop: '12px', borderTop: '1px solid #ccc', color: '#0d104b', marginTop: 'auto' }}>
              AiwasLabs · Private Blood Testing · {formattedDate}
            </div>
          </div>
        )}

        {/* Pages per category */}
        {categories.map((cat, i) => (
          <CategoryPage
            key={cat.name}
            categoryName={cat.name}
            rows={cat.rows}
            noteHtml={catNotes[cat.name] ?? ''}
            patientName={`${report.first_name} ${report.last_name}`}
            patientEmail={report.email}
            productTitle={report.product_title}
            sampleDateFormatted={formattedDate}
            bioCount={bioCount}
            pageIndex={i}
            totalCategories={categories.length}
            onRowChange={(ri, field, val) => setRow(cat.name, ri, field, val)}
            onAddRow={() => addRow(cat.name)}
            onRemoveRow={(ri) => removeRow(cat.name, ri)}
            onNoteChange={(html) => setCatNotes(prev => ({ ...prev, [cat.name]: html }))}
          />
        ))}

        {categories.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#dde4f0] bg-white py-16">
            <p className="font-poppins text-[13px] text-[#6b7280]">No biomarkers yet. Upload and parse a report to populate them.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Print HTML generator ───────────────────────────────────────────────────
function flagHtml(flag: string | null, value: string | null) {
  const cls = flag === 'HIGH' ? 'color:#D00000;font-weight:700' : flag === 'LOW' ? 'color:#ff8c00;font-weight:700' : flag === 'Normal' || flag === 'NORMAL' ? 'color:#228B22;font-weight:700' : 'color:#0d104b'
  return `<strong style="${cls}">${value ?? '—'}</strong>`
}

function buildPrintHtml(opts: {
  firstName: string; lastName: string; email: string; productTitle: string
  formattedDate: string; bioCount: number; showPersonalized: boolean
  personalizedHtml: string; categories: Category[]; catNotes: Record<string, string>
}) {
  const { firstName, lastName, email, productTitle, formattedDate, bioCount, showPersonalized, personalizedHtml, categories, catNotes } = opts
  const LOGO = 'https://res.cloudinary.com/dky6bti4g/image/upload/v1760604400/Logo_Transparent_ks8ufb.png'
  const STAMP = 'https://res.cloudinary.com/dky6bti4g/image/upload/v1764791068/Shabby_stamp_n5u6e7.png'

  const page = (content: string) => `<div class="page">${content}</div>`

  const coverPage = page(`
    <div class="page-content">
      <div class="header"><img src="${LOGO}" class="logo" alt="AiwasLabs"><div class="header-title">${formattedDate}</div></div>
      <p class="patient-name">${firstName} ${lastName}</p>
      <h1 class="title">${productTitle}</h1>
      <p class="biomarkers">— ${bioCount} BIOMARKERS</p>
      <div class="body-text"><p><span class="body-heading">Clinical Note:</span> This interpretation is based on the blood results at the time of testing only and must be considered alongside <strong>clinical history, examination findings, medications, supplements,</strong> and any subsequent results. Blood markers can change over time and <strong>a single test does not provide a diagnosis in isolation.</strong></p>
      <p style="margin-top:12px"><span class="body-heading">Follow-Up Responsibility:</span> Abnormal or borderline results identified in this report require follow-up through the patient's <strong>GP or treating clinician,</strong> who will assume responsibility for <strong>ongoing monitoring, investigation, and treatment</strong> where appropriate.</p>
      <p style="margin-top:12px"><span class="body-heading">Safety Notice:</span> If <strong>new, worsening, or concerning symptoms</strong> develop after this test, <strong>urgent medical assessment should be sought.</strong> This report is intended for <strong>informational purposes only</strong> and does not replace assessment by a <strong>registered medical practitioner.</strong></p></div>
      <p class="contact" style="margin-top:44px">📞 01782 917963</p>
      <p class="contact">📧 Aiwas@aiwasmedical.com</p>
      <p class="contact">📸 @Aiwaslabs</p>
    </div>
    <p class="footer-text page-footer">This report is intended for informational purposes and does not replace assessment by a registered medical practitioner.</p>
  `)

  const personalizedPage = showPersonalized ? page(`
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
        <td>${flagHtml(b.flag, b.value)}</td>
        <td class="flag-${b.flag ?? 'NA'}">${b.flag || '–'}</td>
        <td>${b.unit ?? ''}</td>
        <td>${b.reference_range ?? ''}</td>
      </tr>`).join('')

    const note = catNotes[cat.name] ?? ''

    return `<div class="category-page" style="page-break-before:${i === 0 && !showPersonalized ? 'auto' : 'always'}">
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
<title>Lab Report — ${firstName} ${lastName}</title>
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
  .flag-NA,.flag-N\\/A { color:#00B4D8; font-weight:700; }
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
