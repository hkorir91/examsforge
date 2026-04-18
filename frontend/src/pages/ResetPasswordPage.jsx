import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const { token } = useParams()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await api.post(`/auth/reset-password/${token}`, { password })
      setDone(true)
      toast.success('Password reset successful!')
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Reset failed. Link may have expired.')
    } finally {
      setLoading(false)
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
          <h1 className="text-white font-serif text-3xl mb-2">Reset Password</h1>
          <p className="text-white/60 text-sm">Enter your new password below</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {done ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" fill="none" stroke="#10b981" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 className="font-semibold text-gray-900 text-lg mb-2">Password Reset!</h2>
              <p className="text-sm text-gray-500 mb-6">
                Redirecting you to login in 3 seconds...
              </p>
              <Link to="/login" className="btn-primary justify-center text-sm py-3 w-full">
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">New Password</label>
                <input
                  className="input"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoFocus
                />
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <input
                  className="input"
                  type="password"
                  placeholder="Repeat your password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3 text-sm">
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
              <p className="text-center text-sm text-gray-400 mt-4">
                Remember your password?{' '}
                <Link to="/login" className="text-brand-blue font-semibold hover:underline">Sign in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
