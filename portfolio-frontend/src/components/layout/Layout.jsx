import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar           from './Sidebar'
import Header            from './Header'
import CursorGlow        from '../effects/CursorGlow'
import ParticleBackground from '../effects/ParticleBackground'
import MorphBlob         from '../effects/MorphBlob'

const pageVariants = {
  initial: { opacity: 0, y: 20,  filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0,   filter: 'blur(0px)' },
  exit:    { opacity: 0, y: -16, filter: 'blur(4px)' },
}

const Layout = () => {
  const location = useLocation()

  return (
    <div className="flex h-screen bg-dark-300 overflow-hidden relative">

      {/* ── Background Effects ── */}
      <ParticleBackground />
      <CursorGlow />

      {/* Subtle grid */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none z-0" />

      {/* Morph blobs */}
      <div className="fixed pointer-events-none z-0 overflow-hidden inset-0">
        <MorphBlob color="primary" size="lg" opacity={0.07} className="absolute -top-20 -right-20" delay="0s"  />
        <MorphBlob color="cyan"    size="md" opacity={0.05} className="absolute bottom-20 left-1/3" delay="3s" />
      </div>

      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 relative z-10">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="page-container min-h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default Layout