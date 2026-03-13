import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiHome, FiUser, FiCode, FiBriefcase,
  FiBook, FiGrid, FiMail, FiMenu, FiX,
  FiGithub, FiLinkedin, FiTwitter
} from 'react-icons/fi'
import { aboutService } from '../../api/services'
import { getImageUrl, getInitials } from '../../utils/helpers'

const navLinks = [
  { to: '/',           icon: FiHome,      label: 'Home'       },
  { to: '/about',      icon: FiUser,      label: 'About'      },
  { to: '/skills',     icon: FiCode,      label: 'Skills'     },
  { to: '/experience', icon: FiBriefcase, label: 'Experience' },
  { to: '/education',  icon: FiBook,      label: 'Education'  },
  { to: '/projects',   icon: FiGrid,      label: 'Projects'   },
  { to: '/contact',    icon: FiMail,      label: 'Contact'    },
]

const Sidebar = () => {
  const [isOpen,  setIsOpen]  = useState(false)
  const [profile, setProfile] = useState(null)
  const location = useLocation()

  useEffect(() => {
    aboutService.get()
      .then(res => setProfile(res.data.data))
      .catch(() => {})
  }, [])

  // Close mobile sidebar on route change
  useEffect(() => { setIsOpen(false) }, [location])

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* ── Profile Section ── */}
      <div className="flex flex-col items-center py-8 px-4 border-b border-white/10">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className="relative mb-4"
        >
          <div className="w-20 h-20 rounded-full ring-2 ring-primary-500 ring-offset-2 ring-offset-dark-200 overflow-hidden">
            {profile?.profile_image ? (
              <img
                src={getImageUrl(profile.profile_image)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(profile?.title || 'My Portfolio')}
              </div>
            )}
          </div>
          {/* Online dot */}
          <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-dark-200 animate-pulse" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.2 }}
          className="text-white font-bold text-lg text-center leading-tight"
        >
          {profile?.title || 'My Portfolio'}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ delay: 0.3 }}
          className="text-primary-400 text-sm mt-1 text-center"
        >
          {profile?.subtitle || 'Full Stack Developer'}
        </motion.p>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-3 mt-4"
        >
          {profile?.github && (
            <a href={profile.github} target="_blank" rel="noreferrer"
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <FiGithub size={16} />
            </a>
          )}
          {profile?.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noreferrer"
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <FiLinkedin size={16} />
            </a>
          )}
          {profile?.twitter && (
            <a href={profile.twitter} target="_blank" rel="noreferrer"
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
              <FiTwitter size={16} />
            </a>
          )}
        </motion.div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navLinks.map((link, i) => (
          <motion.div
            key={link.to}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0   }}
            transition={{ delay: 0.1 * i  }}
          >
            <NavLink
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <link.icon size={18} className="shrink-0" />
              <span className="font-medium">{link.label}</span>

              {/* Active indicator */}
              <NavLink to={link.to} end={link.to === '/'}>
                {({ isActive }) => isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 bg-primary-400 rounded-full"
                  />
                )}
              </NavLink>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-gray-600 text-center">
          © {new Date().getFullYear()} · Built with ❤️
        </p>
      </div>
    </div>
  )

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-dark-100 border-r border-white/5 fixed left-0 top-0 z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile Toggle Button ── */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 bg-dark-100 border border-white/10 rounded-xl text-white hover:bg-dark-200 transition-all shadow-lg"
      >
        <FiMenu size={22} />
      </button>

      {/* ── Mobile Sidebar Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{   opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0        }}
              exit={{   x: '-100%'   }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-64 bg-dark-100 border-r border-white/5 z-50 shadow-2xl"
            >
              {/* Close Button */}
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

export default Sidebar