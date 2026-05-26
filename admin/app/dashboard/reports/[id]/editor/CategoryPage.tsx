'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'
import type { BiomarkerRow } from '@/lib/biomarker-categories'

interface Props {
  categoryName: string
  rows: BiomarkerRow[]
  noteHtml: string
  patientName: string
  patientEmail: string
  productTitle: string
  sampleDateFormatted: string
  bioCount: number
  pageIndex: number
  totalCategories: number
  onRowChange: (i: number, field: keyof BiomarkerRow, val: string) => void
  onAddRow: () => void
  onRemoveRow: (i: number) => void
  onNoteChange: (html: string) => void
}

const FLAG_CLS: Record<string, string> = {
  HIGH: 'text-[#D00000] font-bold',
  LOW: 'text-[#ff8c00] font-bold',
  Normal: 'text-[#228B22] font-bold',
  NORMAL: 'text-[#228B22] font-bold',
}

const ToolBtn = ({ onClick, title, children, active }: {
  onClick: () => void; title: string; children: React.ReactNode; active?: boolean
}) => (
  <button type="button" onClick={onClick} title={title}
    className={`flex h-6 w-6 items-center justify-center rounded-[4px] transition ${active ? 'bg-[#02034a] text-white' : 'text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#02034a]'}`}>
    {children}
  </button>
)

export default function CategoryPage({
  categoryName, rows, noteHtml,
  patientName, patientEmail, productTitle, sampleDateFormatted,
  pageIndex, onRowChange, onAddRow, onRemoveRow, onNoteChange,
}: Props) {

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Add clinical commentary for this category…' }),
    ],
    content: noteHtml,
    editorProps: {
      attributes: { class: 'focus:outline-none text-[10pt] leading-[1.8] text-[#0d104b] text-justify' },
    },
    onUpdate: ({ editor }) => onNoteChange(editor.getHTML()),
  })

  // Sync content if noteHtml changes externally (e.g. on load)
  useEffect(() => {
    if (editor && noteHtml && editor.getHTML() !== noteHtml) {
      editor.commands.setContent(noteHtml)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="a4-page bg-white shadow-[0_4px_32px_rgba(2,3,74,.10)] print:shadow-none"
      style={{ width: '210mm', minHeight: '297mm', padding: '12mm', paddingBottom: '16mm', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}
    >
      <div style={{ flex: 1 }}>
        {/* Page header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', paddingBottom: '15px', borderBottom: '2px solid #666' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://res.cloudinary.com/dky6bti4g/image/upload/v1760604400/Logo_Transparent_ks8ufb.png" alt="AiwasLabs" style={{ maxWidth: '160px', height: 'auto' }} />
          <div style={{ fontFamily: 'Merriweather, serif', fontSize: '18pt', fontWeight: 700, color: '#0d104b', textAlign: 'right' }}>{categoryName}</div>
        </div>

        {/* Patient info boxes (only on first category page) */}
        {pageIndex === 0 && (
          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, border: '2px solid #CFCFCF', padding: '8px 12px', borderRadius: '8px' }}>
              <p style={{ fontSize: '10pt', marginBottom: '3px' }}><strong>Patient:</strong> {patientName}</p>
              <p style={{ fontSize: '10pt' }}><strong>Email:</strong> {patientEmail}</p>
            </div>
            <div style={{ flex: 1, border: '2px solid #CFCFCF', padding: '8px 12px', borderRadius: '8px' }}>
              <p style={{ fontSize: '10pt', marginBottom: '3px' }}><strong>Test:</strong> {productTitle}</p>
              <p style={{ fontSize: '10pt' }}><strong>Sample Date:</strong> {sampleDateFormatted}</p>
            </div>
          </div>
        )}

        {/* GENERAL COMMENT header + table */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 0 }}>
          <p style={{ fontSize: '11pt', fontWeight: 600, color: '#0077b6', background: '#E8E8E8', padding: '4px 14px', borderRadius: '6px 6px 0 0', margin: 0 }}>
            GENERAL COMMENT
          </p>
          <button onClick={onAddRow} className="no-print mb-0.5 font-poppins text-[10.5px] font-bold text-[#00B4D8] hover:underline">+ Add row</button>
        </div>
        <p className="hidden print:block" style={{ fontSize: '11pt', fontWeight: 600, color: '#0077b6', background: '#E8E8E8', padding: '4px 14px', borderRadius: '6px 6px 0 0', margin: 0, marginBottom: 0 }}>
          GENERAL COMMENT
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt', border: '2px solid #E8E8E8', borderTop: 'none' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #0d104b' }}>
              {['TEST', 'RESULT', 'FLAG', 'UNITS', 'REFERENCE INTERVAL', ''].map((h, i) => (
                <th key={h + i} style={{ textAlign: 'left', padding: '8px 5px', fontWeight: 700, fontSize: '10pt' }}
                  className={i === 5 ? 'no-print' : ''}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((b, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #ddd' }} className="group/row">
                <td style={{ padding: '7px 5px' }}>
                  <input value={b.name} onChange={e => onRowChange(i, 'name', e.target.value)}
                    className="no-print w-full border-0 bg-transparent outline-none focus:bg-[#f0f8ff] focus:px-1 focus:rounded transition" style={{ fontSize: '10pt', color: '#0d104b' }} />
                  <span className="hidden print:inline" style={{ fontSize: '10pt' }}>{b.name}</span>
                </td>
                <td style={{ padding: '7px 5px' }}>
                  <input value={b.value ?? ''} onChange={e => onRowChange(i, 'value', e.target.value)}
                    className={`no-print w-20 border-0 bg-transparent outline-none focus:bg-[#f0f8ff] focus:px-1 focus:rounded transition ${FLAG_CLS[b.flag ?? ''] ?? ''}`}
                    style={{ fontSize: '10pt', fontWeight: 'bold' }} />
                  <strong className={`hidden print:inline ${FLAG_CLS[b.flag ?? ''] ?? 'text-[#0d104b]'}`} style={{ fontSize: '10pt' }}>{b.value ?? '—'}</strong>
                </td>
                <td style={{ padding: '7px 5px' }}>
                  <div className="no-print">
                    <select value={b.flag ?? ''} onChange={e => onRowChange(i, 'flag', e.target.value)}
                      className={`border-0 bg-transparent outline-none font-bold ${FLAG_CLS[b.flag ?? ''] ?? 'text-[#0d104b]'}`} style={{ fontSize: '10pt' }}>
                      <option value="">–</option>
                      <option value="Normal">Normal</option>
                      <option value="HIGH">High</option>
                      <option value="LOW">Low</option>
                      <option value="N/A">N/A</option>
                    </select>
                  </div>
                  <span className={`hidden print:inline font-bold ${FLAG_CLS[b.flag ?? ''] ?? 'text-[#6b7280]'}`} style={{ fontSize: '10pt' }}>{b.flag || '–'}</span>
                </td>
                <td style={{ padding: '7px 5px' }}>
                  <input value={b.unit ?? ''} onChange={e => onRowChange(i, 'unit', e.target.value)}
                    className="no-print w-16 border-0 bg-transparent outline-none focus:bg-[#f0f8ff] focus:px-1 focus:rounded transition" style={{ fontSize: '10pt', color: '#0d104b' }} />
                  <span className="hidden print:inline" style={{ fontSize: '10pt' }}>{b.unit ?? ''}</span>
                </td>
                <td style={{ padding: '7px 5px' }}>
                  <input value={b.reference_range ?? ''} onChange={e => onRowChange(i, 'reference_range', e.target.value)}
                    className="no-print w-28 border-0 bg-transparent outline-none focus:bg-[#f0f8ff] focus:px-1 focus:rounded transition" style={{ fontSize: '10pt', color: '#6b7280' }} />
                  <span className="hidden print:inline" style={{ fontSize: '10pt', color: '#6b7280' }}>{b.reference_range ?? ''}</span>
                </td>
                <td style={{ padding: '7px 5px' }} className="no-print">
                  <button onClick={() => onRemoveRow(i)}
                    className="invisible flex h-5 w-5 items-center justify-center rounded text-[#6b7280] hover:bg-red-50 hover:text-red-400 transition group-hover/row:visible">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* NOTE section */}
        <div style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '11pt', fontWeight: 400, background: '#E8E8E8', color: '#00B4D8', padding: '8px 14px', borderRadius: '6px 6px 0 0', margin: 0 }}>
            NOTE
          </p>

          {editor && (
            <div className="no-print flex items-center gap-1 border-x-2 border-[#E8E8E8] bg-[#fafafa] px-2 py-1">
              <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} title="Bold" active={editor.isActive('bold')}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 4h8a4 4 0 010 8H6zM6 12h9a4 4 0 010 8H6z"/></svg>
              </ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic" active={editor.isActive('italic')}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
              </ToolBtn>
              <ToolBtn onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline" active={editor.isActive('underline')}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 3v7a6 6 0 0012 0V3M4 21h16"/></svg>
              </ToolBtn>
              <div className="mx-1 h-3 w-px bg-[#dde4f0]" />
              <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list" active={editor.isActive('bulletList')}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>
              </ToolBtn>
            </div>
          )}

          <div style={{ border: '2px solid #E8E8E8', borderTop: 'none', padding: '10px 14px', borderRadius: '0 0 6px 6px', minHeight: '70px', fontSize: '10pt', lineHeight: 1.8, color: '#0d104b' }}>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>

      {/* Page footer */}
      <div style={{ textAlign: 'center', fontSize: '10pt', paddingTop: '12px', borderTop: '1px solid #ccc', color: '#0d104b', marginTop: 'auto' }}>
        AiwasLabs · Private Blood Testing · {sampleDateFormatted}
      </div>
    </div>
  )
}
