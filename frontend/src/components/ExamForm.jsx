import { useState, useEffect } from 'react'
import {
  CBC_CURRICULUM, SUBSTRANDS, EXAM_TYPES, TERMS,
  MARKS_OPTIONS, QUESTIONS_OPTIONS, GRADE_STATUS,
  CAT_MARKS_OPTIONS, getExamTypeMarks,
} from '../utils/curriculumData'
import { useAuthStore } from '../context/authStore'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const getDefaultSectionCount = (examType) => {
  if (['End Term', 'End Year', 'Mock', 'Pre-Mock', 'Series'].includes(examType)) return 3
  if (examType === 'Midterm') return 2
  return 1
}

export default function ExamForm({ onGenerate, loading }) {
  const { user } = useAuthStore()

  const [form, setForm] = useState({
    grade: '',
    subject: '',
    strands: [],
    substrands: [],
    examType: 'CAT',
    term: 'Term 1',
    year: new Date().getFullYear().toString(),
    totalMarks: 30,
    totalQuestions: 10,
    school: user?.school || '',
    sectionCount: 1,
    showStrand: true,
    includePractical: false,
  })

  const [subjects, setSubjects] = useState([])
  const [availableStrands, setAvailableStrands] = useState([])
  const [availableSubstrands, setAvailableSubstrands] = useState([])

  useEffect(() => {
    if (form.grade && CBC_CURRICULUM[form.grade]) {
      setSubjects(CBC_CURRICULUM[form.grade].subjects || [])
      setAvailableStrands([])
      setAvailableSubstrands([])
      setForm(f => ({ ...f, subject: '', strands: [], substrands: [] }))
    }
  }, [form.grade])

  useEffect(() => {
    if (form.grade && form.subject && CBC_CURRICULUM[form.grade]?.strands?.[form.subject]) {
      setAvailableStrands(CBC_CURRICULUM[form.grade].strands[form.subject])
      setAvailableSubstrands([])
      setForm(f => ({ ...f, strands: [], substrands: [] }))
    }
  }, [form.subject, form.grade])

  useEffect(() => {
    if (form.strands.length > 0) {
      const subs = form.strands.flatMap(s => SUBSTRANDS[s] || [])
      setAvailableSubstrands([...new Set(subs)])
      setForm(f => ({ ...f, substrands: [] }))
    } else {
      setAvailableSubstrands([])
    }
  }, [form.strands])

  // Auto-update sections and marks when exam type or subject changes
  useEffect(() => {
    const newSections = getDefaultSectionCount(form.examType)
    const autoMarks = form.subject ? getExamTypeMarks(form.subject, form.examType) : null
    setForm(f => ({
      ...f,
      sectionCount: newSections,
      totalMarks: autoMarks !== null ? autoMarks : (
        ['End Term', 'End Year', 'Mock', 'Pre-Mock', 'Series'].includes(form.examType)
          ? 100
          : form.examType === 'CAT' ? 30 : f.totalMarks
      ),
    }))
  }, [form.examType, form.subject])

  const handleGradeClick = (grade, status) => {
    if (!status.active) {
      toast(grade + ' will be available from ' + status.launchDate + '. Currently only Grade 10 is available.', {
        icon: '🔒',
        duration: 5000,
        style: { maxWidth: '340px' },
      })
      return
    }
    setForm(f => ({ ...f, grade, subject: '', strands: [], substrands: [] }))
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const toggleStrand = (strand) => setForm(f => ({
    ...f,
    strands: f.strands.includes(strand) ? f.strands.filter(s => s !== strand) : [...f.strands, strand],
  }))

  const toggleSubstrand = (sub) => setForm(f => ({
    ...f,
    substrands: f.substrands.includes(sub) ? f.substrands.filter(s => s !== sub) : [...f.substrands, sub],
  }))

  const freeLeft = Math.max(0, 10 - (user?.freeGenerationsUsed || 0))
  const isPremium = user?.isPremium
  const canGenerate = isPremium || freeLeft > 0

  // Auto-marks for full exams
  const isAutoMarks = form.subject && ['End Term', 'End Year', 'Mock', 'Pre-Mock', 'Series'].includes(form.examType)
  const marksOptions = form.examType === 'CAT' ? CAT_MARKS_OPTIONS : MARKS_OPTIONS

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canGenerate || form.strands.length === 0 || !form.grade) return
    onGenerate(form)
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-100 overflow-y-auto">
      <div className="p-5 border-b border-gray-100">
        <h2 className="font-serif text-xl text-gray-900 mb-1">Exam Generator</h2>
        <p className="text-xs text-gray-400">CBC Senior School — Grade 10 exams with marking scheme.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 p-5 space-y-4">

        {/* School */}
        <div>
          <label className="label">School / Assessment Name</label>
          <input className="input" type="text" placeholder="e.g. Kaplamboi Senior School"
            value={form.school} onChange={set('school')} required />
        </div>

        <div className="h-px bg-gray-100" />

        {/* Grade — button selector */}
        <div>
          <label className="label">Grade</label>
          <div className="space-y-2">
            {Object.entries(GRADE_STATUS).map(([grade, status]) => (
              <button
                key={grade}
                type="button"
                onClick={() => handleGradeClick(grade, status)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                  !status.active
                    ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed'
                    : form.grade === grade
                    ? 'bg-brand-blue border-brand-blue text-white shadow-lg shadow-brand-blue/20'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-brand-blue hover:text-brand-blue'
                }`}
              >
                <span>{status.label}</span>
                <span className={`text-xs font-normal px-2 py-0.5 rounded-full ${
                  !status.active
                    ? 'bg-amber-100 text-amber-600'
                    : form.grade === grade
                    ? 'bg-white/20 text-white'
                    : 'bg-green-50 text-green-600'
                }`}>
                  {status.note}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Subject */}
        {subjects.length > 0 && (
          <div>
            <label className="label">Subject</label>
            <div className="relative">
              <select className="select pr-9" value={form.subject} onChange={set('subject')} required>
                <option value="">— Select Subject —</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <svg className="absolute right-3 top-3 text-gray-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        )}

        {/* Strands */}
        {availableStrands.length > 0 && (
          <div>
            <label className="label">Strand(s) <span className="text-gray-400 font-normal ml-1">— select one or more</span></label>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1">
              {availableStrands.map(strand => (
                <button key={strand} type="button" onClick={() => toggleStrand(strand)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                    form.strands.includes(strand)
                      ? 'bg-brand-blue border-brand-blue text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-brand-blue hover:text-brand-blue'
                  }`}>{strand}</button>
              ))}
            </div>
            {form.strands.length === 0 && <p className="text-xs text-brand-red mt-1">Select at least one strand</p>}
          </div>
        )}

        {/* Sub-strands */}
        {availableSubstrands.length > 0 && (
          <div>
            <label className="label">Sub-Strand(s) <span className="text-gray-300 font-normal ml-1">(optional)</span></label>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1">
              {availableSubstrands.map(sub => (
                <button key={sub} type="button" onClick={() => toggleSubstrand(sub)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                    form.substrands.includes(sub)
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-500 hover:text-emerald-600'
                  }`}>{sub}</button>
              ))}
            </div>
          </div>
        )}

        <div className="h-px bg-gray-100" />

        {/* Exam Type */}
        <div>
          <label className="label">Exam Type</label>
          <div className="flex flex-wrap gap-1.5">
            {EXAM_TYPES.map(t => (
              <button key={t} type="button" onClick={() => setForm(f => ({ ...f, examType: t }))}
                className={`flex-1 min-w-fit py-2 px-2 text-xs font-bold rounded-xl border-2 transition-all ${
                  form.examType === t
                    ? 'bg-brand-blue border-brand-blue text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-brand-blue hover:text-brand-blue'
                }`}>{t}</button>
            ))}
          </div>
        </div>

        {/* Number of Sections */}
        <div>
          <label className="label">Sections <span className="text-gray-400 font-normal ml-1 text-xs">— auto-set, override if needed</span></label>
          <div className="flex gap-2">
            {[1, 2, 3].map(n => (
              <button key={n} type="button" onClick={() => setForm(f => ({ ...f, sectionCount: n }))}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border-2 transition-all ${
                  form.sectionCount === n
                    ? 'bg-brand-blue border-brand-blue text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-brand-blue hover:text-brand-blue'
                }`}>{n} {n === 1 ? 'Sec' : 'Secs'}</button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {form.sectionCount === 1 && 'Good for CATs and quick tests'}
            {form.sectionCount === 2 && 'Good for Midterm exams'}
            {form.sectionCount === 3 && 'Good for End Term, Mock, Pre-Mock'}
          </p>
        </div>

        {/* Marks + Questions */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Total Marks</label>
            {isAutoMarks ? (
              <div className="input bg-gray-50 flex items-center gap-1 text-gray-700 font-semibold">
                {form.totalMarks} <span className="text-xs text-gray-400 font-normal">(auto)</span>
              </div>
            ) : (
              <div className="relative">
                <select className="select pr-8" value={form.totalMarks}
                  onChange={e => setForm(f => ({ ...f, totalMarks: Number(e.target.value) }))}>
                  {marksOptions.map(m => <option key={m} value={m}>{m} marks</option>)}
                </select>
                <svg className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
            )}
          </div>
          <div>
            <label className="label">Questions</label>
            <div className="relative">
              <select className="select pr-8" value={form.totalQuestions}
                onChange={e => setForm(f => ({ ...f, totalQuestions: Number(e.target.value) }))}>
                {QUESTIONS_OPTIONS.map(q => <option key={q} value={q}>{q} Qs</option>)}
              </select>
              <svg className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
        </div>

        {/* Term + Year */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Term</label>
            <div className="relative">
              <select className="select pr-8" value={form.term} onChange={set('term')}>
                {TERMS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <svg className="absolute right-2.5 top-3 text-gray-400 pointer-events-none" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div>
            <label className="label">Year</label>
            <input className="input" type="number" value={form.year} onChange={set('year')} min="2024" max="2035" />
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Toggles */}
        {[
          { key: 'showStrand', label: 'Show Strand on header', desc: 'Display strand & sub-strand on cover page' },
          { key: 'includePractical', label: 'Include Practical Section', desc: 'Add practical/project questions (optional)' },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-gray-700">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
            <button type="button"
              onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form[key] ? 'bg-brand-blue' : 'bg-gray-300'}`}>
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form[key] ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        ))}

        <div className="h-px bg-gray-100" />

        {/* Info boxes */}
        {form.examType === 'CAT' && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <p className="text-xs text-amber-700 font-medium">📌 CAT: 30–40 marks per CBC guidelines.</p>
          </div>
        )}
        {isAutoMarks && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
            <p className="text-xs text-emerald-700 font-medium">
              ✅ {form.subject} {form.examType} auto-set to {form.totalMarks} marks (CBC curriculum requirement).
            </p>
          </div>
        )}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
          <p className="text-xs font-semibold text-brand-blue mb-1">📝 Question Format</p>
          <p className="text-xs text-blue-600 leading-relaxed">
            Kenyan contextual scenarios, (a)(b)(c)(i)(ii)(iii) sub-parts, diagrams where needed, full marking scheme.
          </p>
        </div>

        {/* Generate button */}
        <button type="submit"
          disabled={loading || !canGenerate || form.strands.length === 0 || !form.grade}
          className="w-full py-3.5 bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-lg shadow-brand-blue/20">
          {loading ? (
            <><svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>Generating...</>
          ) : (
            <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>Generate Exam</>
          )}
        </button>

        {/* Usage */}
        {!isPremium && (
          <div className="pt-1">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>Free generations used</span>
              <span className={freeLeft === 0 ? 'text-brand-red font-bold' : ''}>{user?.freeGenerationsUsed || 0} / 10</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-blue to-brand-red rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((user?.freeGenerationsUsed || 0) / 10) * 100)}%` }} />
            </div>
            {freeLeft === 0 ? (
              <p className="text-xs text-brand-red mt-1.5 text-center font-medium">
                Limit reached. <Link to="/pricing" className="underline font-bold">Upgrade to Premium →</Link>
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-1.5 text-center">
                {freeLeft} free generation{freeLeft !== 1 ? 's' : ''} remaining.{' '}
                <Link to="/pricing" className="text-brand-blue font-medium hover:underline">Upgrade</Link>
              </p>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
