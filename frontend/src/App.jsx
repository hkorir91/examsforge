import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './context/authStore'

import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import GeneratorPage from './pages/GeneratorPage'
import MyExamsPage from './pages/MyExamsPage'
import ExamViewPage from './pages/ExamViewPage'
import PricingPage from './pages/PricingPage'
import DashboardPage from './pages/DashboardPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

function PrivateRoute({ children }) {
  const { token } = useAuthStore()
  return token ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { token } = useAuthStore()
  return !token ? children : <Navigate to="/generate" replace />
}

export default function App() {
  const { token, refreshUser } = useAuthStore()

  useEffect(() => {
    if (token) refreshUser()
  }, [])

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { fontFamily: 'DM Sans, sans-serif', fontSize: '14px', borderRadius: '12px' },
          success: { iconTheme: { primary: '#003399', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<><Navbar /><LandingPage /></>} />
        <Route path="/pricing" element={<><Navbar /><PricingPage /></>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
<Route path="/reset-password/:token" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

        {/* Protected */}
        <Route path="/generate" element={<PrivateRoute><><Navbar /><GeneratorPage /></></PrivateRoute>} />
        <Route path="/my-exams" element={<PrivateRoute><><Navbar /><MyExamsPage /></></PrivateRoute>} />
        <Route path="/exams/:id" element={<PrivateRoute><><Navbar /><ExamViewPage /></></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><><Navbar /><DashboardPage /></></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
