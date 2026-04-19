import { Link } from 'react-router-dom'
import { useAuthStore } from '../context/authStore'

export function LandingPage() {
  const { token } = useAuthStore()

  const features = [
    { icon: '🧠', title: 'Hybrid AI Generation', desc: 'Questions drawn from a structured CBC question bank, transformed by AI — unique and curriculum-accurate every time.' },
    { icon: '📄', title: 'Professional PDF Export', desc: 'Download a print-ready PDF with cover page, structured sections, and a complete CBC marking scheme.' },
    { icon: '🇰🇪', title: 'CBC Senior School Aligned', desc: 'Built specifically for Grade 10, 11 and 12 under Kenya\'s CBC framework. Every strand and sub-strand mapped.' },
    { icon: '✏️', title: 'Edit Before Printing', desc: 'Review and edit any question directly in the browser before downloading. Full control over your exam paper.' },
    { icon: '🗂️', title: 'Marking Scheme Included', desc: 'Every exam includes a detailed CBC marking scheme with per-question mark allocation and model answers.' },
    { icon: '📱', title: 'Works on Any Device', desc: 'Generate exams from your phone, tablet, or computer. No installation required — works anywhere.' },
  ]

  const subjects = [
    'Mathematics', 'English', 'Kiswahili', 'Biology', 'Chemistry', 'Physics',
    'History & Citizenship', 'Geography', 'CRE / IRE / HRE', 'Business Studies',
    'Agriculture', 'Computer Science', 'Home Science', 'Life Skills Education',
    'Art & Design', 'Music', 'Physical Education',
  ]

  const testimonials = [
    { quote: 'ExamsForge saves me 3 hours every time I set an exam. The questions are genuinely CBC-aligned and I never get the same paper twice.', name: 'Head of Department, Nakuru', },
    { quote: 'I generated a complete Grade 11 Chemistry end term exam in under 2 minutes. The marking scheme was perfect — nothing to edit.', name: 'Chemistry Teacher, Nairobi', },
  ]

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-blue-dark via-brand-blue to-blue-600 py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            Kenya's CBC Senior School Exam Generator — Grade 10 · 11 · 12
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white mb-4 leading-tight">
            Generate Senior School<br />
            <span className="text-yellow-400">CBC Exams in Seconds</span>
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            AI-powered exam generator for Grade 10–12 teachers. Select your grade, subject, and strands — get a complete, curriculum-aligned exam with marking scheme, ready to print.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to={token ? '/generate' : '/register'}
              className="bg-brand-red hover:bg-red-700 text-white font-bold px-7 py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-red-900/30 text-center">
              Generate Free Exam →
            </Link>
            <Link
              to="/pricing"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl transition-all text-sm text-center">
              View Pricing
            </Link>
          </div>
          <p className="text-white/40 text-xs mt-4">No credit card needed · 10 free exams · M-Pesa accepted</p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-blue-dark border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Subjects Covered', value: '19+' },
            { label: 'Exam Types', value: '5' },
            { label: 'CBC Senior Grades', value: '10–12' },
            { label: 'Free Exams to Start', value: '10' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{value}</div>
              <div className="text-xs text-white/50 font-medium uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Sample exam preview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl text-gray-900 mb-2">See exactly what you get</h2>
            <p className="text-gray-400 text-sm">A real sample from ExamsForge — Grade 11 Geography, End Term</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Exam header */}
            <div className="bg-brand-blue-dark px-6 py-4 text-white">
              <div className="text-center">
                <div className="font-bold text-base">KENYA CERTIFICATE OF SECONDARY EDUCATION</div>
                <div className="text-white/70 text-sm mt-1">GEOGRAPHY — GRADE 11 · END TERM EXAMINATION</div>
                <div className="text-white/50 text-xs mt-1">Time: 2 Hours 30 Minutes · Total Marks: 80</div>
              </div>
            </div>
            {/* Sample questions */}
            <div className="px-6 py-5 space-y-5 text-sm">
              <div>
                <div className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Section A — Short Answer (30 marks)</div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="font-bold text-gray-900 flex-shrink-0">1.</span>
                    <div>
                      <p className="text-gray-700">(a) Define the term <em>weathering</em> as used in Geography. <span className="text-gray-400">(2 marks)</span></p>
                      <p className="text-gray-700 mt-2">(b) State <strong>three</strong> factors that influence the rate of chemical weathering in East Africa. <span className="text-gray-400">(3 marks)</span></p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-bold text-gray-900 flex-shrink-0">2.</span>
                    <div>
                      <p className="text-gray-700">Explain how <strong>two</strong> human activities contribute to soil degradation in the Rift Valley region of Kenya. <span className="text-gray-400">(4 marks)</span></p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="font-semibold text-gray-700 mb-2 text-xs uppercase tracking-wider">Marking Scheme (included)</div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-xs text-emerald-800">
                  <strong>1(a)</strong> Weathering is the breaking down and decomposition of rocks in their original position by physical, chemical or biological processes. (2 marks)<br />
                  <strong>1(b)</strong> High temperatures; High rainfall/humidity; Presence of organic acids; Rock mineral composition — any 3 × 1 mark.
                </div>
              </div>
              <div className="text-center pt-2 pb-1">
                <div className="text-xs text-gray-400 italic">This is a preview. Full exam includes Section B (structured) and Section C (long answer/essay) with complete marking scheme.</div>
              </div>
            </div>
          </div>
          <div className="text-center mt-6">
            <Link
              to={token ? '/generate' : '/register'}
              className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-dark text-white font-bold px-7 py-3.5 rounded-xl transition-all text-sm">
              Generate Your Own Free Exam →
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-gray-900 mb-10">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Select Grade & Subject', desc: 'Choose Grade 10, 11 or 12. Select your subject and the strands you want to cover.' },
              { step: '02', title: 'Configure Your Exam', desc: 'Set exam type, total marks, number of questions, term, and your school name.' },
              { step: '03', title: 'Generate & Download', desc: 'In seconds — a complete structured exam with CBC marking scheme. Edit and download as PDF.' },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <div className="w-12 h-12 bg-brand-blue rounded-xl text-white font-bold text-base flex items-center justify-center mx-auto mb-4 font-mono">
                  {step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hybrid Generation Banner */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-5 text-white text-center sm:text-left">
          <div className="text-3xl flex-shrink-0">🔀</div>
          <div className="flex-1">
            <h3 className="font-bold text-base mb-1">Hybrid AI — No Two Exams Are the Same</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Our engine retrieves questions from a structured CBC question bank, then transforms them through AI — rephrasing, changing values, adjusting context. Curriculum-accurate. Always unique.
            </p>
          </div>
          <Link
            to={token ? '/generate' : '/register'}
            className="bg-white text-emerald-700 font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-emerald-50 transition-all flex-shrink-0 whitespace-nowrap">
            Try It Free →
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl text-gray-900 mb-2">Everything a Senior School teacher needs</h2>
            <p className="text-gray-400 text-sm max-w-lg mx-auto">Built for CBC Grade 10–12. Every feature designed around your classroom reality.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="card p-5 hover:border-brand-blue hover:shadow-md transition-all">
                <div className="text-2xl mb-3">{icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-14 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-gray-900 mb-2">All Senior School Subjects</h2>
          <p className="text-gray-400 text-sm mb-7">Comprehensive coverage for CBC Grade 10, 11 and 12</p>
          <div className="flex flex-wrap justify-center gap-2">
            {subjects.map(s => (
              <span key={s} className="bg-white border border-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 px-4 bg-brand-blue-dark">
        <div className="max-w-4xl mx-auto">
          <p className="text-white/40 text-xs uppercase tracking-widest text-center mb-8">What Kenyan Teachers Say</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {testimonials.map(({ quote, name }) => (
              <div key={name} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <p className="text-white/80 text-sm leading-relaxed mb-4">"{quote}"</p>
                <p className="text-white/40 text-xs">— {name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl text-gray-900 mb-3">Ready to save hours every week?</h2>
          <p className="text-gray-400 text-sm mb-7">Join teachers across Kenya using ExamsForge for CBC Senior School exams. Start free — no card needed.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to={token ? '/generate' : '/register'}
              className="bg-brand-red hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl transition-all text-sm shadow-lg shadow-red-900/20 text-center">
              Start Free — 10 Free Exams
            </Link>
            <Link
              to="/pricing"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-xl transition-all text-sm text-center">
              View Pricing
            </Link>
          </div>
          <p className="text-gray-400 text-xs mt-4">Pay via M-Pesa · No credit card · Cancel anytime</p>
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
