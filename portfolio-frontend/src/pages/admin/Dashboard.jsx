import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiCode, FiBriefcase, FiBook, FiGrid, FiMail, FiArrowRight, FiTrendingUp } from 'react-icons/fi'
import { skillService, projectService, experienceService, educationService, contactService } from '../../api/services'
import { useAuth } from '../../context/AuthContext'
import Loader from '../../components/ui/Loader'

const StatCard = ({ icon: Icon, label, value, color, to, delay }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
    <Link to={to} className="card flex items-center justify-between group hover:border-primary-500/40 transition-all block">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-lg`}>
          <Icon size={20} className="text-white" />
        </div>
        <div>
          <p className="text-2xl font-black text-white">{value}</p>
          <p className="text-gray-400 text-sm">{label}</p>
        </div>
      </div>
      <FiArrowRight size={18} className="text-gray-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
    </Link>
  </motion.div>
)

const QuickAction = ({ to, icon, label, desc, color }) => (
  <Link to={to} className="card group hover:border-primary-500/30 transition-all flex items-start gap-4">
    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-white font-semibold text-sm group-hover:text-primary-400 transition-colors">{label}</p>
      <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
    </div>
    <FiArrowRight size={14} className="text-gray-600 group-hover:text-primary-400 ml-auto mt-1 transition-all group-hover:translate-x-1" />
  </Link>
)

const Dashboard = () => {
  const { user }  = useAuth()
  const [stats,   setStats]   = useState({ skills: 0, projects: 0, experience: 0, education: 0, messages: 0, unread: 0 })
  const [loading, setLoading] = useState(true)
  const [recentMessages, setRecentMessages] = useState([])

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [skillsRes, projectsRes, expRes, eduRes, msgRes] = await Promise.all([
          skillService.getAll(), projectService.getAll(), experienceService.getAll(),
          educationService.getAll(), contactService.getAll(),
        ])
        const messages = msgRes.data.data || []
        setStats({
          skills:     skillsRes.data.data?.length    || 0,
          projects:   projectsRes.data.data?.length  || 0,
          experience: expRes.data.data?.length       || 0,
          education:  eduRes.data.data?.length       || 0,
          messages:   messages.length,
          unread:     messages.filter(m => !m.is_read).length,
        })
        setRecentMessages(messages.slice(0, 4))
      } catch (err) { console.error(err) }
      finally { setLoading(false) }
    }
    fetchAll()
  }, [])

  if (loading) return <Loader text="Loading dashboard..." />

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-black text-white">{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-gray-400 mt-1">Here is what is happening with your portfolio today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <StatCard icon={FiCode}      label="Total Skills"      value={stats.skills}     color="bg-primary-600"  to="/admin/skills"      delay={0.1} />
        <StatCard icon={FiGrid}      label="Total Projects"    value={stats.projects}   color="bg-cyan-600"     to="/admin/projects"    delay={0.15} />
        <StatCard icon={FiBriefcase} label="Experience"        value={stats.experience} color="bg-purple-600"   to="/admin/experience"  delay={0.2} />
        <StatCard icon={FiBook}      label="Education"         value={stats.education}  color="bg-green-600"    to="/admin/education"   delay={0.25} />
        <StatCard icon={FiMail}      label="Total Messages"    value={stats.messages}   color="bg-orange-600"   to="/admin/messages"    delay={0.3} />
        <StatCard icon={FiTrendingUp} label="Unread Messages"  value={stats.unread}     color="bg-red-600"      to="/admin/messages"    delay={0.35} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary-500 rounded-full inline-block" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <QuickAction to="/admin/skills"     icon={<FiCode      size={18} className="text-white" />} label="Add New Skill"       desc="Add a skill to your profile"      color="bg-primary-600"  />
            <QuickAction to="/admin/projects"   icon={<FiGrid      size={18} className="text-white" />} label="Add New Project"     desc="Showcase a new project"           color="bg-cyan-600"     />
            <QuickAction to="/admin/experience" icon={<FiBriefcase size={18} className="text-white" />} label="Add Experience"      desc="Update work history"              color="bg-purple-600"   />
            <QuickAction to="/admin/education"  icon={<FiBook      size={18} className="text-white" />} label="Add Education"       desc="Add academic achievement"         color="bg-green-600"    />
            <QuickAction to="/admin/about"      icon={<FiUser      size={18} className="text-white" />} label="Update About"        desc="Edit your profile info"           color="bg-orange-600"   />
          </div>
        </motion.div>

        {/* Recent Messages */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <h2 className="text-white font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-5 bg-primary-500 rounded-full inline-block" />
            Recent Messages
            {stats.unread > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{stats.unread} unread</span>
            )}
          </h2>
          <div className="space-y-3">
            {recentMessages.length === 0 ? (
              <div className="card text-center py-8 text-gray-500 text-sm">No messages yet</div>
            ) : (
              recentMessages.map((msg, i) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.08 }}
                  className={`card ${!msg.is_read ? 'border-primary-500/30 bg-primary-500/5' : ''}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {msg.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{msg.name}</p>
                        <p className="text-gray-500 text-xs truncate">{msg.subject}</p>
                      </div>
                    </div>
                    {!msg.is_read && <span className="w-2 h-2 bg-primary-400 rounded-full shrink-0 mt-1 animate-pulse" />}
                  </div>
                </motion.div>
              ))
            )}
            {recentMessages.length > 0 && (
              <Link to="/admin/messages" className="flex items-center justify-center gap-2 text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium py-2">
                View All Messages <FiArrowRight size={14} />
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard