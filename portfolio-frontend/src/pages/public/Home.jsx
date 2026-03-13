import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiDownload, FiMail, FiGithub, FiLinkedin, FiCode, FiBriefcase, FiGrid } from 'react-icons/fi'
import { useData } from '../../context/DataContext'
import { getImageUrl, getInitials } from '../../utils/helpers'

const Home = () => {
  const { getAbout, getSkills, getProjects, getExperiences, loadingMap } = useData()
  const [about,   setAbout]   = useState(null)
  const [stats,   setStats]   = useState({ skills: 0, projects: 0, experience: 0 })
  const [words,   setWords]   = useState(['Developer', 'a Creator', 'a Builder'])
  const [wordIdx, setWordIdx] = useState(0)
  const [display, setDisplay] = useState('')
  const [deleting, setDeleting] = useState(false)

  const loading = loadingMap['about'] || loadingMap['skills'] || loadingMap['projects'] || loadingMap['experiences']

  useEffect(() => {
    getAbout().then(data => {
      setAbout(data)
      if (data?.title) setWords([data.title, 'a Creator', 'a Builder'])
    })
    Promise.all([getSkills(), getProjects(), getExperiences()]).then(([s, p, e]) => {
      setStats({
        skills:     Array.isArray(s) ? s.length : 0,
        projects:   Array.isArray(p) ? p.length : 0,
        experience: Array.isArray(e) ? e.length : 0,
      })
    })
  }, [])

  // Simple typewriter — no missing component needed
  useEffect(() => {
    const word = words[wordIdx]
    let timeout
    if (!deleting && display.length < word.length) {
      timeout = setTimeout(() => setDisplay(word.slice(0, display.length + 1)), 80)
    } else if (!deleting && display.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && display.length > 0) {
      timeout = setTimeout(() => setDisplay(display.slice(0, -1)), 40)
    } else if (deleting && display.length === 0) {
      setDeleting(false)
      setWordIdx(i => (i + 1) % words.length)
    }
    return () => clearTimeout(timeout)
  }, [display, deleting, wordIdx, words])

  // Simple CountUp
  const CountUp = ({ end }) => {
    const [val, setVal] = useState(0)
    useEffect(() => {
      if (!end) return
      const step = Math.ceil(end / 30)
      let cur = 0
      const t = setInterval(() => {
        cur = Math.min(cur + step, end)
        setVal(cur)
        if (cur >= end) clearInterval(t)
      }, 40)
      return () => clearInterval(t)
    }, [end])
    return <span className="text-3xl font-black text-white">{val}+</span>
  }

  return (
    <div className="min-h-full py-6 space-y-20">

      {/* ── HERO ── */}
      <div className="flex flex-col lg:flex-row items-center gap-12">

        {/* Text */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="badge mb-5 inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {about?.available || 'Available for work'}
            </span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-3 leading-none tracking-tight">
              Hi, I'm<br />
              <span className="gradient-text">
                {display}<span className="animate-pulse text-primary-400">|</span>
              </span>
            </h1>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 mt-4">
            {about?.description
              ? about.description.substring(0, 160) + '...'
              : 'Passionate about building beautiful and functional web applications.'}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link to="/projects" className="btn-primary flex items-center gap-2 shadow-glow">
              View Projects <FiArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn-outline flex items-center gap-2">
              <FiMail size={16} /> Contact Me
            </Link>
            {about?.cv_file && (
              <a href={getImageUrl(about.cv_file)} download target="_blank" rel="noreferrer"
                className="btn-ghost flex items-center gap-2 border border-white/10">
                <FiDownload size={15} /> CV
              </a>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex items-center gap-5 mt-8 justify-center lg:justify-start">
            {about?.github_url   && <a href={about.github_url}   target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm"><FiGithub   size={17} /> GitHub</a>}
            {about?.linkedin_url && <a href={about.linkedin_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm"><FiLinkedin size={17} /> LinkedIn</a>}
          </motion.div>
        </div>

        {/* Avatar */}
        <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 90 }} className="shrink-0">
          <div className="relative">
            <div className="absolute inset-0 rounded-full border border-primary-500/20 scale-[1.3]" />
            <div className="absolute inset-0 rounded-full bg-primary-500/10 blur-3xl scale-125" />
            <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full ring-2 ring-primary-500/30 ring-offset-4 ring-offset-dark-300 overflow-hidden">
              {about?.profile_image
                ? <img src={getImageUrl(about.profile_image)} alt="Profile" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-500 flex items-center justify-center text-white font-black text-7xl">
                    {getInitials(about?.title || 'P')}
                  </div>
              }
            </div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute -top-3 -right-3 glass px-3 py-1.5 rounded-xl text-xs font-semibold text-primary-300">
              💻 Open to Work
            </motion.div>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 0.6 }}
              className="absolute -bottom-3 -left-3 glass px-3 py-1.5 rounded-xl text-xs font-semibold text-green-300">
              ✅ Available Now
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── STATS ── */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { icon: FiCode,      label: 'Skills',      value: stats.skills,     color: 'from-primary-600 to-primary-700' },
          { icon: FiGrid,      label: 'Projects',    value: stats.projects,   color: 'from-cyan-600    to-cyan-700'    },
          { icon: FiBriefcase, label: 'Experiences', value: stats.experience, color: 'from-purple-600  to-purple-700'  },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card-glow rounded-2xl p-6 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shrink-0`}>
              <Icon size={24} className="text-white" />
            </div>
            <div>
              <CountUp end={value} />
              <p className="text-gray-500 text-sm">{label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── QUICK NAV ── */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="text-2xl font-black text-white mb-6">Explore Portfolio</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { to: '/about',    icon: '👤', label: 'About Me',  desc: 'My story & background', grad: 'from-blue-600/20'   },
            { to: '/skills',   icon: '⚡', label: 'My Skills', desc: 'Tech stack overview',   grad: 'from-yellow-600/20' },
            { to: '/projects', icon: '🚀', label: 'Projects',  desc: 'Work I have built',     grad: 'from-green-600/20'  },
            { to: '/contact',  icon: '📬', label: 'Contact',   desc: "Let's collaborate",     grad: 'from-pink-600/20'   },
          ].map((item, i) => (
            <motion.div key={item.to} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.07 }} whileHover={{ y: -5 }}>
              <Link to={item.to}
                className={`block p-5 rounded-2xl bg-gradient-to-br ${item.grad} to-transparent border border-white/5 hover:border-white/20 transition-all group`}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-white font-bold mb-1 group-hover:text-primary-400 transition-colors">{item.label}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-primary-400 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all">
                  Explore <FiArrowRight size={12} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Home