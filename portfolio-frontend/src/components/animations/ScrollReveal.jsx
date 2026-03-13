import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const directionMap = {
  up:    { initial: { opacity: 0, y: 32  }, animate: { opacity: 1, y: 0  } },
  down:  { initial: { opacity: 0, y: -32 }, animate: { opacity: 1, y: 0  } },
  left:  { initial: { opacity: 0, x: -32 }, animate: { opacity: 1, x: 0  } },
  right: { initial: { opacity: 0, x: 32  }, animate: { opacity: 1, x: 0  } },
  scale: { initial: { opacity: 0, scale: 0.88 }, animate: { opacity: 1, scale: 1 } },
  fade:  { initial: { opacity: 0 },              animate: { opacity: 1 }           },
}

const ScrollReveal = ({
  children,
  direction = 'up',
  delay     = 0,
  duration  = 0.55,
  threshold = 0.15,
  className = '',
}) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold })
  const { initial, animate } = directionMap[direction]

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? animate : initial}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal