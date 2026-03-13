import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome, FiUser, FiCode, FiBriefcase, FiBook,
  FiGrid, FiMail, FiMenu, FiX, FiLogOut,
  FiLayout, FiExternalLink
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/helpers'

const adminLinks = [
  { to: '/admin/dashboard',  icon: FiLayout,    label: 'Dashboard',  badge: null },
  { to: '/admin/about',      icon: FiUser,      label: 'About',      badge: null },
  { to: '/admin/skills',     icon: FiCode,      label: 'Skills',     badge: null },
  { to: '/admin/experience', icon: FiBriefcase, label: 'Experience', badge: null },
  { to: '/admin/education',  icon: FiBook,      label: 'Education',  badge: null },
  { to: '/admin/projects',   icon: FiGrid,      label: 'Projects',   badge: null },
  { to: '/admin/messages',   icon: FiMail,      label: 'Messages',   badge: 'new'},
]

const AdminSidebar = ({ unreadCount = 0 }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout }    = useAuth()
  const location            = useLocation()

  useEffect(() => { setIsOpen(false) }, [location])

  const handleLogout = async () => {
    await logout()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* ── Logo / Brand ── */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
          <FiLayout size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-sm">Portfolio Admin</h1>
          <p className="text-gray-500 text-xs">Control Panel</p>
        </div>
      </div>

      {/* ── Admin User Info ── */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white text-sm font-bold shrink-0">
            {getInitials(user?.name || 'Admin')}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">
              {user?.name || 'Admin'}
            </p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          </div>
          <div className="ml-auto w-2 h-2 bg-green-400 rounded-full shrink-0 animate-pulse" />
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider px-3 mb-3">
          Manage
        </p>
        {adminLinks.map((link, i) => (
          <motion.div
            key={link.to}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0   }}
            transition={{ delay: 0.05 * i }}
          >
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <link.icon size={17} className="shrink-0" />
              <span className="font-medium text-sm">{link.label}</span>
              {link.badge === 'new' && unreadCount > 0 && (
                <span className="ml-auto bg-primary-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* ── Bottom Actions ── */}
      <div className="p-3 border-t border-white/10 space-y-1">
        {/* View Portfolio */}
        <NavLink
          to="/"
          target="_blank"
          className="sidebar-link text-sm"
        >
          <FiExternalLink size={16} className="shrink-0" />
          <span>View Portfolio</span>
        </NavLink>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm"
        >
          <FiLogOut size={16} className="shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-60 h-screen bg-dark-100 border-r border-white/5 fixed left-0 top-0 z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile Toggle ── */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 bg-dark-100 border border-white/10 rounded-xl text-white hover:bg-dark-200 transition-all shadow-lg"
      >
        <FiMenu size={22} />
      </button>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-60 bg-dark-100 border-r border-white/5 z-50 shadow-2xl"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <FiX size={20} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default AdminSidebar