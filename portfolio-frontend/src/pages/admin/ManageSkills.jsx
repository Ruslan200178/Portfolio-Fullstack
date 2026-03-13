import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiCode } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { skillService } from '../../api/services'
import Modal from '../../components/ui/Modal'
import ConfirmDelete from '../../components/ui/ConfirmDelete'
import PageTitle from '../../components/ui/PageTitle'
import Loader from '../../components/ui/Loader'

const EMPTY = { name: '', percentage: 50, category: '', icon: '' }

const SkillForm = ({ form, setForm, onSubmit, saving, onClose }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <label className="label">Skill Name *</label>
        <input
          value={form.name}
          onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          placeholder="e.g. React.js"
          className="input-field"
        />
      </div>
      <div>
        <label className="label">Category</label>
        <input
          value={form.category}
          onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
          placeholder="e.g. Frontend"
          className="input-field"
        />
      </div>
      <div>
        <label className="label">Icon (emoji)</label>
        <input
          value={form.icon}
          onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
          placeholder="e.g. ⚛️"
          className="input-field"
        />
      </div>
      <div className="col-span-2">
        <label className="label">
          Proficiency: <span className="text-primary-400 font-bold">{form.percentage}%</span>
        </label>
        <input
          type="range" min="1" max="100"
          value={form.percentage}
          onChange={e => setForm(p => ({ ...p, percentage: parseInt(e.target.value) }))}
          className="w-full accent-primary-500 cursor-pointer mt-1"
        />
        <div className="h-2 bg-white/5 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-600 to-cyan-400 rounded-full transition-all"
            style={{ width: `${form.percentage}%` }}
          />
        </div>
      </div>
    </div>
    <div className="flex gap-3 pt-2">
      <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
      <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
        {saving
          ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : 'Save Skill'
        }
      </button>
    </div>
  </form>
)

const ManageSkills = () => {
  const [skills,     setSkills]     = useState([])
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [deleting,   setDeleting]   = useState(false)
  const [showModal,  setShowModal]  = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [editItem,   setEditItem]   = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const [form,       setForm]       = useState(EMPTY)
  const [activeTab,  setActiveTab]  = useState('All')

  const load = () => {
    setLoading(true)
    skillService.getAll()
      .then(r => {
        // Safely handle any response shape
        const data = r?.data?.data ?? r?.data ?? []
        setSkills(Array.isArray(data) ? data : [])
      })
      .catch(err => {
        console.error('Skills load error:', err)
        setSkills([])
      })
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openAdd  = ()     => { setEditItem(null);  setForm(EMPTY); setShowModal(true) }
  const openEdit = item   => { setEditItem(item);  setForm({ name: item.name || '', percentage: item.percentage ?? 50, category: item.category || '', icon: item.icon || '' }); setShowModal(true) }
  const openDel  = item   => { setDeleteItem(item); setShowDelete(true) }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Skill name is required'); return }
    setSaving(true)
    try {
      if (editItem) { await skillService.update(editItem.id, form); toast.success('Skill updated!') }
      else          { await skillService.create(form);              toast.success('Skill added!')   }
      setShowModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving skill')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await skillService.delete(deleteItem.id)
      toast.success('Skill deleted!')
      setShowDelete(false)
      load()
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  // Safe category list — guard against null/undefined values
  const categories = ['All', ...new Set(skills.map(s => s.category).filter(Boolean))]

  // Reset tab if it no longer exists after reload
  const safeTab = categories.includes(activeTab) ? activeTab : 'All'
  const filtered = safeTab === 'All' ? skills : skills.filter(s => s.category === safeTab)

  if (loading) return <Loader text="Loading skills..." />

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <PageTitle title="Manage Skills" subtitle={`${skills.length} skills total`} />
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <FiPlus size={18} /> Add Skill
        </button>
      </div>

      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                safeTab === cat
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Skills List */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <FiCode size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-medium mb-1">No skills yet</p>
          <p className="text-gray-600 text-sm mb-4">Add your first skill to get started</p>
          <button onClick={openAdd} className="btn-primary">Add First Skill</button>
        </div>
      ) : (
        <div className="card space-y-3">
          {filtered.map((skill, i) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary-500/20 group transition-all"
            >
              {/* Icon */}
              <div className="w-9 h-9 rounded-lg bg-primary-500/10 flex items-center justify-center shrink-0 text-lg">
                {skill.icon || <FiCode size={16} className="text-primary-400" />}
              </div>

              {/* Info + Bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-semibold">{skill.name}</span>
                    {skill.category && (
                      <span className="badge text-xs hidden sm:inline-flex">{skill.category}</span>
                    )}
                  </div>
                  <span className="text-primary-400 text-xs font-bold">{skill.percentage}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-600 to-cyan-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.percentage}%` }}
                    transition={{ duration: 0.8, delay: i * 0.04, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => openEdit(skill)}
                  className="p-2 rounded-lg text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
                >
                  <FiEdit2 size={14} />
                </button>
                <button
                  onClick={() => openDel(skill)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Skill' : 'Add New Skill'}>
        <SkillForm form={form} setForm={setForm} onSubmit={handleSubmit} saving={saving} onClose={() => setShowModal(false)} />
      </Modal>

      <ConfirmDelete
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
        itemName={deleteItem?.name}
      />
    </div>
  )
}

export default ManageSkills