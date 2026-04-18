import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../context/authStore'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const FEATURES = [
  'Grade 10, 11 & 12 CBC supported',
  'All 19 Senior School subjects',
  'Hybrid AI question generation',
  'Marking scheme auto-generated',
  'Professional cover page',
  'Kenyan context & CBC examples',
  'Structured, short & long answer questions',
  'Edit questions before printing',
]

const PREMIUM_FEATURES = [
  'Unlimited exam generations',
  'PDF download & print-ready',
  'Save exam history',
  'Priority AI generation',
  'All subjects & strands',
  'School branding on cover',
  'Download as HTML/Print',
  'WhatsApp & email support',
]

export default function PricingPage() {
  const { user, token } = useAuthStore()
  const [phone, setPhone] = useState('')
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [paying, setPaying] = useState(false)
  const navigate = useNavigate()

  const initiatePay = async (plan) => {
    if (!token) { toast.error('Please login first'); return }
    if (!phone || phone.length < 9) { toast.error('Enter a valid M-Pesa phone number'); return }

    setPaying(true)
    try {
const { data } = await api.post('/payments/initiate', { phone, plan })
toast.success(data.message)
setSelectedPlan(null)
setPhone('')

const interval = setInterval(async () => {
  const res = await api.get('/auth/me')
  if (res.data.user.isPremium === true || res.data.user.tier === 'monthly' || res.data.user.tier === 'annual') {
    await refreshUser()
    clearInterval(interval)
    toast.success('🎉 Premium activated! Welcome!')
    navigate('/generate')
  }
}, 5000)
setTimeout(() => clearInterval(interval), 120000)

// Poll every 5 seconds for premium upgrade
const interval = setInterval(async () => {
  const res = await api.get('/auth/me')
  if (res.data.user.isPremium) {
    await refreshUser()
    clearInterval(interval)
    toast.success('🎉 Premium activated! Welcome!')
    navigate('/generate')  // redirect after upgrade
  }
}, 5000)
setTimeout(() => clearInterval(interval), 120000)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment failed. Try again.')
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <div className="bg-brand-blue-dark py-16 text-center px-4">
        <h1 className="font-serif text-4xl text-white mb-3">Simple, Honest Pricing</h1>
        <p className="text-white/60 text-base max-w-md mx-auto">
          Start free. Upgrade when you need more. Pay via M-Pesa — no cards needed.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14">
        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">

          {/* Free */}
          <div className="card p-7 flex flex-col">
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Free</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-gray-900">Ksh 0</span>
              </div>
              <p className="text-xs text-gray-400">Forever free · 3 generations</p>
            </div>
            <ul className="space-y-2.5 flex-1 mb-7">
              {FEATURES.slice(0, 6).map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <svg className="text-emerald-500 flex-shrink-0 mt-0.5" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </li>
              ))}
              <li className="flex items-start gap-2.5 text-sm text-gray-300">
                <svg className="flex-shrink-0 mt-0.5" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                PDF download
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-300">
                <svg className="flex-shrink-0 mt-0.5" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                Unlimited generations
              </li>
            </ul>
            {token ? (
              <div className="py-3 text-center text-sm font-semibold text-gray-400 border-2 border-gray-100 rounded-xl">
                {user?.isPremium ? 'You have Premium' : 'Current Plan'}
              </div>
            ) : (
              <Link to="/register" className="btn-secondary justify-center text-sm py-3">Get Started Free</Link>
            )}
          </div>

          {/* Monthly — featured */}
          <div className="card p-7 flex flex-col border-2 border-brand-blue relative shadow-xl shadow-brand-blue/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-red text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
              Most Popular
            </div>
            <div className="mb-6">
              <p className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-2">Monthly Premium</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-xs text-gray-400 font-normal">Ksh</span>
                <span className="text-4xl font-bold text-gray-900">499</span>
              </div>
              <p className="text-xs text-gray-400">per month · auto-renewed via M-Pesa</p>
            </div>
            <ul className="space-y-2.5 flex-1 mb-7">
              {PREMIUM_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <svg className="text-brand-blue flex-shrink-0 mt-0.5" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            {token ? (
              <button onClick={() => setSelectedPlan('monthly')} className="btn-primary justify-center text-sm py-3">
                Pay Ksh 499 via M-Pesa
              </button>
            ) : (
              <Link to="/register" className="btn-primary justify-center text-sm py-3">Get Started</Link>
            )}
          </div>

          {/* Annual */}
          <div className="card p-7 flex flex-col">
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Annual Premium</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-xs text-gray-500 font-normal">Ksh</span>
                <span className="text-4xl font-bold text-gray-900">3,499</span>
              </div>
              <p className="text-xs text-gray-400">per year · <span className="text-emerald-600 font-bold">Save 42%</span> vs monthly</p>
            </div>
            <ul className="space-y-2.5 flex-1 mb-7">
              {PREMIUM_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <svg className="text-emerald-500 flex-shrink-0 mt-0.5" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            {token ? (
              <button onClick={() => setSelectedPlan('annual')} className="btn-secondary justify-center text-sm py-3 border-2 border-gray-200">
                Pay Ksh 3,499 via M-Pesa
              </button>
            ) : (
              <Link to="/register" className="btn-secondary justify-center text-sm py-3">Get Started</Link>
            )}
          </div>
        </div>

        {/* M-Pesa payment modal */}
        {selectedPlan && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-7 shadow-2xl">
              <h3 className="font-serif text-xl text-gray-900 mb-1">Pay via M-Pesa</h3>
              <p className="text-sm text-gray-400 mb-5">
                {selectedPlan === 'monthly' ? 'Ksh 499 / month' : 'Ksh 3,499 / year'} — you will receive an STK push on your phone.
              </p>
              <div className="mb-4">
                <label className="label">M-Pesa Phone Number</label>
                <input
                  className="input"
                  type="tel"
                  placeholder="0712 345 678"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-1.5">Enter the number registered with M-Pesa</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => initiatePay(selectedPlan)}
                  disabled={paying}
                  className="btn-primary flex-1 justify-center py-3 text-sm"
                >
                  {paying ? 'Sending prompt...' : 'Send M-Pesa Prompt'}
                </button>
                <button onClick={() => setSelectedPlan(null)} className="btn-secondary px-4 py-3 text-sm">
                  Cancel
                </button>
              </div>
              <p className="text-xs text-gray-300 mt-4 text-center">
                Powered by Safaricom Daraja API · Secure payment
              </p>
            </div>
          </div>
        )}

        {/* FAQs */}
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              ['How do I pay?', 'Enter your M-Pesa number and we send an STK Push prompt directly to your phone. Confirm with your PIN and access is activated instantly.'],
              ['Can I cancel anytime?', 'Yes. Monthly subscriptions expire automatically at the end of each month. You are never locked in.'],
              ['Is this CBC Senior School aligned?', 'Yes. ExamsForge is specifically built for the Kenyan CBC Senior School framework — Grade 10, 11 and 12. All strands, sub-strands, and learning outcomes are mapped to KICD standards.'],
              ['What question types are generated?', 'All exams consist of structured questions, short answer, and long answer / calculation questions — matching the actual CBC Senior School exam format. No multiple choice.'],
              ['Can I use it for a whole school?', 'Contact us on WhatsApp for school or department bulk pricing. We offer discounts for 5+ teachers.'],
              ['What subjects are covered?', 'All CBC Senior School subjects including Mathematics, English, Kiswahili, Biology, Chemistry, Physics, History, Geography, CRE/IRE, Business Studies, Agriculture, Computer Science, and more.'],
            ].map(([q, a]) => (
              <div key={q} className="card p-5">
                <p className="font-semibold text-sm text-gray-900 mb-2">{q}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
