import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../context/authStore'
import toast from 'react-hot-toast'

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const { login, loading } = useAuthStore()
  const navigate = useNavigate()

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(form.email, form.password)
    if (result.success) {
      toast.success(result.message)
      navigate('/generate')
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue-dark via-brand-blue to-brand-blue-mid flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-brand-red rounded-xl flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/></svg>
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-base leading-none">ExamsForge</div>
              <div className="text-white/50 text-xs">by SmartSchool Digital</div>
            </div>
          </Link>
          <h1 className="text-white font-serif text-3xl mb-2">Welcome back</h1>
          <p className="text-white/60 text-sm">Sign in to continue generating CBC exams</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input className="input" type="email" placeholder="you@school.ke" value={form.email} onChange={set('email')} required autoFocus />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="Your password" value={form.password} onChange={set('password')} required />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3 text-sm">
              <div className="text-right -mt-2 mb-2">
  <Link to="/forgot-password" className="text-xs text-brand-blue hover:underline">
    Forgot Password?
  </Link>
</div>
              {loading ? (
                <><svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-400 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-blue font-semibold hover:underline">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', school: '' })
  const { register, loading } = useAuthStore()
  const navigate = useNavigate()

  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await register(form.name, form.email, form.password, form.school)
    if (result.success) {
      toast.success(result.message)
      navigate('/generate')
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue-dark via-brand-blue to-brand-blue-mid flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-brand-red rounded-xl flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/></svg>
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-base leading-none">ExamsForge</div>
              <div className="text-white/50 text-xs">by SmartSchool Digital</div>
            </div>
          </Link>
          <h1 className="text-white font-serif text-3xl mb-2">Create your account</h1>
          <p className="text-white/60 text-sm">3 free CBC exam generations — no credit card needed</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input" type="text" placeholder="Your full name" value={form.name} onChange={set('name')} required autoFocus />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input className="input" type="email" placeholder="you@school.ke" value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input className="input" type="password" placeholder="At least 6 characters" value={form.password} onChange={set('password')} required minLength={6} />
            </div>
            <div>
              <label className="label">School Name <span className="text-gray-300 font-normal">(optional)</span></label>
              <input className="input" type="text" placeholder="e.g. Nairobi Senior School" value={form.school} onChange={set('school')} />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3 text-sm">
              {loading ? (
                <><svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Creating account...</>
              ) : 'Create Free Account'}
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-4">
            By signing up you agree to our terms of service.
          </p>
          <p className="text-center text-sm text-gray-400 mt-3">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-blue font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
