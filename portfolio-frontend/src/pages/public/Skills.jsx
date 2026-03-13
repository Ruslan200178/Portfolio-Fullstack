import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { skillService } from '../../api/services'
import Loader from '../../components/ui/Loader'

// Skill level helper
const getLevel = (pct) => {
  if (pct >= 90) return { label: 'Expert',       color: '#22c55e' }
  if (pct >= 75) return { label: 'Advanced',     color: '#3b82f6' }
  if (pct >= 50) return { label: 'Intermediate', color: '#eab308' }
  return               { label: 'Beginner',      color: '#f97316' }
}

// Animated bar — uses IntersectionObserver directly (no package needed)
const SkillBar = ({ skill, index }) => {
  const [visible, setVisible] = useState(false)
  const [animated, setAnimated] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setAnimated(true), index * 60)
      return () => clearTimeout(t)
    }
  }, [visible, index])

  const barColor = skill.color || '#0ea5e9'
  const level    = getLevel(skill.percentage ?? 0)

  return (
    <div ref={ref} className="group">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          {skill.icon && <span className="text-base leading-none">{skill.icon}</span>}
          <span className="text-white text-sm font-semibold">{skill.name}</span>
          <span className="text-xs font-medium hidden sm:inline" style={{ color: level.color }}>
            {level.label}
          </span>
        </div>
        <span className="text-sm font-bold" style={{ color: barColor }}>
          {skill.percentage}%
        </span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out relative"
          style={{
            width: animated ? `${skill.percentage}%` : '0%',
            backgroundColor: barColor,
          }}
        >
          {animated && (
            <span
              className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full shadow-lg"
              style={{ backgroundColor: '#fff', boxShadow: `0 0 6px ${barColor}` }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const Skills = () => {
  const [skills,    setSkills]    = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)
  const [activeTab, setActiveTab] = useState('All')
  const [view,      setView]      = useState('bars')

  useEffect(() => {
    skillService.getAll()
      .then(r => {
        const data = r?.data?.data ?? r?.data ?? []
        setSkills(Array.isArray(data) ? data : [])
      })
      .catch(err => {
        console.error('Skills error:', err)
        setError('Could not load skills. Is the backend running?')
        setSkills([])
      })
      .finally(() => setLoading(false))
  }, [])

  const categories = ['All', ...new Set(skills.map(s => s.category).filter(Boolean))]
  const safeTab    = categories.includes(activeTab) ? activeTab : 'All'
  const filtered   = safeTab === 'All' ? skills : skills.filter(s => s.category === safeTab)

  if (loading) return <Loader text="Loading skills..." />

  return (
    <div className="py-4 space-y-8">

      {/* Title */}
      <div className="mb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full" />
          <h1 className="text-3xl font-black text-white">My Skills</h1>
        </div>
        <p className="text-gray-400 text-base ml-4">Technologies and tools I work with</p>
      </div>

      {/* Error */}
      {error && (
        <div className="card border-red-500/30 bg-red-500/5 text-red-400 text-sm text-center py-6">
          ⚠️ {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                safeTab === cat
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/5 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-1 p-1 bg-dark-200 rounded-xl border border-white/5">
          {['bars', 'tags'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                view === v ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && !error && (
        <div className="card text-center py-20 text-gray-500">
          {skills.length === 0 ? 'No skills added yet.' : 'No skills in this category.'}
        </div>
      )}

      {filtered.length > 0 && (
        <>
          {/* ── BARS VIEW ── */}
          {view === 'bars' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Skill bars */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card space-y-5"
              >
                <h3 className="text-white font-bold text-lg">Proficiency</h3>
                {filtered.map((s, i) => <SkillBar key={s.id} skill={s} index={i} />)}
              </motion.div>

              {/* Right column */}
              <div className="space-y-5">

                {/* Bubble cloud */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card"
                >
                  <h3 className="text-white font-bold text-lg mb-4">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {filtered.map((s, i) => (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.04 }}
                        whileHover={{ scale: 1.08, y: -2 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-default"
                        style={{
                          backgroundColor: `${s.color || '#0ea5e9'}15`,
                          borderColor:     `${s.color || '#0ea5e9'}30`,
                        }}
                      >
                        {s.icon && <span className="text-sm leading-none">{s.icon}</span>}
                        <span className="text-white text-sm font-medium">{s.name}</span>
                        <span className="text-xs font-bold" style={{ color: s.color || '#0ea5e9' }}>
                          {s.percentage}%
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Legend */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="card"
                >
                  <h3 className="text-white font-bold text-lg mb-4">Levels</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Expert',       range: '90–100%', color: '#22c55e' },
                      { label: 'Advanced',     range: '75–89%',  color: '#3b82f6' },
                      { label: 'Intermediate', range: '50–74%',  color: '#eab308' },
                      { label: 'Beginner',     range: '0–49%',   color: '#f97316' },
                    ].map(l => (
                      <div key={l.label} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                        <span className="text-sm font-semibold" style={{ color: l.color }}>{l.label}</span>
                        <span className="text-gray-600 text-xs ml-auto font-mono">{l.range}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* ── TAGS VIEW ── */}
          {view === 'tags' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card"
            >
              <div className="flex flex-wrap gap-3 justify-center">
                {filtered.map((s, i) => {
                  const barColor = s.color || '#0ea5e9'
                  const fontSize = 0.8 + (s.percentage / 100) * 0.45
                  return (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ scale: 1.08, y: -3 }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border transition-all cursor-default"
                      style={{
                        fontSize:        `${fontSize}rem`,
                        backgroundColor: `${barColor}15`,
                        borderColor:     `${barColor}30`,
                      }}
                    >
                      {s.icon && <span>{s.icon}</span>}
                      <span className="text-white font-bold">{s.name}</span>
                      <span className="text-xs font-semibold" style={{ color: barColor }}>
                        {s.percentage}%
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}

export default Skills