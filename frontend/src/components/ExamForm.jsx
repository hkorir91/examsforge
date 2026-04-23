```jsx
import { useState, useEffect } from 'react'
import {
  CBC_CURRICULUM, SUBSTRANDS, EXAM_TYPES, TERMS, GRADE_STATUS
} from '../utils/curriculumData'
import { useAuthStore } from '../context/authStore'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

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
    school: user?.school || '',
  })

  const [subjects, setSubjects] = useState([])
  const [availableStrands, setAvailableStrands] = useState([])
  const [availableSubstrands, setAvailableSubstrands] = useState([])

  // -------------------------------
  // 📚 LOAD SUBJECTS
  // -------------------------------
  useEffect(() => {
    if (form.grade && CBC_CURRICULUM[form.grade]) {
      setSubjects(CBC_CURRICULUM[form.grade].subjects || [])
      setAvailableStrands([])
      setAvailableSubstrands([])
      setForm(f => ({ ...f, subject: '', strands: [], substrands: [] }))
    }
  }, [form.grade])

  // -------------------------------
  // 🧩 LOAD STRANDS
  // -------------------------------
  useEffect(() => {
    if (form.grade && form.subject && CBC_CURRICULUM[form.grade]?.strands?.[form.subject]) {
      setAvailableStrands(CBC_CURRICULUM[form.grade].strands[form.subject])
      setAvailableSubstrands([])
      setForm(f => ({ ...f, strands: [], substrands: [] }))
    }
  }, [form.subject, form.grade])

  // -------------------------------
  // 🔍 LOAD SUBSTRANDS
  // -------------------------------
  useEffect(() => {
    if (form.strands.length > 0) {
      const subs = form.strands.flatMap(s => SUBSTRANDS[s] || [])
      setAvailableSubstrands([...new Set(subs)])
      setForm(f => ({ ...f, substrands: [] }))
    } else {
      setAvailableSubstrands([])
    }
  }, [form.strands])

  // -------------------------------
  // 🎯 HANDLERS
  // -------------------------------
  const handleGradeClick = (grade, status) => {
    if (!status.active) {
      toast(`${grade} will be available from ${status.launchDate}`, {
        icon: '🔒',
        duration: 4000,
      })
      return
    }
    setForm(f => ({ ...f, grade, subject: '', strands: [], substrands: [] }))
  }

  const set = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.value }))

  const toggleStrand = (strand) =>
    setForm(f => ({
      ...f,
      strands: f.strands.includes(strand)
        ? f.strands.filter(s => s !== strand)
        : [...f.strands, strand],
    }))

  const toggleSubstrand = (sub) =>
    setForm(f => ({
      ...f,
      substrands: f.substrands.includes(sub)
        ? f.substrands.filter(s => s !== sub)
        : [...f.substrands, sub],
    }))

  // -------------------------------
  // 🔐 LIMITS
  // -------------------------------
  const freeLeft = Math.max(0, 3 - (user?.freeGenerationsUsed || 0))
  const isPremium = user?.isPremium
  const canGenerate = isPremium || freeLeft > 0

  // -------------------------------
  // 🚀 SUBMIT
  // -------------------------------
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.grade) return toast.error("Select grade")
    if (!form.subject) return toast.error("Select subject")
    if (form.strands.length === 0) return toast.error("Select at least one strand")

    // ✅ SEND ONLY WHAT ENGINE NEEDS
    onGenerate({
      subject: form.subject,
      grade: form.grade,
      strands: form.strands,
      substrands: form.substrands,
      examType: form.examType,
      school: form.school,
      term: form.term,
      year: form.year
    })
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-100 overflow-y-auto">

      <div className="p-5 border-b border-gray-100">
        <h2 className="font-serif text-xl text-gray-900 mb-1">Exam Generator</h2>
        <p className="text-xs text-gray-400">Structured CBC exam generation</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 p-5 space-y-4">

        {/* School */}
        <div>
          <label className="label">School</label>
          <input className="input" value={form.school} onChange={set('school')} required />
        </div>

        {/* Grade */}
        <div>
          <label className="label">Grade</label>
          <div className="space-y-2">
            {Object.entries(GRADE_STATUS).map(([grade, status]) => (
              <button key={grade} type="button"
                onClick={() => handleGradeClick(grade, status)}
                className={`w-full py-2 rounded-lg border ${
                  form.grade === grade ? 'bg-brand-blue text-white' : 'bg-white'
                }`}>
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject */}
        {subjects.length > 0 && (
          <div>
            <label className="label">Subject</label>
            <select className="select" value={form.subject} onChange={set('subject')}>
              <option value="">Select</option>
              {subjects.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        )}

        {/* Strands */}
        {availableStrands.length > 0 && (
          <div>
            <label className="label">Strands</label>
            <div className="flex flex-wrap gap-2">
              {availableStrands.map(strand => (
                <button key={strand} type="button"
                  onClick={() => toggleStrand(strand)}
                  className={`px-3 py-1 rounded ${
                    form.strands.includes(strand)
                      ? 'bg-brand-blue text-white'
                      : 'bg-gray-100'
                  }`}>
                  {strand}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Substrands */}
        {availableSubstrands.length > 0 && (
          <div>
            <label className="label">Sub-strands (optional)</label>
            <div className="flex flex-wrap gap-2">
              {availableSubstrands.map(sub => (
                <button key={sub} type="button"
                  onClick={() => toggleSubstrand(sub)}
                  className={`px-3 py-1 rounded ${
                    form.substrands.includes(sub)
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100'
                  }`}>
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Exam Type */}
        <div>
          <label className="label">Exam Type</label>
          <select className="select" value={form.examType} onChange={set('examType')}>
            {EXAM_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Submit */}
        <button type="submit"
          disabled={loading || !canGenerate}
          className="w-full py-3 bg-brand-blue text-white rounded-lg">
          {loading ? "Generating..." : "Generate Exam"}
        </button>

        {/* Usage */}
        {!isPremium && (
          <p className="text-xs text-center text-gray-400">
            {freeLeft} free generations left
          </p>
        )}

      </form>
    </div>
  )
}
```
