import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiBook, FiCalendar } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { educationService } from '../../api/services'
import { formatDate } from '../../utils/helpers'
import Modal from '../../components/ui/Modal'
import ConfirmDelete from '../../components/ui/ConfirmDelete'
import PageTitle from '../../components/ui/PageTitle'
import Loader from '../../components/ui/Loader'

// Matches your exact DB columns
const EMPTY = {
  institution:    '',
  degree:         '',
  field_of_study: '',   // ← your column name
  start_date:     '',
  end_date:       '',
  is_current:     false,
  grade:          '',
  description:    '',
}

const EducationForm = ({ form, setForm, onSubmit, saving, onClose }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      <div className="col-span-2">
        <label className="label">Institution *</label>
        <input
          value={form.institution}
          onChange={e => setForm(p => ({ ...p, institution: e.target.value }))}
          placeholder="University / School Name"
          className="input-field"
        />
      </div>

      <div>
        <label className="label">Degree *</label>
        <input
          value={form.degree}
          onChange={e => setForm(p => ({ ...p, degree: e.target.value }))}
          placeholder="BSc, MSc, HNDIT, Diploma..."
          className="input-field"
        />
      </div>

      <div>
        <label className="label">Field of Study</label>
        <input
          value={form.field_of_study}
          onChange={e => setForm(p => ({ ...p, field_of_study: e.target.value }))}
          placeholder="Computer Science, IT..."
          className="input-field"
        />
      </div>

      <div>
        <label className="label">Grade / GPA</label>
        <input
          value={form.grade}
          onChange={e => setForm(p => ({ ...p, grade: e.target.value }))}
          placeholder="First Class, 3.8 GPA..."
          className="input-field"
        />
      </div>

      <div />

      <div>
        <label className="label">Start Date *</label>
        <input
          type="date"
          value={form.start_date}
          onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))}
          className="input-field"
        />
      </div>

      <div>
        <label className="label">End Date</label>
        <input
          type="date"
          value={form.end_date}
          onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))}
          disabled={form.is_current}
          className="input-field disabled:opacity-40"
        />
        <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.is_current}
            onChange={e => setForm(p => ({ ...p, is_current: e.target.checked, end_date: e.target.checked ? '' : p.end_date }))}
            className="accent-primary-500 w-4 h-4"
          />
          <span className="text-gray-400 text-sm">Currently studying here</span>
        </label>
      </div>

      <div className="col-span-2">
        <label className="label">Description</label>
        <textarea
          value={form.description}
          onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          rows={3}
          placeholder="Activities, achievements, thesis topic..."
          className="input-field resize-none"
        />
      </div>
    </div>

    <div className="flex gap-3 pt-2">
      <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
      <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
        {saving
          ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          : 'Save Education'
        }
      </button>
    </div>
  </form>
)

const ManageEducation = () => {
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
    educationService.getAll()
      .then(r => setItems(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openAdd = () => {
    setEditItem(null)
    setForm(EMPTY)
    setShowModal(true)
  }

  const openEdit = item => {
    setEditItem(item)
    setForm({
      institution:    item.institution    || '',
      degree:         item.degree         || '',
      field_of_study: item.field_of_study || '',  // ← correct column
      start_date:     item.start_date ? item.start_date.toString().split('T')[0] : '',
      end_date:       item.end_date   ? item.end_date.toString().split('T')[0]   : '',
      is_current:     item.is_current || false,
      grade:          item.grade       || '',
      description:    item.description || '',
    })
    setShowModal(true)
  }

  const openDel = item => {
    setDeleteItem(item)
    setShowDelete(true)
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Client-side validation
    if (!form.institution.trim()) { toast.error('Institution is required'); return }
    if (!form.degree.trim())      { toast.error('Degree is required');      return }
    if (!form.start_date)         { toast.error('Start date is required');  return }

    setSaving(true)
    try {
      // Convert empty strings → null so Laravel doesn't get "" for date fields
      const payload = Object.fromEntries(
        Object.entries(form).map(([k, v]) => [k, v === '' ? null : v])
      )

      if (editItem) {
        await educationService.update(editItem.id, payload)
        toast.success('Education updated!')
      } else {
        await educationService.create(payload)
        toast.success('Education added!')
      }

      setShowModal(false)
      load()
    } catch (err) {
      // Show specific Laravel validation errors if available
      const errors = err.response?.data?.errors
      if (errors) {
        const first = Object.values(errors)[0]
        toast.error(Array.isArray(first) ? first[0] : first)
      } else {
        toast.error(err.response?.data?.message || 'Save failed')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await educationService.delete(deleteItem.id)
      toast.success('Deleted!')
      setShowDelete(false)
      load()
    } catch {
      toast.error('Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <Loader text="Loading education..." />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageTitle title="Manage Education" subtitle={`${items.length} entries`} />
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <FiPlus size={18} /> Add Education
        </button>
      </div>

      {items.length === 0 ? (
        <div className="card text-center py-16">
          <FiBook size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No education entries yet</p>
          <button onClick={openAdd} className="btn-primary mt-4">Add First Entry</button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="card group hover:border-primary-500/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-cyan-600 flex items-center justify-center shrink-0">
                    <FiBook size={18} className="text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-white font-bold truncate">{item.degree}</h3>
                    <p className="text-primary-400 text-sm">{item.institution}</p>
                    {item.field_of_study && (
                      <p className="text-gray-400 text-xs">{item.field_of_study}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <span className="text-gray-500 text-xs flex items-center gap-1">
                        <FiCalendar size={11} />
                        {formatDate(item.start_date)} — {item.is_current ? <span className="text-green-400">Present</span> : formatDate(item.end_date)}
                      </span>
                      {item.grade && (
                        <span className="text-yellow-400 text-xs font-medium">
                          Grade: {item.grade}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-2 rounded-xl text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 transition-all"
                  >
                    <FiEdit2 size={15} />
                  </button>
                  <button
                    onClick={() => openDel(item)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? 'Edit Education' : 'Add Education'}
        size="lg"
      >
        <EducationForm
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
          saving={saving}
          onClose={() => setShowModal(false)}
        />
      </Modal>

      <ConfirmDelete
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        loading={deleting}
        itemName={deleteItem?.degree}
      />
    </div>
  )
}

export default ManageEducation