import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiBell, FiLogOut, FiUser } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/helpers'

const pageTitles = {
  '/admin/dashboard':  { title: 'Dashboard',  subtitle: 'Overview of your portfolio'        },
  '/admin/about':      { title: 'About',       subtitle: 'Manage your about section'         },
  '/admin/skills':     { title: 'Skills',      subtitle: 'Manage your skills'                },
  '/admin/experience': { title: 'Experience',  subtitle: 'Manage your work experience'       },
  '/admin/education':  { title: 'Education',   subtitle: 'Manage your education history'     },
  '/admin/projects':   { title: 'Projects',    subtitle: 'Manage your projects'              },
  '/admin/messages':   { title: 'Messages',    subtitle: 'View contact messages'             },
}

const AdminHeader = ({ unreadCount = 0 }) => {
  const location            = useLocation()
  const { user, logout }    = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const currentPage = pageTitles[location.pathname] || pageTitles['/admin/dashboard']

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest('#admin-dropdown')) setDropdownOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  return (
    <header
      className={`
        sticky top-0 z-20 transition-all duration-300
        ${scrolled
          ? 'bg-dark-200/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/5'
          : 'bg-dark-200/50 backdrop-blur-sm border-b border-white/5'
        }
      `}
    >
      <div className="flex items-center justify-between px-6 py-3.5">
        {/* ── Page Title ── */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0   }}
          transition={{ duration: 0.3   }}
          className="hidden lg:block"
        >
          <h1 className="text-lg font-bold text-white leading-tight">
            {currentPage.title}
          </h1>
          <p className="text-xs text-gray-500">{currentPage.subtitle}</p>
        </motion.div>

        {/* ── Mobile Spacer ── */}
        <div className="lg:hidden w-10" />

        {/* ── Right Side ── */}
        <div className="flex items-center gap-3 ml-auto">

          {/* Notification Bell */}
          <div className="relative">
            <button className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <FiBell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-white/10" />

          {/* User Dropdown */}
          <div className="relative" id="admin-dropdown">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/10 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white text-xs font-bold">
                {getInitials(user?.name || 'Admin')}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-white text-sm font-semibold leading-none">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">Administrator</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1    }}
                className="absolute right-0 top-full mt-2 w-48 bg-dark-100 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-white text-sm font-semibold">{user?.name}</p>
                  <p className="text-gray-500 text-xs truncate">{user?.email}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <FiLogOut size={15} />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader