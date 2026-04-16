// ExamViewPage.jsx — view a saved exam
export function ExamViewPage() {
  const [exam, setExam] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()

  useEffect(() => {
    api.get('/exams/' + id)
      .then(({ data }) => setExam(data.exam))
      .catch(() => toast.error('Exam not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-blue rounded-full animate-spin" />
    </div>
  )
  if (!exam) return <div className="text-center py-20 text-gray-400">Exam not found.</div>

  const meta = {
    grade: exam.grade, subject: exam.subject,
    strands: exam.strands || (exam.strand ? [exam.strand] : []),
    substrands: exam.substrands || [],
    examType: exam.examType, term: exam.term,
    year: exam.year, totalMarks: exam.totalMarks, school: exam.school,
  }

  return (
    <div className="h-[calc(100vh-56px)] overflow-hidden">
      <ExamPreview exam={exam} meta={meta} examId={exam._id} onRegenerate={() => {}} />
    </div>
  )
}

// DashboardPage.jsx — admin analytics
export function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [myStats, setMyStats] = useState(null)
  const { user } = useAuthStore()

  useEffect(() => {
    api.get('/analytics/my-stats').then(({ data }) => setMyStats(data))
    if (user?.role === 'admin') {
      api.get('/analytics/dashboard').then(({ data }) => setStats(data))
    }
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl text-gray-900 mb-6">
        {user?.role === 'admin' ? 'Admin Dashboard' : 'My Dashboard'}
      </h1>

      {myStats && (
        <div className="mb-10">
          <h2 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wider">Your Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Exams', value: myStats.total },
              { label: 'Free Tier', value: user?.freeGenerationsLeft + ' left' },
              { label: 'Top Subject', value: myStats.bySubject?.[0]?._id || '—' },
              { label: 'Exam Type Used', value: myStats.byType?.[0]?._id || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="card p-4">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-xl font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {myStats.recent?.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">Recent Exams</h3>
              <div className="space-y-2">
                {myStats.recent.map(ex => (
                  <Link key={ex._id} to={'/exams/' + ex._id}
                    className="card px-4 py-3 flex items-center justify-between hover:border-brand-blue transition-all">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{ex.title}</p>
                      <p className="text-xs text-gray-400">{ex.grade} · {ex.subject} · {ex.examType}</p>
                    </div>
                    <span className="text-xs text-gray-300">{new Date(ex.createdAt).toLocaleDateString('en-KE')}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {user?.role === 'admin' && stats && (
        <div>
          <h2 className="font-semibold text-gray-700 mb-4 text-sm uppercase tracking-wider">Platform Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Users', value: stats.overview.totalUsers },
              { label: 'Premium Users', value: stats.overview.premiumUsers },
              { label: 'Total Exams', value: stats.overview.totalExams },
              { label: 'Exams Today', value: stats.overview.examsToday },
            ].map(({ label, value }) => (
              <div key={label} className="card p-4">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value?.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="card p-5">
              <h3 className="font-semibold text-sm text-gray-700 mb-4">Top Subjects</h3>
              {stats.charts.examsBySubject?.slice(0,5).map(({ _id, count }) => (
                <div key={_id} className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-gray-500 w-28 truncate">{_id}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-blue rounded-full" style={{ width: `${(count / (stats.charts.examsBySubject[0]?.count || 1)) * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
            <div className="card p-5">
              <h3 className="font-semibold text-sm text-gray-700 mb-4">Top Grades</h3>
              {stats.charts.examsByGrade?.slice(0,5).map(({ _id, count }) => (
                <div key={_id} className="flex items-center gap-3 mb-3">
                  <span className="text-xs text-gray-500 w-16 truncate">{_id}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-red rounded-full" style={{ width: `${(count / (stats.charts.examsByGrade[0]?.count || 1)) * 100}%` }} />
                  </div>
                  <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Re-exports & missing imports
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import ExamPreview from '../components/ExamPreview'
import { useAuthStore } from '../context/authStore'

export default ExamViewPage
