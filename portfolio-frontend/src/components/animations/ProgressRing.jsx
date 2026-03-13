import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'

const ProgressRing = ({ percentage = 75, size = 80, stroke = 6, label = '', color = '#0ea5e9' }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 })
  const radius        = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset        = circumference - (percentage / 100) * circumference

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke}
          />
          {/* Progress */}
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={inView ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            style={{ transformOrigin: '50% 50%', rotate: '-90deg' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-sm">{percentage}%</span>
        </div>
      </div>
      {label && <p className="text-gray-400 text-xs text-center">{label}</p>}
    </div>
  )
}

export default ProgressRing