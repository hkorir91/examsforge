import { useState } from 'react'
import toast from 'react-hot-toast'
import ExamForm from '../components/ExamForm'
import ExamPreview from '../components/ExamPreview'
import api from '../utils/api'
import { useAuthStore } from '../context/authStore'

const GEN_STEPS = [
  'Analysing CBC Senior School curriculum...',
  'Retrieving from question bank...',
  'Selecting balanced question set...',
  'Machine transforming and rephrasing questions...',
  'Building structured question sections...',
  'Generating CBC marking scheme...',
  'Assembling cover page...',
]

export default function GeneratorPage() {
  const { refreshUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [genStep, setGenStep] = useState(0)
  const [exam, setExam] = useState(null)
  const [meta, setMeta] = useState(null)
  const [examId, setExamId] = useState(null)
  const [mobileView, setMobileView] = useState('form')

  const animateSteps = async () => {
    for (let i = 0; i < GEN_STEPS.length; i++) {
      setGenStep(i)
      await new Promise(r => setTimeout(r, 500))
    }
  }

  const handleGenerate = async (form) => {
    // Pre-flight check
    if (!window.navigator.onLine) {
      toast.error('No internet connection. Please check your network and try again.', { duration: 5000 })
      return
    }

    setLoading(true)
    setExam(null)
    setMeta(null)
    setExamId(null)
    setMobileView('preview')

    animateSteps()

    try {
      const { data } = await api.post('/exams/generate', {
        grade: form.grade,
        subject: form.subject,
        strands: form.strands,
        substrands: form.substrands,
        examType: form.examType,
        term: form.term,
        year: parseInt(form.year),
        totalMarks: parseInt(form.totalMarks),
        totalQuestions: parseInt(form.totalQuestions),
        school: form.school,
        sectionCount: form.sectionCount,
        showStrand: form.showStrand,
        // BUG 6 FIX: include includePractical in the API payload
        includePractical: form.includePractical,
      })

      setExam(data.exam)
      setExamId(data.exam._id)
      setMeta({
        grade: form.grade,
        subject: form.subject,
        strands: form.strands,
        substrands: form.substrands,
        examType: form.examType,
        term: form.term,
        year: form.year,
        totalMarks: form.totalMarks,
        school: form.school,
        sectionCount: form.sectionCount,
        showStrand: form.showStrand,
        includePractical: form.includePractical,
      })

      await refreshUser()
      toast.success(data.message || 'Exam generated successfully!')

    } catch (err) {
      const code = err.response?.data?.code
      const status = err.response?.status
      const serverMsg = err.response?.data?.error

      if (code === 'QUOTA_EXCEEDED') {
        toast.error('You have used all your free exams. Upgrade to Premium to continue.', { duration: 7000 })
      } else if (code === 'TIMEOUT') {
        toast.error('The Machine took too long to respond. Please try again.', { duration: 6000 })
      } else if (code === 'PARSE_ERROR') {
        toast.error('The Machine returned an unexpected response. Please try again.', { duration: 5000 })
      } else if (code === 'SAVE_ERROR') {
        toast.error('Exam generated but could not be saved. Please try again.', { duration: 6000 })
      } else if (code === 'RATE_LIMIT' || status === 429) {
        toast.error('Too many requests. Please wait a moment before trying again.', { duration: 5000 })
      } else if (code === 'SERVICE_DOWN') {
        toast.error('Machine service is temporarily unavailable. Please try again shortly.', { duration: 5000 })
      } else if (code === 'AUTH_ERROR') {
        toast.error('Machine service configuration error. Please contact support.', { duration: 7000 })
      } else if (code === 'MISSING_FIELD' || status === 400) {
        toast.error(serverMsg || 'Please check all fields are filled correctly.', { duration: 5000 })
      } else if (!window.navigator.onLine) {
        toast.error('Connection lost during generation. Please check your network.', { duration: 5000 })
      } else {
        toast.error(serverMsg || 'Generation failed. Please try again.', { duration: 5000 })
      }

      setMobileView('form')
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerate = () => {
    if (meta) {
      setMobileView('form')
      toast('Click Generate Exam to regenerate with new questions.', { icon: '💡' })
    }
  }

  const rightPanel = () => {
    if (loading) return (
      <div className="h-full flex flex-col items-center justify-center gap-5 bg-gray-50 p-6">
        <div className="relative">
          <div className="w-14 h-14 border-4 border-gray-200 border-t-brand-blue rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-100 border-t-brand-red rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
          </div>
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-700 mb-1">Building your exam paper...</p>
          <p className="text-sm text-gray-400">Machine is retrieving and transforming CBC questions</p>
        </div>
        <div className="space-y-2 w-full max-w-sm">
          {GEN_STEPS.map((step, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm transition-all ${
                i < genStep
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : i === genStep
                  ? 'bg-blue-50 border-blue-200 text-brand-blue font-medium shadow-sm'
                  : 'bg-white border-gray-100 text-gray-400'
              }`}
            >
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                i < genStep ? 'bg-emerald-500 text-white' :
                i === genStep ? 'bg-brand-blue text-white' :
                'bg-gray-200'
              }`}>
                {i < genStep ? '✓' : i + 1}
              </div>
              {step}
            </div>
          ))}
        </div>
      </div>
    )

    if (exam) return (
      <ExamPreview
        exam={exam}
        meta={meta}
        examId={examId}
        onRegenerate={handleRegenerate}
      />
    )

    return (
      <div className="h-full flex flex-col items-center justify-center gap-6 bg-gray-50 p-6">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
          <svg width="32" height="32" fill="none" stroke="#003399" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <div className="text-center max-w-sm">
          <h3 className="font-serif text-xl sm:text-2xl text-gray-900 mb-2">Ready to generate your exam</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Select a grade, subject, and strand(s) on the left, then click Generate Exam. Your complete CBC Senior School exam paper with marking scheme will appear here.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-md w-full">
          {[
            { step: '1', title: 'Select Grade & Subject', desc: 'Choose Grade 10 and select your subject' },
            { step: '2', title: 'Pick Strand(s)', desc: 'Select one or more strands — multi-select supported' },
            { step: '3', title: 'Generate & Download', desc: 'Click Generate — the Machine builds your unique CBC exam' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-2">Step {step}</div>
              <p className="text-xs font-semibold text-gray-700 mb-1">{title}</p>
              <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex h-[calc(100vh-56px)] overflow-hidden">
        <div className="w-80 flex-shrink-0 h-full">
          <ExamForm onGenerate={handleGenerate} loading={loading} />
        </div>
        <div className="flex-1 h-full overflow-hidden">
          {rightPanel()}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col min-h-[calc(100vh-56px)]">
        {(exam || loading) && (
          <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
            <button
              onClick={() => setMobileView('form')}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                mobileView === 'form' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-400'
              }`}
            >
              Configure
            </button>
            <button
              onClick={() => setMobileView('preview')}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                mobileView === 'preview' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-gray-400'
              }`}
            >
              {loading ? 'Generating...' : 'Exam Preview'}
            </button>
          </div>
        )}
        {(!exam && !loading) || mobileView === 'form' ? (
          <div className="flex-1"><ExamForm onGenerate={handleGenerate} loading={loading} /></div>
        ) : (
          <div className="flex-1">{rightPanel()}</div>
        )}
      </div>
    </>
  )
}
