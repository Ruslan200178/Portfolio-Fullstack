import { motion } from 'framer-motion'

const variants = {
  fadeUp: {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0  },
    exit:    { opacity: 0, y: -18 },
  },
  slideRight: {
    initial: { opacity: 0, x: -40 },
    animate: { opacity: 1, x: 0   },
    exit:    { opacity: 0, x: 40  },
  },
  scale: {
    initial: { opacity: 0, scale: 0.94 },
    animate: { opacity: 1, scale: 1    },
    exit:    { opacity: 0, scale: 1.02 },
  },
  blur: {
    initial: { opacity: 0, filter: 'blur(8px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit:    { opacity: 0, filter: 'blur(8px)' },
  },
}

const PageTransition = ({ children, variant = 'fadeUp', duration = 0.38 }) => {
  const v = variants[variant]
  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition