import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const container = (stagger) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren: 0.1,
    },
  },
})

const item = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0,
    transition: { ease: [0.22, 1, 0.36, 1], duration: 0.5 }
  },
}

export const StaggerParent = ({ children, stagger = 0.1, className = '' }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.div
      ref={ref}
      variants={container(stagger)}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export const StaggerItem = ({ children, className = '' }) => (
  <motion.div variants={item} className={className}>
    {children}
  </motion.div>
)

export default StaggerParent