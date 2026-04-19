import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../context/authStore'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, token, logout } = useAuthStore()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close dropdown on route change
  useEffect(() => { setDropdownOpen(false) }, [pathname])

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
          {user?.role === 'admin' && navLink('/admin', 'Admin')}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {token ? (
            <>
              {/* Tier badge */}
              <span className={`hidden sm:block text-xs font-bold px-2.5 py-1 rounded-full ${
                user?.isPremium
                  ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30'
                  : 'bg-white/10 text-white/60 border border-white/15'
              }`}>
                {user?.isPremium ? '⭐ Premium' : 'Free'}
              </span>

              {/* Avatar dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs font-bold border border-white/20 flex-shrink-0">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="hidden sm:block text-white/80 text-sm font-medium max-w-[100px] truncate">
                    {user?.name}
                  </span>
                  {/* Chevron */}
                  <svg className={`hidden sm:block w-3 h-3 text-white/50 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-10 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    {/* User info */}
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>

                    <Link to="/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
                      </svg>
                      My Profile
                    </Link>

                    <Link to="/my-exams"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/>
                      </svg>
                      My Exams
                    </Link>

                    {!user?.isPremium && (
                      <Link to="/pricing"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-brand-red font-semibold hover:bg-red-50 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        Upgrade to Premium
                      </Link>
                    )}

                    {user?.role === 'admin' && (
                      <Link to="/admin"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-yellow-600 font-semibold hover:bg-yellow-50 transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        Admin Panel
                      </Link>
                    )}

                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Upgrade button — only on mobile (desktop shows in dropdown) */}
              {!user?.isPremium && (
                <Link to="/pricing"
                  className="sm:hidden bg-brand-red hover:bg-red-700 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap">
                  Upgrade
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login"
                className="text-white/70 hover:text-white text-sm font-medium px-2 sm:px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all whitespace-nowrap">
                Login
              </Link>
              <Link to="/register"
                className="bg-brand-red hover:bg-red-700 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1.5 rounded-lg transition-all whitespace-nowrap">
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
