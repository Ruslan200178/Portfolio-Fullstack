import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AdminSidebar from './AdminSidebar'
import AdminHeader  from './AdminHeader'
import { contactService } from '../../api/services'

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0  },
  exit:    { opacity: 0, y: -15 },
}

const AdminLayout = () => {
  const location                    = useLocation()
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch unread message count for badge
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await contactService.getAll()
        const unread = res.data.data?.filter(m => !m.is_read)?.length || 0
        setUnreadCount(unread)
      } catch {
        // ignore
      }
    }
    fetchUnread()
  }, [location.pathname]) // refetch on nav change

  return (
    <div className="flex h-screen bg-dark-200 overflow-hidden">
      {/* ── Admin Sidebar ── */}
      <AdminSidebar unreadCount={unreadCount} />

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col lg:ml-60 min-w-0">
        {/* ── Admin Header ── */}
        <AdminHeader unreadCount={unreadCount} />

        {/* ── Page Content ── */}
        <main className="flex-1 overflow-y-auto bg-dark-200">
          {/* Subtle background pattern */}
          <div className="fixed inset-0 pointer-events-none -z-10">
            <div className="absolute top-20 right-10 w-72 h-72 bg-primary-600/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-72 w-72 h-72 bg-cyan-600/5 rounded-full blur-3xl" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="p-6 min-h-full"
            >
              <Outlet context={{ setUnreadCount }} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout