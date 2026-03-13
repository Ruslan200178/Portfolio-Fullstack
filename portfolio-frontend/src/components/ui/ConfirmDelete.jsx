import { motion, AnimatePresence } from 'framer-motion'
import { FiAlertTriangle, FiX, FiTrash2 } from 'react-icons/fi'

const ConfirmDelete = ({ isOpen, onClose, onConfirm, itemName = 'this item', loading = false }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1   }}
            exit={{   opacity: 0, scale: 0.8  }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-md bg-dark-100 rounded-2xl border border-red-500/30 shadow-2xl p-6"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white transition-colors"
            >
              <FiX size={18} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <FiAlertTriangle size={32} className="text-red-400" />
              </div>
            </div>

            {/* Text */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Delete Confirmation</h3>
              <p className="text-gray-400">
                Are you sure you want to delete{' '}
                <span className="text-white font-semibold">"{itemName}"</span>?
                <br />
                <span className="text-red-400 text-sm">This action cannot be undone.</span>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 btn-outline disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 btn-danger flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FiTrash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ConfirmDelete