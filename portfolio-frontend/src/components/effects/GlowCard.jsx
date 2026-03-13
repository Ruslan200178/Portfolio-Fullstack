import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

const GlowCard = ({ children, className = '', glowColor = 'rgba(14,165,233,0.15)' }) => {
  const cardRef           = useRef(null)
  const [glow, setGlow]   = useState({ x: '50%', y: '50%', opacity: 0 })
  const [tilt, setTilt]   = useState({ rotateX: 0, rotateY: 0 })

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width  / 2
    const cy = rect.height / 2
    const rotateX = ((y - cy) / cy) * -6
    const rotateY = ((x - cx) / cx) * 6
    setGlow({ x: `${x}px`, y: `${y}px`, opacity: 1 })
    setTilt({ rotateX, rotateY })
  }

  const handleMouseLeave = () => {
    setGlow(p => ({ ...p, opacity: 0 }))
    setTilt({ rotateX: 0, rotateY: 0 })
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ transformStyle: 'preserve-3d', perspective: 800 }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Glow spot */}
      <div
        className="absolute pointer-events-none rounded-full transition-opacity duration-300"
        style={{
          width: 320, height: 320,
          left: glow.x, top: glow.y,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          opacity: glow.opacity,
          zIndex: 0,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

export default GlowCard