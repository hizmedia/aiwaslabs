'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useUploadThing } from '@/lib/uploadthing-client'

interface Patient { id: string; first_name: string; last_name: string; email: string }
interface Product { id: string; title: string }
interface Biomarker {
  name: string
  value: string | null
  unit: string | null
  reference_range: string | null
  flag: string | null
}

type Step = 'setup' | 'uploading' | 'parsing' | 'review'

export default function NewReportClient({ patients, products }: { patients: Patient[]; products: Product[] }) {
  const router = useRouter()

  const [step, setStep] = useState<Step>('setup')
  const [creating, setCreating] = useState(false)
  const [patientId, setPatientId] = useState('')
  const [productId, setProductId] = useState('')
  const [sampleDate, setSampleDate] = useState('')
  const [notes, setNotes] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const [uploadedUrl, setUploadedUrl] = useState('')
  const [biomarkers, setBiomarkers] = useState<Biomarker[]>([])
  const [parsedPatient, setParsedPatient] = useState<{ name?: string; dob?: string } | null>(null)
  const [parseError, setParseError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(0)

  const { startUpload, isUploading } = useUploadThing('labReport', {
    onUploadProgress: (p) => setUploadProgress(p),
  })

  const INPUT = 'w-full rounded-[8px] border border-[#dde4f0] bg-white px-3 py-2 font-poppins text-[13px] text-[#02034a] placeholder-[#a0aec0] focus:border-[#00B4D8] focus:outline-none transition'
  const LABEL = 'mb-1 block font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#6b7280]'

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }, [])

  async function handleUploadAndParse() {
    if (!file || !patientId || !productId || !sampleDate) return
    setParseError('')

    // 1 — upload to UploadThing
    setStep('uploading')
    try {
      const result = await startUpload([file])
      if (!result?.[0]?.url) throw new Error('Upload failed — no URL returned')
      const fileUrl = result[0].url
      setUploadedUrl(fileUrl)

      // 2 — parse via Datalab
      setStep('parsing')
      const res = await fetch('/api/reports/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: fileUrl }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Parsing failed')
      }

      const data = await res.json()
      setBiomarkers(data.biomarkers ?? [])
      setParsedPatient(data.patient ?? null)
      setStep('review')
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Failed')
      setStep('setup')
    }
  }

  function setBiomarker(i: number, field: keyof Biomarker, val: string) {
    setBiomarkers(prev => prev.map((b, idx) => idx === i ? { ...b, [field]: val } : b))
  }

  function addBiomarker() {
    setBiomarkers(prev => [...prev, { name: '', value: '', unit: '', reference_range: '', flag: null }])
  }

  function removeBiomarker(i: number) {
    setBiomarkers(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleCreate() {
    setCreating(true)
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_id: patientId,
        product_id: productId,
        sample_date: sampleDate,
        notes: notes || null,
        biomarkers: biomarkers.filter(b => b.name.trim()),
        source_file_url: uploadedUrl,
        status: 'draft',
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setParseError(data.error ?? 'Failed to save')
      setCreating(false)
      return
    }

    const data = await res.json()
    router.push(`/dashboard/reports/${data.id}/editor`)
  }

  const flagColor = (flag: string | null) => {
    if (!flag) return 'text-[#02034a]'
    const f = flag.toUpperCase()
    if (f.includes('HIGH') || f === 'H') return 'text-red-500 font-bold'
    if (f.includes('LOW') || f === 'L') return 'text-amber-500 font-bold'
    return 'text-[#02034a]'
  }

  // ── Step: Setup ──────────────────────────────────────────────────────────────
  if (step === 'setup') {
    return (
      <div>
        <div className="mb-6">
          <span className="inline-flex items-center gap-[8px] font-poppins text-[11px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[14px] before:bg-[#00B4D8] before:content-['']">
            Reports / New
          </span>
          <h1 className="mt-1 font-merriweather text-[26px] font-extrabold text-[#02034a]">Upload & Parse Report</h1>
        </div>

        {parseError && (
          <div className="mb-4 rounded-[8px] border border-red-100 bg-red-50 px-4 py-3 font-poppins text-[12.5px] text-red-500">
            {parseError}
          </div>
        )}

        <div className="rounded-2xl border border-[#dde4f0] bg-white p-6 shadow-[0_1px_3px_rgba(2,3,74,.06)] space-y-6">

          {/* Patient + Product */}
          <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
            <div>
              <label className={LABEL}>Patient</label>
              <select value={patientId} onChange={e => setPatientId(e.target.value)} required className={INPUT}>
                <option value="">Select patient…</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.first_name} {p.last_name} — {p.email}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL}>Test / Product</label>
              <select value={productId} onChange={e => setProductId(e.target.value)} required className={INPUT}>
                <option value="">Select test…</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sample date + notes */}
          <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
            <div>
              <label className={LABEL}>Sample Date</label>
              <input type="date" value={sampleDate} onChange={e => setSampleDate(e.target.value)} required className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Internal Notes (optional)</label>
              <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className={INPUT} placeholder="e.g. fasting sample" />
            </div>
          </div>

          {/* File drop zone */}
          <div>
            <label className={LABEL}>Lab Report File (PDF or Excel)</label>
            <div
              onDrop={onDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => document.getElementById('file-input')?.click()}
              className={`relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[12px] border-2 border-dashed p-10 transition ${dragOver ? 'border-[#00B4D8] bg-[rgba(0,180,216,.04)]' : 'border-[#dde4f0] hover:border-[#00B4D8] hover:bg-[rgba(0,180,216,.02)]'}`}
            >
              <input
                id="file-input" type="file" className="hidden"
                accept=".pdf,.xlsx,.xls"
                onChange={e => setFile(e.target.files?.[0] ?? null)}
              />
              <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[rgba(0,180,216,.1)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><polyline points="9 15 12 12 15 15"/>
                </svg>
              </div>
              {file ? (
                <div className="text-center">
                  <p className="font-poppins text-[13px] font-semibold text-[#02034a]">{file.name}</p>
                  <p className="font-poppins text-[11px] text-[#6b7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-poppins text-[13px] font-semibold text-[#02034a]">Drop file here or click to browse</p>
                  <p className="font-poppins text-[11px] text-[#6b7280]">PDF or Excel · Max 32 MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleUploadAndParse}
              disabled={!file || !patientId || !productId || !sampleDate}
              className="inline-flex items-center gap-2 rounded-[8px] bg-[#00B4D8] px-6 py-2.5 font-poppins text-[12px] font-bold text-white shadow hover:bg-[#0077b6] transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M8 11h6M11 8v6"/>
              </svg>
              Upload &amp; Parse
            </button>
            <a href="/dashboard/reports" className="font-poppins text-[12px] text-[#6b7280] hover:text-[#02034a] transition">Cancel</a>
          </div>
        </div>
      </div>
    )
  }

  // ── Step: Uploading / Parsing ────────────────────────────────────────────────
  if (step === 'uploading' || step === 'parsing') {
    const label = step === 'uploading'
      ? `Uploading file… ${uploadProgress}%`
      : 'Parsing biomarkers with AI…'
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24">
        <div className="relative h-16 w-16">
          <svg className="animate-spin" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="28" stroke="#dde4f0" strokeWidth="6" />
            <path d="M32 4a28 28 0 0128 28" stroke="#00B4D8" strokeWidth="6" strokeLinecap="round" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-poppins text-[14px] font-semibold text-[#02034a]">{label}</p>
          {step === 'uploading' && (
            <div className="mt-3 h-1.5 w-64 overflow-hidden rounded-full bg-[#dde4f0]">
              <div
                className="h-full rounded-full bg-[#00B4D8] transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
          {step === 'parsing' && (
            <p className="mt-1 font-poppins text-[12px] text-[#6b7280]">Connecting to Datalab… this can take up to 60s</p>
          )}
        </div>
      </div>
    )
  }

  // ── Step: Review ─────────────────────────────────────────────────────────────
  if (step === 'review') {
    return (
      <div>
        <div className="mb-6">
          <span className="inline-flex items-center gap-[8px] font-poppins text-[11px] font-bold uppercase tracking-[0.18em] text-[#00B4D8] before:inline-block before:h-[2px] before:w-[14px] before:bg-[#00B4D8] before:content-['']">
            Reports / New / Review
          </span>
          <h1 className="mt-1 font-merriweather text-[26px] font-extrabold text-[#02034a]">Review Parsed Results</h1>
        </div>

        {parseError && (
          <div className="mb-4 rounded-[8px] border border-red-100 bg-red-50 px-4 py-3 font-poppins text-[12.5px] text-red-500">
            {parseError}
          </div>
        )}

        {/* Parsed patient info */}
        {parsedPatient?.name && (
          <div className="mb-4 flex items-center gap-3 rounded-[10px] border border-[#dde4f0] bg-[#f8faff] px-4 py-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" strokeWidth="2" strokeLinecap="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
            </svg>
            <p className="font-poppins text-[12.5px] text-[#02034a]">
              <span className="font-bold">From report: </span>
              {parsedPatient.name}
              {parsedPatient.dob ? ` · DOB: ${parsedPatient.dob}` : ''}
            </p>
          </div>
        )}

        <div className="rounded-2xl border border-[#dde4f0] bg-white shadow-[0_1px_3px_rgba(2,3,74,.06)] overflow-hidden">
          {/* Table header */}
          <div className="flex items-center justify-between border-b border-[#dde4f0] bg-[#f8faff] px-5 py-3">
            <span className="font-poppins text-[11px] font-bold uppercase tracking-[0.1em] text-[#6b7280]">
              {biomarkers.length} Biomarker{biomarkers.length !== 1 ? 's' : ''} Found
            </span>
            <button onClick={addBiomarker} className="font-poppins text-[11px] font-bold text-[#00B4D8] hover:underline">+ Add row</button>
          </div>

          {biomarkers.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-poppins text-[13px] text-[#6b7280]">No biomarkers were parsed. You can add them manually below.</p>
              <button onClick={addBiomarker} className="mt-3 font-poppins text-[12px] font-semibold text-[#00B4D8] hover:underline">+ Add biomarker</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#f3f4f6]">
                    {['Marker', 'Value', 'Unit', 'Reference Range', 'Flag', ''].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-[#6b7280]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f9fafb]">
                  {biomarkers.map((b, i) => (
                    <tr key={i} className="hover:bg-[#fafbff]">
                      <td className="px-4 py-2">
                        <input value={b.name} onChange={e => setBiomarker(i, 'name', e.target.value)}
                          className="w-full rounded border-0 bg-transparent font-poppins text-[12.5px] text-[#02034a] outline-none focus:bg-[#f0f8ff] focus:rounded-[4px] focus:px-1 transition" />
                      </td>
                      <td className="px-4 py-2">
                        <input value={b.value ?? ''} onChange={e => setBiomarker(i, 'value', e.target.value)}
                          className={`w-24 rounded border-0 bg-transparent font-poppins text-[12.5px] outline-none focus:bg-[#f0f8ff] focus:rounded-[4px] focus:px-1 transition ${flagColor(b.flag)}`} />
                      </td>
                      <td className="px-4 py-2">
                        <input value={b.unit ?? ''} onChange={e => setBiomarker(i, 'unit', e.target.value)}
                          className="w-20 rounded border-0 bg-transparent font-poppins text-[12px] text-[#6b7280] outline-none focus:bg-[#f0f8ff] focus:rounded-[4px] focus:px-1 transition" />
                      </td>
                      <td className="px-4 py-2">
                        <input value={b.reference_range ?? ''} onChange={e => setBiomarker(i, 'reference_range', e.target.value)}
                          className="w-28 rounded border-0 bg-transparent font-poppins text-[12px] text-[#6b7280] outline-none focus:bg-[#f0f8ff] focus:rounded-[4px] focus:px-1 transition" />
                      </td>
                      <td className="px-4 py-2">
                        <select value={b.flag ?? ''} onChange={e => setBiomarker(i, 'flag', e.target.value)}
                          className="rounded border-0 bg-transparent font-poppins text-[11px] font-semibold outline-none">
                          <option value="">–</option>
                          <option value="HIGH">HIGH</option>
                          <option value="LOW">LOW</option>
                          <option value="NORMAL">NORMAL</option>
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <button onClick={() => removeBiomarker(i)}
                          className="flex h-6 w-6 items-center justify-center rounded-[4px] text-[#6b7280] hover:bg-red-50 hover:text-red-400 transition">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleCreate}
            disabled={creating}
            className="inline-flex items-center gap-2 rounded-[8px] bg-[#02034a] px-6 py-2.5 font-poppins text-[12px] font-bold text-white shadow hover:bg-[#030466] transition disabled:opacity-50"
          >
            {creating ? 'Creating…' : 'Create Report & Open Editor'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button onClick={() => { setStep('setup'); setParseError('') }} className="font-poppins text-[12px] text-[#6b7280] hover:text-[#02034a] transition">
            ← Back
          </button>
        </div>
      </div>
    )
  }

  return null
}
