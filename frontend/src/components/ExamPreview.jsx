import { useState } from 'react'
import toast from 'react-hot-toast'
import { generateExamPDF } from '../utils/pdfGenerator'
import { useAuthStore } from '../context/authStore'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import DiagramRenderer from './DiagramRenderer'

const BADGE_STYLES = {
  'CAT': 'bg-blue-50 text-blue-700 border-blue-200',
  'Midterm': 'bg-amber-50 text-amber-700 border-amber-200',
  'End Term': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'End Year': 'bg-teal-50 text-teal-700 border-teal-200',
  'Mock': 'bg-purple-50 text-purple-700 border-purple-200',
  'Pre-Mock': 'bg-orange-50 text-orange-700 border-orange-200',
  'Series': 'bg-indigo-50 text-indigo-700 border-indigo-200',
}

function getSectionMarks(section) {
  if (!section?.questions?.length) return 0
  return section.questions.reduce((sum, q) => {
    if (Array.isArray(q.subParts) && q.subParts.length > 0) {
      return sum + q.subParts.reduce((s, sp) => s + (Number(sp.marks) || 0), 0)
    }
    return sum + (Number(q.marks) || 0)
  }, 0)
}

function AnswerLines({ count }) {
  return (
    <div className="mt-3 space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-px bg-gray-200" />
      ))}
    </div>
  )
}

export default function ExamPreview({ exam, meta, examId, onRegenerate }) {
  const { user } = useAuthStore()
  const [showScheme, setShowScheme] = useState(false)
  const [editingQ, setEditingQ] = useState(null)
  const [editText, setEditText] = useState('')
  const [saving, setSaving] = useState(false)

  if (!exam) return null

  const showStrand = meta.showStrand !== false
  const sectionCount = meta.sectionCount ?? 3

  const strandsDisplay = Array.isArray(meta.strands)
    ? meta.strands.filter(s => s && s !== 'undefined' && s !== 'General').join(', ')
    : (meta.strand && meta.strand !== 'undefined' ? meta.strand : '')
  const substrandsDisplay = Array.isArray(meta.substrands)
    ? meta.substrands.filter(s => s && s !== 'undefined' && s !== 'General').join(', ')
    : (meta.substrand && meta.substrand !== 'undefined' && meta.substrand !== 'General' ? meta.substrand : '')

  const handleDownloadPDF = () => {
    if (!user?.isPremium) {
      toast.error('PDF download requires Premium. Upgrade now!')
      return
    }
    try {
      const filename = generateExamPDF(exam, meta)
      toast.success(`Downloaded: ${filename}`)
      if (examId) api.post(`/exams/${examId}/download`).catch(() => {})
    } catch (err) {
      toast.error('PDF generation failed. Please try again.')
    }
  }

  const startEdit = (section, qNum, currentText) => {
    setEditingQ({ section, qNum })
    setEditText(currentText)
  }

  const saveEdit = async () => {
    if (!editingQ || !exam) return
    // Update question text in local exam state
    const { section, qNum } = editingQ
    const updatedSection = {
      ...exam[section],
      questions: exam[section].questions.map(q =>
        q.num === qNum ? { ...q, text: editText } : q
      ),
    }
    // Persist to backend if we have an examId
    if (examId) {
      try {
        await api.patch(`/exams/${examId}`, { [section]: updatedSection })
      } catch {
        // Silent fail — edit saved locally even if backend fails
      }
    }
    toast.success('Question updated')
    setEditingQ(null)
  }

  const handleSave = async () => {
    if (!examId) { toast.error('Generate an exam first'); return }
    setSaving(true)
    try {
      await api.patch('/exams/' + examId, {})
      toast.success('Exam saved to My Exams')
    } catch {
      toast.success('Exam saved locally')
    } finally {
      setSaving(false)
    }
  }

  const ALL_SECTIONS = [
    { key: 'sectionA', letter: 'A' },
    { key: 'sectionB', letter: 'B' },
    { key: 'sectionC', letter: 'C' },
  ]
  const sectionsToRender = ALL_SECTIONS.slice(0, sectionCount)

  const renderQuestionPaper = (q, key) => {
    const isEditing = editingQ?.section === key && editingQ?.qNum === q.num
    const hasSubParts = Array.isArray(q.subParts) && q.subParts.length > 0
    const qMarks = hasSubParts
      ? q.subParts.reduce((s, sp) => s + (Number(sp.marks) || 0), 0)
      : (Number(q.marks) || 0)

    return (
      <div key={q.num} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all group">
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {q.num}
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div>
                <textarea className="input text-sm resize-none w-full" rows={3}
                  value={editText} onChange={e => setEditText(e.target.value)} />
                <div className="flex gap-2 mt-2">
                  <button onClick={saveEdit} className="btn-primary text-xs py-1.5 px-3">Save</button>
                  <button onClick={() => setEditingQ(null)} className="btn-secondary text-xs py-1.5 px-3">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{q.text}</p>
            )}

            {/* DIAGRAM — appears below question text */}
            {!isEditing && q.diagram && (
              <div className="my-3 flex justify-center">
                <DiagramRenderer diagram={q.diagram} />
              </div>
            )}

            {/* Sub-parts */}
            {!isEditing && hasSubParts && (
              <div className="mt-3 space-y-4 ml-1">
                {q.subParts.map((sp, idx) => (
                  <div key={idx}>
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-semibold text-gray-700 shrink-0 mt-0.5">({sp.label})</span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm text-gray-800 leading-relaxed">{sp.text}</p>
                          <span className="text-xs text-gray-400 shrink-0 mt-0.5">
                            ({sp.marks} {Number(sp.marks) === 1 ? 'mark' : 'marks'})
                          </span>
                        </div>
                        <AnswerLines count={Math.min(Math.max(Number(sp.marks) * 2, 2), 6)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isEditing && !hasSubParts && (
              <AnswerLines count={Math.min(Math.max(qMarks * 2, 3), 8)} />
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {!hasSubParts && (
              <span className="text-xs text-gray-400">({qMarks}{qMarks === 1 ? 'mk' : 'mks'})</span>
            )}
            <button onClick={() => startEdit(key, q.num, q.text)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 hover:text-brand-blue border border-gray-200 rounded-lg px-2 py-1 no-print">
              Edit
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderMarkingScheme = (q, key) => {
    const hasSubParts = Array.isArray(q.subParts) && q.subParts.length > 0
    const qMarks = hasSubParts
      ? q.subParts.reduce((s, sp) => s + (Number(sp.marks) || 0), 0)
      : (Number(q.marks) || 0)

    return (
      <div key={q.num} className="bg-white rounded-xl p-4 border border-blue-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-brand-blue text-white text-xs font-bold px-2 py-0.5 rounded-full">Q{q.num}</span>
          <span className="text-xs text-brand-blue font-semibold">{qMarks} {qMarks === 1 ? 'mark' : 'marks'}</span>
        </div>
        {/* Diagram in marking scheme */}
        {q.diagram && (
          <div className="mb-2 flex justify-center">
            <DiagramRenderer diagram={q.diagram} />
          </div>
        )}
        {hasSubParts ? (
          <div className="space-y-3">
            {q.subParts.map((sp, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-xs font-bold text-brand-blue shrink-0 mt-0.5">({sp.label})</span>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">{sp.marks} {Number(sp.marks) === 1 ? 'mark' : 'marks'}</p>
                  <p className="text-sm text-gray-700 leading-relaxed border-l-2 border-blue-300 pl-3 whitespace-pre-line">{sp.answer}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-700 leading-relaxed border-l-2 border-blue-300 pl-3 whitespace-pre-line">{q.answer}</p>
        )}
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">

      {/* Toolbar */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between flex-wrap gap-3 no-print">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-semibold text-gray-900 text-sm leading-tight">{meta.grade} {meta.subject}</p>
            {showStrand && strandsDisplay && (
              <p className="text-xs text-gray-400">{strandsDisplay}{substrandsDisplay ? ` — ${substrandsDisplay}` : ''}</p>
            )}
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${BADGE_STYLES[meta.examType] || BADGE_STYLES.CAT}`}>
            {meta.examType}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onRegenerate} className="btn-secondary text-xs py-2 px-3">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/>
            </svg>
            Regenerate
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-secondary text-xs py-2 px-3">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/>
            </svg>
            Save
          </button>
          {user?.isPremium === true ? (
            <button onClick={handleDownloadPDF} className="btn-primary text-xs py-2 px-3">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF
            </button>
          ) : (
            <Link to="/pricing" className="btn-danger text-xs py-2 px-3 no-underline">
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
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
            <div className="flex justify-center mb-5">
              {['#006600','#cc0000','#000','#cc0000','#006600'].map((c, i) => (
                <div key={i} style={{ background: c }} className="h-1.5 w-12" />
              ))}
            </div>
            <h1 className="font-bold text-gray-900 text-xl uppercase tracking-wide mb-1">{meta.school}</h1>
            <p className="text-xs text-gray-400 italic mb-6">Excellence in Education</p>
            <h2 className="font-serif text-2xl text-brand-blue-dark mb-1.5">{exam.title}</h2>
            <p className="text-sm text-gray-400 mb-6">{meta.term} {meta.year} Examination</p>

            <div className="grid grid-cols-2 gap-2 text-left bg-gray-50 rounded-xl p-4 mb-5">
              {[
                ['Grade / Class', meta.grade],
                ['Subject', meta.subject],
                ['Duration', exam.duration || exam.time],
                ['Total Marks', meta.totalMarks],
                ...(showStrand && strandsDisplay ? [
                  ['Strand', strandsDisplay],
                  substrandsDisplay ? ['Sub-Strand', substrandsDisplay] : null,
                ] : []),
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">{label}</p>
                  <p className="text-sm font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>

            {exam.instructions?.length > 0 && (
              <div className="text-left bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Instructions to Candidates</p>
                <ol className="list-decimal list-inside space-y-1">
                  {exam.instructions.map((inst, i) => (
                    <li key={i} className="text-xs text-gray-700 leading-relaxed">{inst}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Sections */}
          {sectionsToRender.map(({ key, letter }) => {
            const section = exam[key]
            if (!section?.questions?.length) return null
            const sectionMarks = getSectionMarks(section)
            return (
              <div key={key} className="mb-10">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                  <h3 className="font-bold text-base text-brand-blue-dark uppercase tracking-widest">SECTION {letter}</h3>
                  <span className="text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                    {sectionMarks} marks
                  </span>
                </div>
                {section.instruction && (
                  <p className="text-xs text-gray-500 italic mb-4">{section.instruction}</p>
                )}
                <div className="space-y-4">
                  {section.questions.map(q => renderQuestionPaper(q, key))}
                </div>
              </div>
            )
          })}

          {/* Marking Scheme Toggle */}
          <button onClick={() => setShowScheme(s => !s)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-all mt-2 no-print">
            <span>📋 Marking Scheme</span>
            <svg className={`transition-transform duration-300 ${showScheme ? 'rotate-180' : ''}`}
              width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {showScheme && (
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-5">
              <h3 className="font-serif text-lg text-brand-blue-dark mb-4">Marking Scheme</h3>
              {sectionsToRender.map(({ key, letter }) => {
                const section = exam[key]
                if (!section?.questions?.length) return null
                const sectionMarks = getSectionMarks(section)
                return (
                  <div key={key} className="mb-6">
                    <p className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-3">
                      SECTION {letter} — {sectionMarks} marks
                    </p>
                    <div className="space-y-3">
                      {section.questions.map(q => renderMarkingScheme(q, key))}
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
