import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff, FiLayout } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Login = () => {
  const [form,        setForm]        = useState({ email: '', password: '' })
  const [showPass,    setShowPass]    = useState(false)
  const [loading,     setLoading]     = useState(false)
  const { login }   = useAuth()
  const navigate    = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { toast.error('Please fill in all fields'); return }
    setLoading(true)
    const result = await login(form.email, form.password)
    if (result.success) {
      toast.success('Welcome back!')
      navigate('/admin/dashboard')
    } else {
      toast.error(result.message || 'Invalid credentials')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-dark-300 flex items-center justify-center p-4">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md relative">

        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.1 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-primary-500/30">
            <FiLayout size={28} className="text-white" />
          </motion.div>
          <h1 className="text-2xl font-black text-white">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage your portfolio</p>
        </div>

        {/* Card */}
        <div className="card border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <FiMail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="admin@portfolio.com"
                  className="input-field pl-10" autoComplete="email" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <FiLock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10" autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                : 'Sign In'
              }
            </button>
          </form>
        </div>

        {/* Back to portfolio */}
        <p className="text-center text-gray-500 text-sm mt-6">
          <a href="/" className="text-primary-400 hover:text-primary-300 transition-colors">
            ← Back to Portfolio
          </a>
        </p>
      </motion.div>
    </div>
  )
}

export default Login