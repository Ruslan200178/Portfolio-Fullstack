import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiBriefcase, FiCalendar } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { experienceService } from '../../api/services'
import { formatDate } from '../../utils/helpers'
import Modal from '../../components/ui/Modal'
import ConfirmDelete from '../../components/ui/ConfirmDelete'
import PageTitle from '../../components/ui/PageTitle'
import Loader from '../../components/ui/Loader'

const EMPTY = { company: '', position: '', location: '', start_date: '', end_date: '', description: '', technologies: '', is_current: false }

const ExperienceForm = ({ form, setForm, onSubmit, saving, onClose }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="label">Company *</label>
        <input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
          placeholder="Company Name" className="input-field" required />
      </div>
      <div>
        <label className="label">Position *</label>
        <input value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))}
          placeholder="Job Title" className="input-field" required />
      </div>
      <div>
        <label className="label">Location</label>
        <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
          placeholder="City, Country" className="input-field" />
      </div>
      <div>
        <label className="label">Technologies</label>
        <input value={form.technologies} onChange={e => setForm(p => ({ ...p, technologies: e.target.value }))}
          placeholder="React, Laravel, MySQL" className="input-field" />
      </div>
      <div>
        <label className="label">Start Date *</label>
        <input type="date" value={form.start_date} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))}
          className="input-field" required />
      </div>
      <div>
        <label className="label">End Date</label>
        <input type="date" value={form.end_date} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))}
          className="input-field" disabled={form.is_current} />
        <label className="flex items-center gap-2 mt-2 cursor-pointer">
          <input type="checkbox" checked={form.is_current} onChange={e => setForm(p => ({ ...p, is_current: e.target.checked, end_date: e.target.checked ? '' : p.end_date }))}
            className="accent-primary-500" />
          <span className="text-gray-400 text-sm">Currently working here</span>
        </label>
      </div>
      <div className="col-span-2">
        <label className="label">Description</label>
        <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          rows={4} placeholder="Describe your responsibilities..." className="input-field resize-none" />
      </div>
    </div>
    <div className="flex gap-3 pt-2">
      <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
      <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
        {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Save Experience'}
      </button>
    </div>
  </form>
)

const ManageExperience = () => {
  const [items,      setItems]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [saving,     setSaving]     = useState(false)
  const [deleting,   setDeleting]   = useState(false)
  const [showModal,  setShowModal]  = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [editItem,   setEditItem]   = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const [form,       setForm]       = useState(EMPTY)

  const load = () => {
    setLoading(true)
    experienceService.getAll().then(r => setItems(r.data.data || [])).catch(console.error).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openAdd  = ()     => { setEditItem(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = item   => { setEditItem(item); setForm({ company: item.company, position: item.position, location: item.location || '', start_date: item.start_date?.split('T')[0] || '', end_date: item.end_date?.split('T')[0] || '', description: item.description || '', technologies: item.technologies || '', is_current: !item.end_date }); setShowModal(true) }
  const openDel  = item   => { setDeleteItem(item); setShowDelete(true) }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editItem) { await experienceService.update(editItem.id, form); toast.success('Experience updated!') }
      else          { await experienceService.create(form);              toast.success('Experience added!')   }
      setShowModal(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await experienceService.delete(deleteItem.id); toast.success('Deleted!'); setShowDelete(false); load() }
    catch { toast.error('Delete failed') }
    finally { setDeleting(false) }
  }

  if (loading) return <Loader text="Loading experience..." />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageTitle title="Manage Experience" subtitle={`${items.length} entries`} />
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><FiPlus size={18} /> Add Experience</button>
      </div>

      {items.length === 0 ? (
        <div className="card text-center py-16">
          <FiBriefcase size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No experience entries yet</p>
          <button onClick={openAdd} className="btn-primary mt-4">Add First Entry</button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="card group hover:border-primary-500/30 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shrink-0">
                    <FiBriefcase size={18} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-bold truncate">{item.position}</h3>
                    <p className="text-primary-400 text-sm">{item.company}</p>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-1">
                      <FiCalendar size={11} />
                      {formatDate(item.start_date)} — {item.end_date ? formatDate(item.end_date) : <span className="text-green-400">Present</span>}
                    </div>
                    {item.description && <p className="text-gray-500 text-sm mt-2 line-clamp-2">{item.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={() => openEdit(item)} className="p-2 rounded-xl text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all"><FiEdit2 size={15} /></button>
                  <button onClick={() => openDel(item)}  className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 size={15} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Experience' : 'Add Experience'} size="lg">
        <ExperienceForm form={form} setForm={setForm} onSubmit={handleSubmit} saving={saving} onClose={() => setShowModal(false)} />
      </Modal>
      <ConfirmDelete isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} loading={deleting} itemName={deleteItem?.position} />
    </div>
  )
}

export default ManageExperience