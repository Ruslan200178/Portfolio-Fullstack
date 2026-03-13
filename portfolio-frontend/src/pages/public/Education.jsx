import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiBook, FiCalendar, FiAward } from 'react-icons/fi'
import { educationService } from '../../api/services'
import { formatDate } from '../../utils/helpers'
import Loader from '../../components/ui/Loader'
import PageTitle from '../../components/ui/PageTitle'

const EducationCard = ({ item, index }) => {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      className="relative flex gap-6 pb-10"
    >
      {/* Vertical line */}
      <div className="absolute left-5 top-10 w-0.5 h-full bg-gradient-to-b from-cyan-500/50 to-transparent" />

      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ delay: index * 0.12, type: 'spring' }}
        className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-primary-400 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/30 ring-4 ring-dark-300"
      >
        <FiBook size={16} className="text-white" />
      </motion.div>

      {/* Card */}
      <div className="flex-1 card group hover:scale-[1.01] transition-transform duration-300">
        {/* Date */}
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-3">
          <FiCalendar size={12} />
          <span>
            {formatDate(item.start_date)} — {item.current ? 'Present' : formatDate(item.end_date)}
          </span>
          {item.current && (
            <span className="ml-2 px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full text-xs border border-cyan-500/30">
              Ongoing
            </span>
          )}
        </div>

        {/* Degree */}
        <h3 className="text-white font-bold text-lg mb-1">
          {item.degree}
          {item.field && <span className="text-primary-400"> in {item.field}</span>}
        </h3>

        {/* Institution */}
        <p className="text-cyan-400 font-semibold mb-3">{item.institution}</p>

        {/* Description */}
        {item.description && (
          <p className="text-gray-400 text-sm leading-relaxed mb-3">{item.description}</p>
        )}

        {/* Grade / GPA */}
        {item.grade && (
          <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-primary-500/10 border border-primary-500/20 w-fit">
            <FiAward size={14} className="text-primary-400" />
            <span className="text-primary-400 text-sm font-semibold">{item.grade}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

const Education = () => {
  const [educations, setEducations] = useState([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    educationService.getAll()
      .then(res => setEducations(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  return (
    <div>
      <PageTitle title="Education" subtitle="My academic background" />

      {educations.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-3">🎓</p>
          <p>No education added yet</p>
        </div>
      ) : (
        <div className="max-w-3xl">
          {educations.map((edu, i) => (
            <EducationCard key={edu.id} item={edu} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Education