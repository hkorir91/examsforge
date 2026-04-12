import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'

const TYPE_STYLES = {
  'CAT': 'bg-blue-50 text-blue-700',
  'Midterm': 'bg-amber-50 text-amber-700',
  'End Term': 'bg-emerald-50 text-emerald-700',
}

export default function MyExamsPage() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ grade: '', subject: '', examType: '' })
  const navigate = useNavigate()

  useEffect(() => { fetchExams() }, [filter])

  const fetchExams = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filter.grade) params.append('grade', filter.grade)
      if (filter.subject) params.append('subject', filter.subject)
      if (filter.examType) params.append('examType', filter.examType)
      const { data } = await api.get('/exams?' + params)
      setExams(data.exams)
    } catch {
      toast.error('Could not load exams')
    } finally {
      setLoading(false)
    }
  }

  const deleteExam = async (id, e) => {
    e.stopPropagation()
    if (!confirm('Delete this exam? This cannot be undone.')) return
    try {
      await api.delete('/exams/' + id)
      setExams(prev => prev.filter(ex => ex._id !== id))
      toast.success('Exam deleted')
    } catch {
      toast.error('Could not delete exam')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-gray-900 mb-1">My Exams</h1>
          <p className="text-sm text-gray-400">{exams.length} saved exam{exams.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/generate" className="btn-primary text-sm py-2.5">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Exam
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {[
          { key: 'examType', options: ['', 'CAT', 'Midterm', 'End Term'], placeholder: 'All Types' },
          { key: 'grade', options: ['', 'Grade 7', 'Grade 8', 'Grade 9', 'Form 1', 'Form 2', 'Form 3', 'Form 4'], placeholder: 'All Grades' },
        ].map(({ key, options, placeholder }) => (
          <div key={key} className="relative">
            <select
              className="select text-sm pl-3 pr-8 py-2 w-auto"
              value={filter[key]}
              onChange={e => setFilter(f => ({ ...f, [key]: e.target.value }))}
            >
              <option value="">{placeholder}</option>
              {options.filter(Boolean).map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <svg className="absolute right-2.5 top-2.5 text-gray-400 pointer-events-none" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        ))}
        {(filter.grade || filter.examType) && (
          <button onClick={() => setFilter({ grade: '', subject: '', examType: '' })} className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-xl">
            Clear filters ×
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="h-4 bg-gray-100 rounded-lg mb-3 w-2/3" />
              <div className="h-3 bg-gray-100 rounded-lg mb-2 w-1/2" />
              <div className="h-3 bg-gray-100 rounded-lg w-3/4" />
            </div>
          ))}
        </div>
      ) : exams.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" fill="none" stroke="#9ca3af" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/></svg>
          </div>
          <h3 className="font-serif text-xl text-gray-700 mb-2">No exams yet</h3>
          <p className="text-sm text-gray-400 mb-5">Generate your first CBC exam to see it here.</p>
          <Link to="/generate" className="btn-primary text-sm">Generate Your First Exam</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams.map(exam => (
            <div
              key={exam._id}
              onClick={() => navigate('/exams/' + exam._id)}
              className="card p-5 cursor-pointer hover:border-brand-blue hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${TYPE_STYLES[exam.examType] || TYPE_STYLES.CAT}`}>
                  {exam.examType}
                </span>
                <button
                  onClick={(e) => deleteExam(exam._id, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500 p-1"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
                </button>
              </div>

              <h3 className="font-semibold text-gray-900 text-sm mb-1 leading-tight line-clamp-2">
                {exam.title}
              </h3>
              <p className="text-xs text-gray-400 mb-3">
                {exam.grade} · {exam.subject} · {exam.strand}
              </p>

              <div className="flex items-center gap-3 text-xs text-gray-400 pt-3 border-t border-gray-100">
                <span>{exam.totalMarks} marks</span>
                <span>·</span>
                <span>{exam.totalQuestions} questions</span>
                <span>·</span>
                <span>{exam.term} {exam.year}</span>
              </div>

              <p className="text-xs text-gray-300 mt-2">
                {new Date(exam.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
