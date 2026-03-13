import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiDownload, FiMail, FiGithub, FiLinkedin, FiTwitter, FiMapPin, FiCalendar } from 'react-icons/fi'
import { useData } from '../../context/DataContext'
import { getImageUrl, getInitials } from '../../utils/helpers'
import PageTitle from '../../components/ui/PageTitle'
import Loader from '../../components/ui/Loader'

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0">
      <Icon size={15} className="text-primary-400" />
    </div>
    <div>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="text-white text-sm font-medium">{value || '—'}</p>
    </div>
  </div>
)

const About = () => {
  const { getAbout, loadingMap } = useData()
  const [about, setAbout] = useState(null)
  const loading = loadingMap['about']

  useEffect(() => { getAbout().then(setAbout) }, [])

  if (loading && !about) return <Loader text="Loading about..." />

  return (
    <div className="py-4">
      <PageTitle title="About Me" subtitle="Get to know me better" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="lg:col-span-1">
          <div className="card text-center mb-6">
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-2xl overflow-hidden mx-auto ring-2 ring-primary-500/30">
                {about?.profile_image
                  ? <img src={getImageUrl(about.profile_image)} alt="Profile" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-gradient-to-br from-primary-700 to-primary-400 flex items-center justify-center text-white text-4xl font-bold">
                      {getInitials(about?.title || 'P')}
                    </div>
                }
              </div>
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-400 rounded-full border-2 border-dark-100 flex items-center justify-center">
                <span className="text-xs">✓</span>
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{about?.title || 'Developer'}</h2>
            <p className="text-primary-400 text-sm mb-4">{about?.subtitle || 'Full Stack Developer'}</p>
            <div className="flex items-center justify-center gap-3 mb-5">
              {about?.github_url   && <a href={about.github_url}   target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"><FiGithub   size={17} /></a>}
              {about?.linkedin_url && <a href={about.linkedin_url} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"><FiLinkedin size={17} /></a>}
              {about?.twitter_url  && <a href={about.twitter_url}  target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"><FiTwitter  size={17} /></a>}
              {about?.email    && <a href={`mailto:${about.email}`}        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"><FiMail     size={17} /></a>}
            </div>
            {about?.cv_file && (
              <a href={getImageUrl(about.cv_file)} download target="_blank" rel="noreferrer"
                className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                <FiDownload size={15} /> Download CV
              </a>
            )}
          </div>
          <div className="card">
            <h3 className="text-white font-bold mb-2 text-sm uppercase tracking-wider text-primary-400">Personal Info</h3>
            <InfoItem icon={FiMapPin}   label="Location"  value={about?.location} />
            <InfoItem icon={FiMail}     label="Email"     value={about?.email}    />
            <InfoItem icon={FiCalendar} label="Available" value={about?.available || 'Open to opportunities'} />
          </div>
        </motion.div>

        {/* Right */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-white mb-4">Who Am I?</h3>
            <div className="text-gray-400 leading-relaxed space-y-3">
              {about?.description
                ? about.description.split('\n').map((p, i) => <p key={i}>{p}</p>)
                : <p>No description added yet.</p>}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-white mb-4">What I Do</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: '🌐', title: 'Web Development',     desc: 'Building responsive and performant web apps'     },
                { icon: '⚙️', title: 'Backend Development', desc: 'RESTful APIs, databases and server architecture' },
                { icon: '🎨', title: 'UI/UX Design',        desc: 'Clean, intuitive user interfaces'                },
                { icon: '📱', title: 'Mobile Friendly',     desc: 'Responsive designs for all screen sizes'         },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary-500/20 transition-all">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-white mb-4">Quick Facts</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                { emoji: '☕', label: 'Coffees/day', value: '3+' },
                { emoji: '💻', label: 'Hours coding', value: '8h' },
                { emoji: '🐛', label: 'Bugs fixed',   value: '∞'  },
                { emoji: '🎯', label: 'Focus level',  value: '100%'},
              ].map((fact, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.08 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="text-2xl mb-2">{fact.emoji}</div>
                  <div className="text-white font-bold text-lg">{fact.value}</div>
                  <div className="text-gray-500 text-xs">{fact.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About