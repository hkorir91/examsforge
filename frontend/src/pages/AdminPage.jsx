import { useState, useEffect, useCallback } from 'react'
import { Navigate } from 'react-router-dom'
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
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  exams: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z",
  premium: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  announce: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  questions: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  prompts: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z",
  close: "M18 6L6 18M6 6l12 12",
  plus: "M12 5v14M5 12h14",
  edit: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  check: "M20 6L9 17l-5-5",
}

const StatCard = ({ label, value, sub, color = 'blue' }) => {
  const clr = { blue: 'text-blue-700', green: 'text-emerald-700', red: 'text-red-700', purple: 'text-purple-700' }
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${clr[color]}`}>{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}
const Badge = ({ tier }) => {
  const s = { free: 'bg-gray-100 text-gray-600', monthly: 'bg-blue-100 text-blue-700', annual: 'bg-purple-100 text-purple-700' }
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s[tier] || s.free}`}>{tier}</span>
}
const Input = ({ label, ...props }) => (
  <div>
    {label && <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>}
    <input className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" {...props} />
  </div>
)
const Select = ({ label, children, ...props }) => (
  <div>
    {label && <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>}
    <select className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" {...props}>{children}</select>
  </div>
)

const GRADES = ['Grade 10', 'Grade 11', 'Grade 12']
const DIFFICULTIES = ['easy', 'medium', 'hard']
const Q_TYPES = ['short_answer', 'structured', 'long_answer', 'calculation', 'practical']
const PROMPT_CATEGORIES = ['system', 'section', 'formatting', 'other']

const emptyQuestion = { grade: 'Grade 10', subject: '', strand: '', subStrand: '', questionText: '', questionType: 'structured', answerGuide: '', marks: 2, difficulty: 'medium', tags: '', source: 'Admin Upload', learningObjective: '' }
const emptyPrompt = { name: '', description: '', content: '', category: 'system' }

export default function AdminPage() {
  const { user } = useAuthStore()
  const [tab, setTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [exams, setExams] = useState([])
  const [questions, setQuestions] = useState([])
  const [prompts, setPrompts] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Filters for question bank
  const [qFilters, setQFilters] = useState({ grade: '', subject: '', strand: '', difficulty: '', active: '' })

  // Modals
  const [premiumModal, setPremiumModal] = useState(null)
  const [premiumForm, setPremiumForm] = useState({ tier: 'monthly', days: 30 })
  const [qModal, setQModal] = useState(null)       // null | 'add' | question object (edit)
  const [qForm, setQForm] = useState(emptyQuestion)
  const [promptModal, setPromptModal] = useState(null) // null | 'add' | prompt object
  const [promptForm, setPromptForm] = useState(emptyPrompt)

  // Announce
  const [announce, setAnnounce] = useState({ subject: '', message: '', targetTier: 'all' })

  if (!user || user.role !== 'admin') return <Navigate to="/" replace />

  // ── Fetchers ──────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try { const r = await api.get('/admin/stats'); setStats(r.data) } catch { toast.error('Could not load stats') }
  }, [])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const r = await api.get('/admin/users', { params: { search, tier: tierFilter, page, limit: 15 } })
      setUsers(r.data.users); setTotalPages(r.data.pages)
    } catch { toast.error('Could not load users') } finally { setLoading(false) }
  }, [search, tierFilter, page])

  const fetchExams = useCallback(async () => {
    setLoading(true)
    try {
      const r = await api.get('/admin/exams', { params: { page, limit: 15 } })
      setExams(r.data.exams); setTotalPages(r.data.pages)
    } catch { toast.error('Could not load exams') } finally { setLoading(false) }
  }, [page])

  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    try {
      const r = await api.get('/admin/questions', { params: { ...qFilters, search, page, limit: 15 } })
      setQuestions(r.data.questions); setTotalPages(r.data.pages)
    } catch { toast.error('Could not load questions') } finally { setLoading(false) }
  }, [qFilters, search, page])

  const fetchPrompts = useCallback(async () => {
    setLoading(true)
    try { const r = await api.get('/admin/prompts'); setPrompts(r.data.prompts) }
    catch { toast.error('Could not load prompts') } finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchStats() }, [fetchStats])
  useEffect(() => { if (tab === 'users' || tab === 'premium') fetchUsers() }, [tab, fetchUsers])
  useEffect(() => { if (tab === 'exams') fetchExams() }, [tab, fetchExams])
  useEffect(() => { if (tab === 'questions') fetchQuestions() }, [tab, fetchQuestions])
  useEffect(() => { if (tab === 'prompts') fetchPrompts() }, [tab, fetchPrompts])

  // ── User handlers ─────────────────────────────────
  const handleDeleteUser = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    try { await api.delete(`/admin/users/${id}`); toast.success('Deleted'); fetchUsers() }
    catch (err) { toast.error(err.response?.data?.error || 'Failed') }
  }
  const handlePremiumUpdate = async () => {
    try { await api.patch(`/admin/users/${premiumModal._id}/premium`, premiumForm); toast.success('Updated!'); setPremiumModal(null); fetchUsers(); fetchStats() }
    catch (err) { toast.error(err.response?.data?.error || 'Failed') }
  }
  const handleRoleToggle = async (u) => {
    const newRole = u.role === 'admin' ? 'teacher' : 'admin'
    if (!confirm(`Make ${u.name} a ${newRole}?`)) return
    try { await api.patch(`/admin/users/${u._id}/role`, { role: newRole }); toast.success('Role updated'); fetchUsers() }
    catch { toast.error('Failed') }
  }

  // ── Exam handlers ─────────────────────────────────
  const handleDeleteExam = async (id) => {
    if (!confirm('Delete this exam?')) return
    try { await api.delete(`/admin/exams/${id}`); toast.success('Deleted'); fetchExams() }
    catch { toast.error('Failed') }
  }

  // ── Question handlers ─────────────────────────────
  const handleQSubmit = async () => {
    try {
      const payload = { ...qForm, tags: qForm.tags ? qForm.tags.split(',').map(t => t.trim()) : [] }
      if (qModal === 'add') {
        await api.post('/admin/questions', payload)
        toast.success('Question added to bank!')
      } else {
        await api.patch(`/admin/questions/${qModal._id}`, payload)
        toast.success('Question updated!')
      }
      setQModal(null); setQForm(emptyQuestion); fetchQuestions(); fetchStats()
    } catch (err) { toast.error(err.response?.data?.error || 'Failed') }
  }
  const handleQToggle = async (id) => {
    try { await api.patch(`/admin/questions/${id}/toggle`); toast.success('Toggled'); fetchQuestions() }
    catch { toast.error('Failed') }
  }
  const handleQDelete = async (id) => {
    if (!confirm('Delete this question permanently?')) return
    try { await api.delete(`/admin/questions/${id}`); toast.success('Deleted'); fetchQuestions(); fetchStats() }
    catch { toast.error('Failed') }
  }

  // ── Prompt handlers ───────────────────────────────
  const handlePromptSubmit = async () => {
    try {
      if (promptModal === 'add') {
        await api.post('/admin/prompts', promptForm); toast.success('Prompt created!')
      } else {
        await api.patch(`/admin/prompts/${promptModal._id}`, promptForm); toast.success('Prompt saved!')
      }
      setPromptModal(null); setPromptForm(emptyPrompt); fetchPrompts()
    } catch (err) { toast.error(err.response?.data?.error || 'Failed') }
  }
  const handlePromptDelete = async (id) => {
    if (!confirm('Delete this prompt?')) return
    try { await api.delete(`/admin/prompts/${id}`); toast.success('Deleted'); fetchPrompts() }
    catch { toast.error('Failed') }
  }

  // ── Announce handler ──────────────────────────────
  const handleAnnounce = async (e) => {
    e.preventDefault(); setLoading(true)
    try { const r = await api.post('/admin/announce', announce); toast.success(r.data.message); setAnnounce({ subject: '', message: '', targetTier: 'all' }) }
    catch (err) { toast.error(err.response?.data?.error || 'Failed') } finally { setLoading(false) }
  }

  // ── Nav ───────────────────────────────────────────
  const nav = [
    { key: 'overview', label: 'Overview', icon: icons.dashboard },
    { key: 'users', label: 'Users', icon: icons.users },
    { key: 'premium', label: 'Premium', icon: icons.premium },
    { key: 'exams', label: 'Exams', icon: icons.exams },
    { key: 'questions', label: 'Question Bank', icon: icons.questions },
    { key: 'prompts', label: 'AI Prompts', icon: icons.prompts },
    { key: 'announce', label: 'Announce', icon: icons.announce },
  ]

  const Pagination = () => (
    <div className="flex gap-2 justify-center mt-4">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => setPage(p)}
          className={`w-8 h-8 rounded-lg text-sm font-medium ${p === page ? 'bg-[#003399] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
          {p}
        </button>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#003399] min-h-screen flex flex-col py-6 px-4 shrink-0">
        <div className="mb-8 px-2">
          <div className="text-white font-bold text-lg">PassIQ</div>
          <div className="text-white/40 text-xs mt-0.5">Admin Panel</div>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {nav.map(({ key, label, icon }) => (
            <button key={key} onClick={() => { setTab(key); setPage(1); setSearch('') }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === key ? 'bg-white text-[#003399]' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
              <Icon d={icon} size={16} />{label}
            </button>
          ))}
        </nav>
        <div className="px-2 pt-4 border-t border-white/10">
          <p className="text-white/40 text-xs truncate">{user.email}</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Overview</h1>
            {stats ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <StatCard label="Total Users" value={stats.totalUsers} color="blue" />
                  <StatCard label="Premium Users" value={stats.premiumUsers} sub="Active" color="purple" />
                  <StatCard label="Free Users" value={stats.freeUsers} color="green" />
                  <StatCard label="Total Exams" value={stats.totalExams} color="blue" />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard label="New Today" value={stats.newToday} color="green" />
                  <StatCard label="New This Week" value={stats.newThisWeek} color="blue" />
                  <StatCard label="New This Month" value={stats.newThisMonth} color="purple" />
                  <StatCard label="Question Bank" value={stats.activeQuestions} sub={`of ${stats.totalQuestions} total`} color="green" />
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h2 className="font-semibold text-gray-700 mb-4">Signups — Last 7 Days</h2>
                  <div className="flex items-end gap-3 h-32">
                    {stats.last7Days.length === 0 && <p className="text-gray-400 text-sm">No data yet.</p>}
                    {stats.last7Days.map(d => (
                      <div key={d._id} className="flex flex-col items-center gap-1 flex-1">
                        <span className="text-xs text-gray-500 font-medium">{d.count}</span>
                        <div className="w-full bg-[#003399] rounded-t-md"
                          style={{ height: `${Math.max(8, (d.count / Math.max(...stats.last7Days.map(x => x.count))) * 96)}px` }} />
                        <span className="text-[10px] text-gray-400">{d._id.slice(5)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : <p className="text-gray-400">Loading stats...</p>}
          </div>
        )}

        {/* ── USERS ── */}
        {tab === 'users' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Users</h1>
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1 max-w-xs">
                <input className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                  placeholder="Search name, email, school..." value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }} />
                <span className="absolute left-3 top-2.5 text-gray-400"><Icon d={icons.search} size={16} /></span>
              </div>
              <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm" value={tierFilter}
                onChange={e => { setTierFilter(e.target.value); setPage(1) }}>
                <option value="">All Tiers</option>
                <option value="free">Free</option>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3">Name</th><th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Tier</th><th className="text-left px-4 py-3">Role</th>
                  <th className="text-left px-4 py-3">Exams</th><th className="text-left px-4 py-3">Joined</th>
                  <th className="px-4 py-3"></th>
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {loading && <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr>}
                  {!loading && users.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                      <td className="px-4 py-3"><Badge tier={u.tier} /></td>
                      <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span></td>
                      <td className="px-4 py-3 text-gray-500">{u.totalExamsGenerated}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleRoleToggle(u)} className="text-xs text-yellow-600 hover:underline">{u.role === 'admin' ? 'Demote' : 'Make Admin'}</button>
                          <button onClick={() => handleDeleteUser(u._id, u.name)} className="text-xs text-red-500 hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination />
          </div>
        )}

        {/* ── PREMIUM ── */}
        {tab === 'premium' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Premium Management</h1>
            <div className="relative max-w-xs mb-4">
              <input className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none"
                placeholder="Search user..." value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }} />
              <span className="absolute left-3 top-2.5 text-gray-400"><Icon d={icons.search} size={16} /></span>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3">User</th><th className="text-left px-4 py-3">Tier</th>
                  <th className="text-left px-4 py-3">Expires</th><th className="px-4 py-3">Action</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3"><div className="font-medium text-gray-900">{u.name}</div><div className="text-gray-400 text-xs">{u.email}</div></td>
                      <td className="px-4 py-3"><Badge tier={u.tier} /></td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{u.subscriptionExpiresAt ? new Date(u.subscriptionExpiresAt).toLocaleDateString() : '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => { setPremiumModal(u); setPremiumForm({ tier: 'monthly', days: 30 }) }}
                          className="text-xs bg-[#003399] text-white px-3 py-1.5 rounded-lg">Edit Plan</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination />
            {premiumModal && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold">Edit: {premiumModal.name}</h2>
                    <button onClick={() => setPremiumModal(null)}><Icon d={icons.close} size={18} /></button>
                  </div>
                  <div className="space-y-3">
                    <Select label="Tier" value={premiumForm.tier} onChange={e => setPremiumForm(p => ({ ...p, tier: e.target.value }))}>
                      <option value="free">Free</option><option value="monthly">Monthly</option><option value="annual">Annual</option>
                    </Select>
                    {premiumForm.tier !== 'free' && (
                      <Input label="Days of Access" type="number" value={premiumForm.days} min={1}
                        onChange={e => setPremiumForm(p => ({ ...p, days: Number(e.target.value) }))} />
                    )}
                    <button onClick={handlePremiumUpdate} className="w-full bg-[#003399] text-white py-2.5 rounded-xl font-semibold text-sm">Save</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── EXAMS ── */}
        {tab === 'exams' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">All Exams</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="text-left px-4 py-3">Title</th><th className="text-left px-4 py-3">Subject</th>
                  <th className="text-left px-4 py-3">Grade</th><th className="text-left px-4 py-3">By</th>
                  <th className="text-left px-4 py-3">Date</th><th className="px-4 py-3"></th>
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {loading && <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>}
                  {!loading && exams.map(ex => (
                    <tr key={ex._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{ex.title || 'Untitled'}</td>
                      <td className="px-4 py-3 text-gray-500">{ex.subject}</td>
                      <td className="px-4 py-3 text-gray-500">{ex.grade}</td>
                      <td className="px-4 py-3 text-gray-500">{ex.user?.name || '—'}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{new Date(ex.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => handleDeleteExam(ex._id)} className="text-xs text-red-500 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {!loading && exams.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-gray-400">No exams.</td></tr>}
                </tbody>
              </table>
            </div>
            <Pagination />
          </div>
        )}

        {/* ── QUESTION BANK ── */}
        {tab === 'questions' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
              <button onClick={() => { setQModal('add'); setQForm(emptyQuestion) }}
                className="flex items-center gap-2 bg-[#003399] text-white px-4 py-2 rounded-xl text-sm font-semibold">
                <Icon d={icons.plus} size={16} /> Add Question
              </button>
            </div>
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm" value={qFilters.grade}
                onChange={e => setQFilters(f => ({ ...f, grade: e.target.value }))}>
                <option value="">All Grades</option>
                {GRADES.map(g => <option key={g}>{g}</option>)}
              </select>
              <input className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-36" placeholder="Subject"
                value={qFilters.subject} onChange={e => setQFilters(f => ({ ...f, subject: e.target.value }))} />
              <input className="border border-gray-200 rounded-xl px-3 py-2 text-sm w-36" placeholder="Strand"
                value={qFilters.strand} onChange={e => setQFilters(f => ({ ...f, strand: e.target.value }))} />
              <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm" value={qFilters.difficulty}
                onChange={e => setQFilters(f => ({ ...f, difficulty: e.target.value }))}>
                <option value="">All Difficulty</option>
                {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
              </select>
              <select className="border border-gray-200 rounded-xl px-3 py-2 text-sm" value={qFilters.active}
                onChange={e => setQFilters(f => ({ ...f, active: e.target.value }))}>
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
              <div className="relative">
                <input className="border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-sm w-48" placeholder="Search question..."
                  value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
                <span className="absolute left-2.5 top-2.5 text-gray-400"><Icon d={icons.search} size={15} /></span>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                  <th className="text-left px-4 py-3">Question</th><th className="text-left px-4 py-3">Grade</th>
                  <th className="text-left px-4 py-3">Subject</th><th className="text-left px-4 py-3">Difficulty</th>
                  <th className="text-left px-4 py-3">Marks</th><th className="text-left px-4 py-3">Used</th>
                  <th className="text-left px-4 py-3">Status</th><th className="px-4 py-3"></th>
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {loading && <tr><td colSpan={8} className="text-center py-8 text-gray-400">Loading...</td></tr>}
                  {!loading && questions.map(q => (
                    <tr key={q._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-gray-900 truncate">{q.questionText}</p>
                        <p className="text-gray-400 text-xs">{q.strand} {q.subStrand ? `› ${q.subStrand}` : ''}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{q.grade}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{q.subject}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${q.difficulty === 'easy' ? 'bg-green-100 text-green-700' : q.difficulty === 'hard' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{q.marks}</td>
                      <td className="px-4 py-3 text-gray-500">{q.timesUsed}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleQToggle(q._id)}
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${q.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          {q.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => { setQModal(q); setQForm({ ...q, tags: (q.tags || []).join(', ') }) }}
                            className="text-xs text-blue-600 hover:underline">Edit</button>
                          <button onClick={() => handleQDelete(q._id)} className="text-xs text-red-500 hover:underline">Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && questions.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-gray-400">No questions found.</td></tr>}
                </tbody>
              </table>
            </div>
            <Pagination />

            {/* Question Modal */}
            {qModal && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-lg">{qModal === 'add' ? 'Add Question' : 'Edit Question'}</h2>
                    <button onClick={() => setQModal(null)}><Icon d={icons.close} size={18} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Select label="Grade" value={qForm.grade} onChange={e => setQForm(f => ({ ...f, grade: e.target.value }))}>
                      {GRADES.map(g => <option key={g}>{g}</option>)}
                    </Select>
                    <Input label="Subject" value={qForm.subject} onChange={e => setQForm(f => ({ ...f, subject: e.target.value }))} placeholder="e.g. Biology" />
                    <Input label="Strand" value={qForm.strand} onChange={e => setQForm(f => ({ ...f, strand: e.target.value }))} placeholder="e.g. Cell Biology" />
                    <Input label="Sub-strand" value={qForm.subStrand} onChange={e => setQForm(f => ({ ...f, subStrand: e.target.value }))} placeholder="optional" />
                    <Select label="Type" value={qForm.questionType} onChange={e => setQForm(f => ({ ...f, questionType: e.target.value }))}>
                      {Q_TYPES.map(t => <option key={t}>{t}</option>)}
                    </Select>
                    <Select label="Difficulty" value={qForm.difficulty} onChange={e => setQForm(f => ({ ...f, difficulty: e.target.value }))}>
                      {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                    </Select>
                    <Input label="Marks" type="number" value={qForm.marks} min={1} max={20}
                      onChange={e => setQForm(f => ({ ...f, marks: Number(e.target.value) }))} />
                    <Input label="Source" value={qForm.source} onChange={e => setQForm(f => ({ ...f, source: e.target.value }))} />
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700 block mb-1">Question Text</label>
                      <textarea className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none h-24 resize-none"
                        value={qForm.questionText} onChange={e => setQForm(f => ({ ...f, questionText: e.target.value }))}
                        placeholder="Write the full question here..." />
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700 block mb-1">Answer Guide / Model Answer</label>
                      <textarea className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none h-24 resize-none"
                        value={qForm.answerGuide} onChange={e => setQForm(f => ({ ...f, answerGuide: e.target.value }))}
                        placeholder="Full model answer here..." />
                    </div>
                    <div className="col-span-2">
                      <Input label="Learning Objective" value={qForm.learningObjective}
                        onChange={e => setQForm(f => ({ ...f, learningObjective: e.target.value }))}
                        placeholder="e.g. Student understands osmosis" />
                    </div>
                    <div className="col-span-2">
                      <Input label="Tags (comma separated)" value={qForm.tags}
                        onChange={e => setQForm(f => ({ ...f, tags: e.target.value }))}
                        placeholder="e.g. osmosis, cells, Grade 11" />
                    </div>
                  </div>
                  <button onClick={handleQSubmit}
                    className="w-full mt-5 bg-[#003399] text-white py-3 rounded-xl font-semibold text-sm">
                    {qModal === 'add' ? 'Add to Bank' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── AI PROMPTS ── */}
        {tab === 'prompts' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Prompts</h1>
                <p className="text-sm text-gray-500 mt-0.5">Edit the prompts that power exam generation</p>
              </div>
              <button onClick={() => { setPromptModal('add'); setPromptForm(emptyPrompt) }}
                className="flex items-center gap-2 bg-[#003399] text-white px-4 py-2 rounded-xl text-sm font-semibold">
                <Icon d={icons.plus} size={16} /> New Prompt
              </button>
            </div>
            <div className="space-y-3">
              {loading && <p className="text-gray-400">Loading...</p>}
              {!loading && prompts.length === 0 && (
                <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                  <p className="text-gray-400 mb-3">No prompts yet.</p>
                  <button onClick={() => { setPromptModal('add'); setPromptForm(emptyPrompt) }}
                    className="text-sm text-[#003399] font-semibold hover:underline">Add your first prompt</button>
                </div>
              )}
              {!loading && prompts.map(p => (
                <div key={p._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">{p.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          p.category === 'system' ? 'bg-purple-100 text-purple-700' :
                          p.category === 'section' ? 'bg-blue-100 text-blue-700' :
                          p.category === 'formatting' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{p.category}</span>
                        {!p.isActive && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Inactive</span>}
                      </div>
                      {p.description && <p className="text-sm text-gray-500 mb-2">{p.description}</p>}
                      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 font-mono whitespace-pre-wrap line-clamp-3">
                        {p.content}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">Updated: {new Date(p.updatedAt).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2 ml-4 shrink-0">
                      <button onClick={() => { setPromptModal(p); setPromptForm({ name: p.name, description: p.description, content: p.content, category: p.category }) }}
                        className="text-xs text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => handlePromptDelete(p._id)} className="text-xs text-red-500 hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Prompt Modal */}
            {promptModal && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="font-bold text-lg">{promptModal === 'add' ? 'New Prompt' : `Edit: ${promptModal.name}`}</h2>
                    <button onClick={() => setPromptModal(null)}><Icon d={icons.close} size={18} /></button>
                  </div>
                  <div className="space-y-3">
                    <Input label="Name (unique key)" value={promptForm.name}
                      onChange={e => setPromptForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. exam_generation_system" />
                    <Input label="Description" value={promptForm.description}
                      onChange={e => setPromptForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="What does this prompt do?" />
                    <Select label="Category" value={promptForm.category}
                      onChange={e => setPromptForm(f => ({ ...f, category: e.target.value }))}>
                      {PROMPT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </Select>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Prompt Content</label>
                      <textarea
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 font-mono h-64 resize-none"
                        value={promptForm.content}
                        onChange={e => setPromptForm(f => ({ ...f, content: e.target.value }))}
                        placeholder="Write your AI prompt here. You can use variables like {{grade}}, {{subject}}, {{totalMarks}}" />
                    </div>
                    <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700">
                      ⚠️ Changes here directly affect how exams are generated. Test carefully before saving.
                    </div>
                    <button onClick={handlePromptSubmit}
                      className="w-full bg-[#003399] text-white py-3 rounded-xl font-semibold text-sm">
                      {promptModal === 'add' ? 'Create Prompt' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ANNOUNCE ── */}
        {tab === 'announce' && (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Send Announcement</h1>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-xl">
              <form onSubmit={handleAnnounce} className="space-y-4">
                <Select label="Audience" value={announce.targetTier}
                  onChange={e => setAnnounce(a => ({ ...a, targetTier: e.target.value }))}>
                  <option value="all">All Users</option>
                  <option value="free">Free Users Only</option>
                  <option value="monthly">Monthly Subscribers</option>
                  <option value="annual">Annual Subscribers</option>
                </Select>
                <Input label="Subject" placeholder="Email subject..."
                  value={announce.subject} onChange={e => setAnnounce(a => ({ ...a, subject: e.target.value }))} required />
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Message (HTML supported)</label>
                  <textarea className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none h-40 resize-none"
                    value={announce.message} onChange={e => setAnnounce(a => ({ ...a, message: e.target.value }))}
                    placeholder="Write your announcement..." required />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-[#003399] text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-50">
                  {loading ? 'Sending...' : 'Send Announcement'}
                </button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
