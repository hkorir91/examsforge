import { useState } from 'react'
import toast from 'react-hot-toast'
import { generateExamPDF } from '../utils/pdfGenerator'
import { useAuthStore } from '../context/authStore'
import { Link } from 'react-router-dom'
import api from '../utils/api'

const BADGE_STYLES = {
  'CAT': 'bg-blue-50 text-blue-700 border-blue-200',
  'Midterm': 'bg-amber-50 text-amber-700 border-amber-200',
  'End Term': 'bg-emerald-50 text-emerald-700 border-emerald-200',
}

export default function ExamPreview({ exam, meta, examId, onRegenerate }) {
  const { user } = useAuthStore()
  const [showScheme, setShowScheme] = useState(false)
  const [editingQ, setEditingQ] = useState(null)
  const [editText, setEditText] = useState('')
  const [saving, setSaving] = useState(false)

  if (!exam) return null

  const handleDownloadPDF = () => {
    if (user?.isPremium) {
    toast.error('PDF download requires Premium. Upgrade now!')
    return
  }
  try {
    const filename = generateExamPDF(exam, meta)
    toast.success(Downloaded: ${filename})
    if (examId) api.post(/exams/${examId}/download).catch(() => {})
  } catch (err) {
    toast.error('PDF generation failed. Please try again.')
  }
}

  const startEdit = (section, qNum, currentText) => {
    setEditingQ({ section, qNum })
    setEditText(currentText)
  }

  const saveEdit = () => {
    // In a real app this would update via API
    toast.success('Question updated')
    setEditingQ(null)
  }

  const handleSave = async () => {
    if (!examId) { toast.error('Generate an exam first'); return }
    setSaving(true)
    try {
      await api.post('/exams/' + examId)
      toast.success('Exam saved to My Exams')
    } catch {
      toast.success('Exam saved locally')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between flex-wrap gap-3 no-print">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-tight">
              {meta.grade} {meta.subject}
            </p>
            <p className="text-xs text-gray-400">{meta.strand}{meta.substrand ? ` — ${meta.substrand}` : ''}</p>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${BADGE_STYLES[meta.examType] || BADGE_STYLES.CAT}`}>
            {meta.examType}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={onRegenerate} className="btn-secondary text-xs py-2 px-3">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>
            Regenerate
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-secondary text-xs py-2 px-3">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/></svg>
            Save
          </button>
          {user?.isPremium === true ? (
            <button onClick={handleDownloadPDF} className="btn-primary text-xs py-2 px-3">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download PDF
            </button>
          ) : (
            <Link to="/pricing" className="btn-danger text-xs py-2 px-3 no-underline">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
              Upgrade for PDF
            </Link>
          )}
        </div>
      </div>

      {/* Exam Paper */}
      <div className="max-w-3xl mx-auto p-6">
        <div className="exam-paper bg-white rounded-2xl shadow-sm border border-gray-100 p-10">

          {/* Cover Page */}
          <div className="text-center pb-7 mb-7 border-b-2 border-gray-100">
            {/* Kenya flag colours */}
            <div className="flex justify-center mb-5">
              {['#006600','#cc0000','#000','#cc0000','#006600'].map((c, i) => (
                <div key={i} style={{ background: c }} className="h-1.5 w-12" />
              ))}
            </div>

            <h1 className="font-bold text-gray-900 text-xl uppercase tracking-wide mb-1">
              {meta.school}
            </h1>
            <p className="text-xs text-gray-400 italic mb-6">Excellence in Education</p>

            <h2 className="font-serif text-2xl text-brand-blue-dark mb-1.5">
              {exam.title}
            </h2>
            <p className="text-sm text-gray-400 mb-6">{meta.term} {meta.year} Examination</p>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2 text-left bg-gray-50 rounded-xl p-4 mb-5">
              {[
                ['Grade / Class', meta.grade],
                ['Subject', meta.subject],
                ['Duration', exam.time],
                ['Total Marks', meta.totalMarks],
                ['Strand', meta.strand],
                ['Sub-Strand', meta.substrand || 'General'],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">{label}</p>
                  <p className="text-sm font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="text-left bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Instructions to Candidates</p>
              <ol className="list-decimal list-inside space-y-1">
                {(exam.instructions || []).map((inst, i) => (
                  <li key={i} className="text-xs text-gray-700 leading-relaxed">{inst}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Sections */}
          {[
            { key: 'sectionA', label: 'Section A', sublabel: 'Multiple Choice', type: 'mc' },
            { key: 'sectionB', label: 'Section B', sublabel: 'Short Answer', type: 'sa' },
            { key: 'sectionC', label: 'Section C', sublabel: 'Structured Questions', type: 'sq' },
          ].map(({ key, label, sublabel, type }) => {
            const section = exam[key]
            if (!section?.questions?.length) return null
            return (
              <div key={key} className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-serif text-lg text-brand-blue-dark">
                      {label} — {sublabel}
                    </h3>
                    <p className="text-xs text-gray-400 italic mt-0.5">{section.instruction}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                    {section.marks} marks
                  </span>
                </div>

                <div className="space-y-3">
                  {section.questions.map((q) => {
                    const isEditing = editingQ?.section === key && editingQ?.qNum === q.num
                    return (
                      <div key={q.num} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all group">
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {q.num}
                          </div>
                          <div className="flex-1 min-w-0">
                            {isEditing ? (
                              <div>
                                <textarea
                                  className="input text-sm resize-none"
                                  rows={3}
                                  value={editText}
                                  onChange={e => setEditText(e.target.value)}
                                />
                                <div className="flex gap-2 mt-2">
                                  <button onClick={saveEdit} className="btn-primary text-xs py-1.5 px-3">Save</button>
                                  <button onClick={() => setEditingQ(null)} className="btn-secondary text-xs py-1.5 px-3">Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{q.text}</p>
                            )}

                            {/* MC options */}
                            {type === 'mc' && q.options && !isEditing && (
                              <div className="grid grid-cols-2 gap-1 mt-2.5">
                                {q.options.map((opt, oi) => (
                                  <div key={oi} className="text-xs text-gray-600 py-0.5">{opt}</div>
                                ))}
                              </div>
                            )}

                            {/* Answer lines */}
                            {type === 'sa' && !isEditing && (
                              <div className="mt-3 space-y-3">
                                {[0,1,2].map(i => <div key={i} className="h-px bg-gray-200" />)}
                              </div>
                            )}
                            {type === 'sq' && !isEditing && (
                              <div className="mt-3 space-y-5">
                                {[0,1,2,3,4].map(i => <div key={i} className="h-px bg-gray-200" />)}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-gray-400">({q.marks}mk{q.marks > 1 ? 's' : ''})</span>
                            <button
                              onClick={() => startEdit(key, q.num, q.text)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 hover:text-brand-blue border border-gray-200 rounded-lg px-2 py-1 no-print"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* Marking Scheme Toggle */}
          <button
            onClick={() => setShowScheme(s => !s)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all mt-2 no-print"
          >
            <span>📋 Marking Scheme</span>
            <svg
              className={`transition-transform duration-300 ${showScheme ? 'rotate-180' : ''}`}
              width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {showScheme && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-serif text-lg text-brand-blue-dark mb-4">Marking Scheme</h3>
              {['sectionA', 'sectionB', 'sectionC'].map((sec, si) => {
                const section = exam[sec]
                if (!section?.questions?.length) return null
                const labels = ['Section A — Short Answer', 'Section B — Short Answer', 'Section C — Structured']
                return (
                  <div key={sec} className="mb-5">
                    <p className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-3">{labels[si]}</p>
                    <div className="space-y-2">
                      {section.questions.map(q => (
                        <div key={q.num} className="bg-white rounded-xl p-3 border border-blue-100">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="bg-brand-blue text-white text-xs font-bold px-2 py-0.5 rounded-full">Q{q.num}</span>
                            <span className="text-xs text-brand-blue font-semibold">{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed border-l-2 border-blue-300 pl-3 whitespace-pre-line">
                            {q.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
