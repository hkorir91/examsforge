import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../context/authStore'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, token, logout } = useAuthStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 ${
        pathname === to
          ? 'text-white bg-white/15'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="bg-brand-blue-dark sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-7 h-7 bg-brand-red rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          {/* Full name on sm+, short name on mobile */}
          <span className="hidden sm:block text-white font-bold text-base tracking-tight">
            ExamsForge <span className="text-white/50 font-normal text-xs">by SmartSchool</span>
          </span>
          <span className="sm:hidden text-white font-bold text-base tracking-tight">
            ExamsForge
          </span>
        </Link>

        {/* Nav links — desktop only */}
        <div className="hidden md:flex items-center gap-1">
          {navLink('/', 'Home')}
          {token && navLink('/generate', 'Create Exam')}
          {token && navLink('/my-exams', 'My Exams')}
          {navLink('/pricing', 'Pricing')}
          {user?.role === 'admin' && navLink('/dashboard', 'Admin')}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {token ? (
            <>
              {/* Tier badge — hidden on mobile */}
              <span className={`hidden sm:block text-xs font-bold px-2.5 py-1 rounded-full ${
                user?.isPremium
                  ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30'
                  : 'bg-white/10 text-white/60 border border-white/15'
              }`}>
                {user?.isPremium ? '⭐ Premium' : 'Free'}
              </span>

              {/* User avatar + name — name hidden on mobile */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs font-bold border border-white/20 flex-shrink-0">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:block text-white/80 text-sm font-medium max-w-[100px] truncate">
                  {user?.name}
                </span>
              </div>

              {/* Upgrade — show on all sizes but compact on mobile */}
              {!user?.isPremium && (
                <Link
                  to="/pricing"
                  className="bg-brand-red hover:bg-red-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap"
                >
                  Upgrade
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-white/60 hover:text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all whitespace-nowrap"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white/70 hover:text-white text-sm font-medium px-2 sm:px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all whitespace-nowrap"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-brand-red hover:bg-red-700 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 rounded-lg transition-all whitespace-nowrap"
              >
                {/* Short text on mobile, full on sm+ */}
                <span className="sm:hidden">Start Free</span>
                <span className="hidden sm:inline">Get Started Free</span>
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}
