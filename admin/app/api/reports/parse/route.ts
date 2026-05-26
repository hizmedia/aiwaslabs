import { NextRequest, NextResponse } from 'next/server'

const DATALAB_API_KEY = process.env.DATALAB_API_KEY ?? ''
const DATALAB_BASE = 'https://www.datalab.to'

const LAB_REPORT_SCHEMA = JSON.stringify({
  title: 'LabReport',
  type: 'object',
  properties: {
    patient: {
      type: 'object',
      description: 'Patient information from the report',
      properties: {
        name:       { type: 'string', description: 'Full patient name' },
        dob:        { type: 'string', description: 'Date of birth in any format found' },
        patient_id: { type: 'string', description: 'Patient ID or reference number' },
      },
    },
    biomarkers: {
      type: 'array',
      description: 'All blood test / lab biomarker results in the report',
      items: {
        type: 'object',
        properties: {
          name:            { type: 'string', description: 'Full name of the biomarker or test' },
          value:           { type: 'string', description: 'Measured result value as a string' },
          unit:            { type: 'string', description: 'Unit of measurement e.g. mmol/L, g/dL' },
          reference_range: { type: 'string', description: 'Normal reference range e.g. 3.5–5.0 or <200' },
          flag: {
            type: 'string',
            description: 'Abnormality flag: Normal, HIGH, LOW, or N/A',
            enum: ['Normal', 'HIGH', 'LOW', 'N/A'],
          },
        },
        required: ['name'],
      },
    },
  },
  required: ['biomarkers'],
})

async function pollUntilComplete(checkUrl: string, maxAttempts = 60): Promise<Response> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 3000))
    const res = await fetch(checkUrl, {
      headers: { 'X-Api-Key': DATALAB_API_KEY },
    })
    if (!res.ok) return res
    const data = await res.json()
    if (data.status === 'complete') return new Response(JSON.stringify(data), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    })
    if (data.status === 'error') return new Response(JSON.stringify({ error: data.error ?? 'Processing failed' }), { status: 500 })
  }
  return new Response(JSON.stringify({ error: 'Timed out waiting for Datalab result' }), { status: 504 })
}

export async function POST(req: NextRequest) {
  const { url } = await req.json()
  if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 })
  if (!DATALAB_API_KEY) return NextResponse.json({ error: 'DATALAB_API_KEY not configured' }, { status: 500 })

  // Detect Excel files — route to Python backend instead
  const lowerUrl = url.toLowerCase()
  const isExcel = lowerUrl.includes('.xlsx') || lowerUrl.includes('.xls')

  if (isExcel) {
    const PARSER_URL = process.env.PARSER_URL ?? 'https://aiwaslabs-report-parser.onrender.com'
    try {
      const res = await fetch(`${PARSER_URL}/api/process-urls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: [url] }),
        signal: AbortSignal.timeout(120_000),
      })
      if (!res.ok) {
        const text = await res.text()
        return NextResponse.json({ error: text }, { status: res.status })
      }
      const data = await res.json()
      // Normalise to Datalab format
      const doc = data.documents?.[0]
      return NextResponse.json({
        patient: doc?.patient ?? null,
        biomarkers: (doc?.biomarkers ?? []).map((b: { name: string; value?: string; unit?: string; reference_range?: string; flag?: string }) => ({
          name: b.name,
          value: b.value ?? null,
          unit: b.unit ?? null,
          reference_range: b.reference_range ?? null,
          flag: b.flag ?? null,
        })),
      })
    } catch (err) {
      return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 })
    }
  }

  // ── PDF: call Datalab /api/v1/extract directly ──
  const form = new FormData()
  form.append('file_url', url)
  form.append('page_schema', LAB_REPORT_SCHEMA)
  form.append('mode', 'accurate')

  try {
    const initRes = await fetch(`${DATALAB_BASE}/api/v1/extract`, {
      method: 'POST',
      headers: { 'X-Api-Key': DATALAB_API_KEY },
      body: form,
    })

    if (!initRes.ok) {
      const text = await initRes.text()
      return NextResponse.json({ error: `Datalab error: ${text}` }, { status: initRes.status })
    }

    const initData = await initRes.json()
    if (!initData.success || !initData.request_check_url) {
      return NextResponse.json({ error: initData.error ?? 'Datalab submission failed' }, { status: 500 })
    }

    const resultRes = await pollUntilComplete(initData.request_check_url)
    if (!resultRes.ok) {
      const errData = await resultRes.json()
      return NextResponse.json({ error: errData.error ?? 'Datalab polling failed' }, { status: 500 })
    }

    const result = await resultRes.json()

    // Parse the extracted JSON schema result
    let parsed: { patient?: { name?: string; dob?: string; patient_id?: string }; biomarkers?: { name: string; value?: string; unit?: string; reference_range?: string; flag?: string }[] } | null = null
    if (result.extraction_schema_json) {
      try {
        parsed = typeof result.extraction_schema_json === 'string'
          ? JSON.parse(result.extraction_schema_json)
          : result.extraction_schema_json
      } catch {
        parsed = null
      }
    }

    return NextResponse.json({
      patient: parsed?.patient ?? null,
      biomarkers: (parsed?.biomarkers ?? []).map(b => ({
        name: b.name,
        value: b.value ?? null,
        unit: b.unit ?? null,
        reference_range: b.reference_range ?? null,
        flag: b.flag ?? null,
      })),
      parse_quality_score: result.parse_quality_score ?? null,
    })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Parse failed' }, { status: 500 })
  }
}
