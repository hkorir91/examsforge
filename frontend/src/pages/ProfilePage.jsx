import { useState } from 'react'
import { useAuthStore } from '../context/authStore'
import api from '../utils/api'
import toast from 'react-hot-toast'

const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
)

const icons = {
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  school: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
  lock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4",
  mail: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0 1.1.9 2 2 2zm16 2l-8 5-8-5",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  exams: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z",
  check: "M20 6L9 17l-5-5",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 12a3 3 0 100-6 3 3 0 000 6z",
  eyeOff: "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22",
}

const StatCard = ({ icon, label, value, sub, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  }
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>
        <Icon d={icon} size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuthStore()

  // Profile form
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', school: user?.school || '' })
  const [profileLoading, setProfileLoading] = useState(false)

  // Password form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwLoading, setPwLoading] = useState(false)
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false })

  // Active section
  const [section, setSection] = useState('profile') // 'profile' | 'password'

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    if (!profileForm.name.trim()) return toast.error('Name is required')
    setProfileLoading(true)
    const result = await updateProfile({ name: profileForm.name.trim(), school: profileForm.school.trim() })
    setProfileLoading(false)
    if (result.success) toast.success('Profile updated!')
    else toast.error(result.error || 'Update failed')
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('New passwords do not match')
    if (pwForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters')
    setPwLoading(true)
    try {
      await api.patch('/auth/password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      })
      toast.success('Password changed successfully!')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password')
    } finally {
      setPwLoading(false)
    }
  }

  const tierLabel = {
    free: 'Free Plan',
    monthly: 'Monthly Premium',
    annual: 'Annual Premium',
  }

  const tierColor = {
    free: 'bg-gray-100 text-gray-600',
    monthly: 'bg-blue-100 text-blue-700',
    annual: 'bg-purple-100 text-purple-700',
  }

  const freeLeft = Math.max(0, 10 - (user?.freeGenerationsUsed || 0))

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* ── Header ───────────────────────────── */}
        <div className="bg-gradient-to-r from-[#003399] to-[#1a4db5] rounded-3xl p-8 mb-6 text-white flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold truncate">{user?.name}</h1>
            <p className="text-white/70 text-sm truncate">{user?.email}</p>
            {user?.school && <p className="text-white/60 text-sm mt-0.5 truncate">{user.school}</p>}
            <div className="mt-3 flex items-center gap-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${tierColor[user?.tier] || tierColor.free}`}>
                {tierLabel[user?.tier] || 'Free Plan'}
              </span>
              {user?.isPremium && user?.subscriptionExpiresAt && (
                <span className="text-xs text-white/50">
                  Expires {new Date(user.subscriptionExpiresAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Stats ────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <StatCard icon={icons.exams} label="Exams Generated" value={user?.totalExamsGenerated || 0} color="blue" />
          {user?.tier === 'free' ? (
            <StatCard icon={icons.star} label="Free Exams Left" value={freeLeft} sub="of 10 free" color="orange" />
          ) : (
            <StatCard icon={icons.star} label="Plan" value="Premium" sub="Unlimited" color="purple" />
          )}
          <StatCard
            icon={icons.user}
            label="Member Since"
            value={new Date(user?.createdAt).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}
            color="green"
          />
        </div>

        {/* ── Tabs ─────────────────────────────── */}
        <div className="flex gap-2 mb-5">
          {[
            { key: 'profile', label: 'Edit Profile' },
            { key: 'password', label: 'Change Password' },
          ].map(t => (
            <button key={t.key} onClick={() => setSection(t.key)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
                section === t.key
                  ? 'bg-[#003399] text-white shadow-sm'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Edit Profile ──────────────────────── */}
        {section === 'profile' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 text-lg mb-5">Profile Information</h2>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {/* Email - read only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400"><Icon d={icons.mail} size={17} /></span>
                  <input
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                    value={user?.email || ''}
                    readOnly
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400"><Icon d={icons.user} size={17} /></span>
                  <input
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={profileForm.name}
                    onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your full name"
                    required
                    minLength={2}
                  />
                </div>
              </div>

              {/* School */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">School / Institution</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400"><Icon d={icons.school} size={17} /></span>
                  <input
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={profileForm.school}
                    onChange={e => setProfileForm(f => ({ ...f, school: e.target.value }))}
                    placeholder="Your school or institution"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="w-full bg-[#003399] text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {profileLoading ? 'Saving...' : (
                  <><Icon d={icons.check} size={16} /> Save Changes</>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ── Change Password ───────────────────── */}
        {section === 'password' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 text-lg mb-5">Change Password</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {[
                { key: 'current', label: 'Current Password', field: 'currentPassword', placeholder: 'Your current password' },
                { key: 'new', label: 'New Password', field: 'newPassword', placeholder: 'At least 6 characters' },
                { key: 'confirm', label: 'Confirm New Password', field: 'confirmPassword', placeholder: 'Repeat new password' },
              ].map(({ key, label, field, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400"><Icon d={icons.lock} size={17} /></span>
                    <input
                      className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                      type={showPw[key] ? 'text' : 'password'}
                      value={pwForm[field]}
                      onChange={e => setPwForm(f => ({ ...f, [field]: e.target.value }))}
                      placeholder={placeholder}
                      required
                      minLength={key !== 'current' ? 6 : undefined}
                    />
                    <button type="button" onClick={() => setShowPw(s => ({ ...s, [key]: !s[key] }))}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                      <Icon d={showPw[key] ? icons.eyeOff : icons.eye} size={17} />
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={pwLoading}
                className="w-full bg-[#003399] text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
              >
                {pwLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}
