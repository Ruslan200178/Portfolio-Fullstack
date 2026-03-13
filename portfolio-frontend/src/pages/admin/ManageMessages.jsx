import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMail, FiTrash2, FiEye, FiSearch, FiInbox, FiClock, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { contactService } from '../../api/services'
import Modal from '../../components/ui/Modal'
import ConfirmDelete from '../../components/ui/ConfirmDelete'
import PageTitle from '../../components/ui/PageTitle'
import Loader from '../../components/ui/Loader'

// Safe string helper — prevents crash if field is null
const safe = (val) => (val ?? '').toString()

// Format date nicely
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs  = now - d
    const diffMin = Math.floor(diffMs / 60000)
    const diffHr  = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHr / 24)

    if (diffMin < 1)   return 'Just now'
    if (diffMin < 60)  return `${diffMin}m ago`
    if (diffHr  < 24)  return `${diffHr}h ago`
    if (diffDay < 7)   return `${diffDay}d ago`
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch { return '' }
}

const ManageMessages = () => {
  const [messages,   setMessages]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [showMsg,    setShowMsg]    = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [activeMsg,  setActiveMsg]  = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const [deleting,   setDeleting]   = useState(false)
  const [search,     setSearch]     = useState('')
  const [filter,     setFilter]     = useState('all')

  // Load messages directly from API
  const load = () => {
    setLoading(true)
    contactService.getAll()
      .then(r => {
        const data = r?.data?.data ?? r?.data ?? []
        setMessages(Array.isArray(data) ? data : [])
      })
      .catch(err => {
        console.error('Messages load error:', err.response?.data || err.message)
        toast.error('Failed to load messages')
        setMessages([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  // Open message and mark as read
  const openMsg = async (msg) => {
    setActiveMsg(msg)
    setShowMsg(true)
    if (!msg.is_read) {
      try {
        await contactService.markRead(msg.id)
        // Update locally so UI updates instantly without full reload
        setMessages(prev => prev.map(m =>
          m.id === msg.id ? { ...m, is_read: true } : m
        ))
        setActiveMsg(prev => prev ? { ...prev, is_read: true } : prev)
      } catch (err) {
        console.error('markRead error:', err)
      }
    }
  }

  const openDel = (msg, e) => {
    e?.stopPropagation()
    setDeleteItem(msg)
    setShowDelete(true)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await contactService.delete(deleteItem.id)
      toast.success('Message deleted!')
      setShowDelete(false)
      if (showMsg && activeMsg?.id === deleteItem.id) setShowMsg(false)
      setMessages(prev => prev.filter(m => m.id !== deleteItem.id))
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  // Filter messages
  const filtered = messages.filter(m => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      safe(m.name).toLowerCase().includes(q)    ||
      safe(m.email).toLowerCase().includes(q)   ||
      safe(m.subject).toLowerCase().includes(q) ||
      safe(m.message).toLowerCase().includes(q)
    const matchFilter =
      filter === 'all'    ? true :
      filter === 'unread' ? !m.is_read :
                             m.is_read
    return matchSearch && matchFilter
  })

  const unreadCount = messages.filter(m => !m.is_read).length

  if (loading) return <Loader text="Loading messages..." />

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <PageTitle
          title="Messages"
          subtitle={`${messages.length} total · ${unreadCount} unread`}
        />
        {unreadCount > 0 && (
          <span className="flex items-center gap-2 px-3 py-1.5 bg-primary-500/15 border border-primary-500/30 rounded-xl text-primary-400 text-sm font-medium">
            <span className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
            {unreadCount} new
          </span>
        )}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, email or subject..."
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-2">
          {[
            { key: 'all',    label: 'All'    },
            { key: 'unread', label: 'Unread' },
            { key: 'read',   label: 'Read'   },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                filter === f.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
              }`}>
              {f.label}
              {f.key === 'unread' && unreadCount > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <FiInbox size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-medium mb-1">
            {search || filter !== 'all' ? 'No messages match your filter' : 'No messages yet'}
          </p>
          <p className="text-gray-600 text-sm">
            {messages.length === 0 ? 'Messages from your contact form will appear here' : ''}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => openMsg(msg)}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all group ${
                  !msg.is_read
                    ? 'bg-primary-500/8 border-primary-500/25 hover:border-primary-500/50'
                    : 'bg-dark-100 border-white/5 hover:border-white/15'
                }`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                  !msg.is_read ? 'bg-primary-600' : 'bg-dark-200'
                }`}>
                  {safe(msg.name).charAt(0).toUpperCase() || '?'}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm font-semibold truncate ${!msg.is_read ? 'text-white' : 'text-gray-300'}`}>
                      {safe(msg.name)}
                    </span>
                    {!msg.is_read && (
                      <span className="w-2 h-2 bg-primary-400 rounded-full shrink-0 animate-pulse" />
                    )}
                  </div>
                  <p className={`text-sm truncate ${!msg.is_read ? 'text-gray-300' : 'text-gray-500'}`}>
                    {safe(msg.subject)}
                  </p>
                  <p className="text-gray-600 text-xs truncate">{safe(msg.email)}</p>
                </div>

                {/* Meta + Actions */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-gray-500 text-xs">{formatDate(msg.created_at)}</p>
                    {msg.is_read ? (
                      <span className="text-green-500/70 text-xs flex items-center gap-1 justify-end mt-0.5">
                        <FiCheck size={10} /> Read
                      </span>
                    ) : (
                      <span className="text-primary-400 text-xs font-semibold">New</span>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => { e.stopPropagation(); openMsg(msg) }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
                    >
                      <FiEye size={14} />
                    </button>
                    <button
                      onClick={e => openDel(msg, e)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Message detail modal */}
      <Modal isOpen={showMsg} onClose={() => setShowMsg(false)} title="Message Detail" size="md">
        {activeMsg && (
          <div className="space-y-4">

            {/* Sender info */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
                {safe(activeMsg.name).charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold">{safe(activeMsg.name)}</p>
                <p className="text-primary-400 text-sm truncate">{safe(activeMsg.email)}</p>
                <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                  <FiClock size={10} />
                  {activeMsg.created_at ? new Date(activeMsg.created_at).toLocaleString() : ''}
                </p>
              </div>
              {activeMsg.is_read && (
                <span className="flex items-center gap-1 px-2 py-1 bg-green-500/15 border border-green-500/30 rounded-lg text-green-400 text-xs font-medium shrink-0">
                  <FiCheck size={11} /> Read
                </span>
              )}
            </div>

            {/* Subject */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Subject</p>
              <p className="text-white font-semibold">{safe(activeMsg.subject)}</p>
            </div>

            {/* Message body */}
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Message</p>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-sm leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {safe(activeMsg.message)}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <a
                href={`mailto:${safe(activeMsg.email)}?subject=Re: ${encodeURIComponent(safe(activeMsg.subject))}`}
                className="btn-primary flex-1 flex items-center justify-center gap-2 text-sm"
              >
                <FiMail size={15} /> Reply via Email
              </a>
              <button
                onClick={e => { setShowMsg(false); setTimeout(() => openDel(activeMsg, e), 100) }}
                className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
              >
                <FiTrash2 size={15} /> Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirm delete */}
      <ConfirmDelete
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
        itemName={`message from ${safe(deleteItem?.name)}`}
      />
    </div>
  )
}

export default ManageMessages