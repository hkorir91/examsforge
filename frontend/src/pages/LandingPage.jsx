import { Link } from 'react-router-dom'
import { useAuthStore } from '../context/authStore'

export function LandingPage() {
  const { token } = useAuthStore()

  const stats = [
    { label: 'Senior School Teachers', value: '12,000+' },
    { label: 'Exams Generated', value: '85,000+' },
    { label: 'Subjects Covered', value: '19+' },
    { label: 'CBC Senior Grades', value: '10–12' },
  ]

  const features = [
    { icon: '🧠', title: 'Hybrid AI Generation', desc: 'Questions are drawn from a structured question bank and transformed by AI — ensuring unique, curriculum-accurate exams every time.' },
    { icon: '📄', title: 'Professional PDF Export', desc: 'Download a print-ready PDF with cover page, structured questions by section, and a complete CBC marking scheme.' },
    { icon: '🇰🇪', title: 'CBC Senior School Aligned', desc: 'Built specifically for Grade 10, 11 and 12 under Kenya\'s CBC competency-based framework. Every strand and sub-strand mapped.' },
    { icon: '✏️', title: 'Edit Before Printing', desc: 'Review and edit any question directly in the browser before downloading. Full control over your exam paper.' },
    { icon: '🗂️', title: 'Marking Scheme Included', desc: 'Every exam comes with a detailed CBC-aligned marking scheme with per-question mark allocation and model answers.' },
    { icon: '📱', title: 'Works on Any Device', desc: 'Generate exams from your phone, tablet, or computer. No installation required — works anywhere.' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blue-dark via-brand-blue to-blue-600 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            Kenya's CBC Senior School Exam Generator — Grade 10 · 11 · 12
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-white mb-5 leading-tight">
            Generate Senior School<br />
            <span className="text-yellow-400">CBC Exams in Seconds</span>
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            AI-powered hybrid exam generator for Grade 10–12 teachers. Select your grade, subject, and strands — get a complete, curriculum-aligned exam with marking scheme, ready to print.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to={token ? '/generate' : '/register'}
              className="bg-brand-red hover:bg-red-700 text-white font-bold px-7 py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-red-900/30">
              Generate Free Exam →
            </Link>
            <Link to="/pricing" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-all text-sm">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-blue-dark border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{value}</div>
              <div className="text-xs text-white/50 font-medium uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Hybrid Generation Banner */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 text-white text-center md:text-left">
          <div className="text-4xl">🔀</div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Hybrid Question Generation — No Two Exams Are the Same</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Our engine retrieves questions from a structured CBC question bank, then passes them through AI transformation — rephrasing wording, changing values, and adjusting context. Curriculum-accurate. Always unique.
            </p>
          </div>
          <Link to={token ? '/generate' : '/register'}
            className="bg-white text-emerald-700 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-emerald-50 transition-all flex-shrink-0">
            Try It Free →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl text-gray-900 mb-3">Everything a Senior School teacher needs</h2>
            <p className="text-gray-400 text-base max-w-lg mx-auto">Built for CBC Grade 10–12. Every feature designed around your classroom and examination reality.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="card p-6 hover:border-brand-blue hover:shadow-md transition-all">
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects supported */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-gray-900 mb-3">All Senior School Subjects Supported</h2>
          <p className="text-gray-400 text-sm mb-8">Comprehensive subject coverage for CBC Grade 10, 11 and 12</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics',
              'History & Citizenship', 'Geography', 'CRE / IRE / HRE', 'Business Studies',
              'Agriculture', 'Computer Science', 'Home Science', 'Life Skills Education',
              'Art & Design', 'Music', 'Physical Education'].map(s => (
              <span key={s} className="bg-white border border-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-4xl text-gray-900 mb-12">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Select Grade & Subject', desc: 'Choose Grade 10, 11 or 12. Select subject, then pick one or more strands and sub-strands to focus on.' },
              { step: '02', title: 'Configure Your Exam', desc: 'Set exam type (CAT, Midterm, End Term, Mock), total marks, number of questions, term, and your school name.' },
              { step: '03', title: 'Generate & Download', desc: 'Click Generate. In seconds you have a complete structured exam with CBC marking scheme. Edit and download as PDF.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="relative">
                <div className="w-14 h-14 bg-brand-blue rounded-2xl text-white font-bold text-lg flex items-center justify-center mx-auto mb-4 font-mono">
                  {step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12">
            <Link to={token ? '/generate' : '/register'}
              className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-8 py-4 rounded-xl transition-all text-sm shadow-lg shadow-brand-blue/20">
              Start Generating Free
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial / trust */}
      <section className="py-16 px-4 bg-brand-blue-dark">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-4">Trusted by Kenyan Senior School Teachers</p>
          <blockquote className="text-white text-lg font-medium leading-relaxed mb-4">
            "ExamsForge has completely changed how I prepare exams. The questions are genuinely curriculum-aligned and I never get the same paper twice."
          </blockquote>
          <p className="text-white/50 text-sm">— Senior School Teacher, Nairobi</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-blue-dark border-t border-white/10 py-10 px-4 text-center">
        <div className="text-white font-bold text-base mb-1">ExamsForge</div>
        <div className="text-white/40 text-xs mb-3">by SmartSchool Digital</div>
        <p className="text-white/30 text-xs">© {new Date().getFullYear()} SmartSchool Digital. CBC Senior School Exam Generator for Kenya.</p>
        <div className="flex justify-center gap-5 mt-4 text-xs text-white/40">
          <Link to="/pricing" className="hover:text-white/70">Pricing</Link>
          <Link to="/login" className="hover:text-white/70">Login</Link>
          <Link to="/register" className="hover:text-white/70">Register</Link>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
