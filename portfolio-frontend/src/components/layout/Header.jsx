import { useState, useEffect } from 'react'
import { useLocation, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiDownload, FiMoon, FiSun } from 'react-icons/fi'
import { aboutService } from '../../api/services'
import { getImageUrl } from '../../utils/helpers'

const routeTitles = {
  '/':           { title: 'Home',       subtitle: 'Welcome to my portfolio'        },
  '/about':      { title: 'About Me',   subtitle: 'Get to know me better'          },
  '/skills':     { title: 'Skills',     subtitle: 'My technical expertise'         },
  '/experience': { title: 'Experience', subtitle: 'My professional journey'        },
  '/education':  { title: 'Education',  subtitle: 'My academic background'         },
  '/projects':   { title: 'Projects',   subtitle: 'Things I have built'            },
  '/contact':    { title: 'Contact',    subtitle: 'Let\'s work together'           },
}

const Header = () => {
  const location = useLocation()
  const [scrolled,  setScrolled]  = useState(false)
  const [cvFile,    setCvFile]    = useState(null)

  const currentPage = routeTitles[location.pathname] || routeTitles['/']

  useEffect(() => {
    aboutService.get()
      .then(res => setCvFile(res.data.data?.cv_file))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`
        sticky top-0 z-20 transition-all duration-300
        ${scrolled
          ? 'bg-dark-200/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/5'
          : 'bg-transparent'
        }
      `}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* ── Page Title (desktop) ── */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0   }}
          transition={{ duration: 0.3   }}
          className="hidden lg:block"
        >
          <h1 className="text-xl font-bold text-white">{currentPage.title}</h1>
          <p className="text-sm text-gray-400">{currentPage.subtitle}</p>
        </motion.div>

        {/* ── Mobile Spacer (for menu button) ── */}
        <div className="lg:hidden w-10" />

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Breadcrumb */}
          <nav className="hidden md:flex items-center gap-1 text-sm text-gray-400">
            <NavLink to="/" className="hover:text-primary-400 transition-colors">
              Home
            </NavLink>
            {location.pathname !== '/' && (
              <>
                <span className="text-gray-600">/</span>
                <span className="text-primary-400 font-medium capitalize">
                  {location.pathname.replace('/', '')}
                </span>
              </>
            )}
          </nav>

          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-white/10" />

          {/* Download CV Button */}
          {cvFile && (
            <a
              href={getImageUrl(cvFile)}
              download
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 btn-primary text-sm py-2 px-4"
            >
              <FiDownload size={15} />
              <span className="hidden sm:inline">Download CV</span>
            </a>
          )}

          {/* Admin Link */}
          <NavLink
            to="/admin/login"
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors px-2 py-1 rounded border border-transparent hover:border-white/10"
          >
            Admin
          </NavLink>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <ScrollProgress />
    </header>
  )
}

// Reading progress bar
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const total = scrollHeight - clientHeight
      setProgress(total > 0 ? (scrollTop / total) * 100 : 0)
    }
    window.addEventListener('scroll', update)
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div className="h-0.5 bg-white/5">
      <motion.div
        className="h-full bg-gradient-to-r from-primary-600 to-cyan-400"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default Header