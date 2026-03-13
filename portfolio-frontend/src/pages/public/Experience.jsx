import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { FiBriefcase, FiCalendar, FiMapPin } from 'react-icons/fi'
import { experienceService } from '../../api/services'
import { formatDate } from '../../utils/helpers'
import Loader from '../../components/ui/Loader'
import PageTitle from '../../components/ui/PageTitle'

const TimelineItem = ({ item, index, isLast }) => {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })
  const isLeft = index % 2 === 0

  return (
    <div ref={ref} className="relative flex gap-6 pb-10">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-5 top-10 w-0.5 h-full bg-gradient-to-b from-primary-500/50 to-transparent" />
      )}

      {/* Icon dot */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ delay: index * 0.1, type: 'spring' }}
        className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/30 ring-4 ring-dark-300"
      >
        <FiBriefcase size={16} className="text-white" />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: index * 0.1 + 0.1, duration: 0.4 }}
        className="flex-1 card hover:scale-[1.01] transition-transform duration-300"
      >
        {/* Date badge */}
        <div className="flex items-center gap-2 text-primary-400 text-xs font-semibold mb-3">
          <FiCalendar size={12} />
          <span>
            {formatDate(item.start_date)} — {item.current ? 'Present' : formatDate(item.end_date)}
          </span>
          {item.current && (
            <span className="ml-2 px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs border border-green-500/30">
              Current
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-lg mb-1">{item.position}</h3>

        {/* Company */}
        <div className="flex items-center gap-2 text-primary-400 font-semibold mb-3">
          <span>{item.company}</span>
          {item.location && (
            <>
              <span className="text-gray-600">·</span>
              <span className="flex items-center gap-1 text-gray-400 text-sm font-normal">
                <FiMapPin size={12} /> {item.location}
              </span>
            </>
          )}
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
        )}

        {/* Tags */}
        {item.technologies && (
          <div className="flex flex-wrap gap-2 mt-4">
            {item.technologies.split(',').map((tech, i) => (
              <span key={i} className="badge text-xs">{tech.trim()}</span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

const Experience = () => {
  const [experiences, setExperiences] = useState([])
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    experienceService.getAll()
      .then(res => setExperiences(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  return (
    <div>
      <PageTitle title="Experience" subtitle="My professional journey" />

      {experiences.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-3">💼</p>
          <p>No experience added yet</p>
        </div>
      ) : (
        <div className="max-w-3xl">
          {experiences.map((exp, i) => (
            <TimelineItem
              key={exp.id}
              item={exp}
              index={i}
              isLast={i === experiences.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Experience