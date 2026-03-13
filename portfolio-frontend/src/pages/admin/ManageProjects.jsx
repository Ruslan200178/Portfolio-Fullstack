import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiGrid, FiUpload, FiExternalLink, FiGithub } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { projectService } from '../../api/services'
import { getImageUrl, parseTags, truncateText } from '../../utils/helpers'
import Modal from '../../components/ui/Modal'
import ConfirmDelete from '../../components/ui/ConfirmDelete'
import PageTitle from '../../components/ui/PageTitle'
import Loader from '../../components/ui/Loader'

const EMPTY = { title: '', description: '', demo_url: '', github_url: '', tags: '' }

const ProjectForm = ({ form, setForm, imagePreview, setImagePreview, imageFile, setImageFile, onSubmit, saving, onClose, isEdit }) => {
  const imgRef = useRef()
  const handleImg = e => {
    const file = e.target.files[0]; if (!file) return
    setImageFile(file); setImagePreview(URL.createObjectURL(file))
  }
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Image Upload */}
      <div>
        <label className="label">Project Image</label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-16 rounded-xl overflow-hidden bg-dark-200 border border-white/10 shrink-0">
            {imagePreview ? <img src={imagePreview} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-gray-600"><FiGrid size={20} /></div>}
          </div>
          <div className="flex-1">
            <input ref={imgRef} type="file" accept="image/*" onChange={handleImg} className="hidden" />
            <button type="button" onClick={() => imgRef.current.click()}
              className="btn-outline text-sm flex items-center gap-2"><FiUpload size={14} /> Upload Image</button>
            <p className="text-gray-600 text-xs mt-1">JPG, PNG, WebP</p>
          </div>
        </div>
      </div>
      <div>
        <label className="label">Project Title *</label>
        <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
          placeholder="My Awesome Project" className="input-field" required />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
          rows={4} placeholder="Describe your project..." className="input-field resize-none" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Live Demo URL</label>
          <input value={form.demo_url} onChange={e => setForm(p => ({ ...p, demo_url: e.target.value }))}
            placeholder="https://demo.com" className="input-field" />
        </div>
        <div>
          <label className="label">GitHub URL</label>
          <input value={form.github_url} onChange={e => setForm(p => ({ ...p, github_url: e.target.value }))}
            placeholder="https://github.com/..." className="input-field" />
        </div>
      </div>
      <div>
        <label className="label">Tags (comma separated)</label>
        <input value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
          placeholder="React, Laravel, MySQL, TailwindCSS" className="input-field" />
        <p className="text-gray-600 text-xs mt-1">Separate tags with commas</p>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
        <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : isEdit ? 'Update Project' : 'Save Project'}
        </button>
      </div>
    </form>
  )
}

const ManageProjects = () => {
  const [items,         setItems]         = useState([])
  const [loading,       setLoading]       = useState(true)
  const [saving,        setSaving]        = useState(false)
  const [deleting,      setDeleting]      = useState(false)
  const [showModal,     setShowModal]     = useState(false)
  const [showDelete,    setShowDelete]    = useState(false)
  const [editItem,      setEditItem]      = useState(null)
  const [deleteItem,    setDeleteItem]    = useState(null)
  const [form,          setForm]          = useState(EMPTY)
  const [imagePreview,  setImagePreview]  = useState(null)
  const [imageFile,     setImageFile]     = useState(null)

  const load = () => {
    setLoading(true)
    projectService.getAll().then(r => setItems(r.data.data || [])).catch(console.error).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openAdd = () => {
    setEditItem(null); setForm(EMPTY); setImagePreview(null); setImageFile(null); setShowModal(true)
  }
  const openEdit = item => {
    setEditItem(item)
    setForm({ title: item.title, description: item.description || '', demo_url: item.demo_url || '', github_url: item.github_url || '', tags: Array.isArray(parseTags(item.tags)) ? parseTags(item.tags).join(', ') : item.tags || '' })
    setImagePreview(item.image ? getImageUrl(item.image) : null)
    setImageFile(null); setShowModal(true)
  }
  const openDel = item => { setDeleteItem(item); setShowDelete(true) }

  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => data.append(k, v))
      if (imageFile) data.append('image', imageFile)
      if (editItem) { data.append('_method', 'PUT'); await projectService.update(editItem.id, data); toast.success('Project updated!') }
      else          { await projectService.create(data); toast.success('Project added!') }
      setShowModal(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try { await projectService.delete(deleteItem.id); toast.success('Deleted!'); setShowDelete(false); load() }
    catch { toast.error('Delete failed') }
    finally { setDeleting(false) }
  }

  if (loading) return <Loader text="Loading projects..." />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <PageTitle title="Manage Projects" subtitle={`${items.length} projects`} />
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><FiPlus size={18} /> Add Project</button>
      </div>

      {items.length === 0 ? (
        <div className="card text-center py-16">
          <FiGrid size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No projects yet</p>
          <button onClick={openAdd} className="btn-primary mt-4">Add First Project</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((item, i) => {
            const tags = parseTags(item.tags)
            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                className="card overflow-hidden group flex flex-col">
                {/* Image */}
                <div className="relative h-36 -mx-6 -mt-6 mb-4 bg-dark-200 overflow-hidden">
                  {item.image
                    ? <img src={getImageUrl(item.image)} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center"><span className="text-4xl opacity-20">🚀</span></div>
                  }
                  {/* Action overlay */}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(item)} className="p-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-500 transition-all"><FiEdit2 size={16} /></button>
                    <button onClick={() => openDel(item)}  className="p-2.5 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-all"><FiTrash2 size={16} /></button>
                  </div>
                </div>
                {/* Info */}
                <div className="flex-1">
                  <h3 className="text-white font-bold mb-1 truncate">{item.title}</h3>
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2">{truncateText(item.description, 80)}</p>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tags.slice(0, 3).map(t => <span key={t} className="px-2 py-0.5 bg-primary-500/10 text-primary-400 text-xs rounded-md border border-primary-500/20">{t}</span>)}
                      {tags.length > 3 && <span className="text-gray-600 text-xs">+{tags.length - 3}</span>}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-white/5 mt-auto">
                  {item.demo_url   && <a href={item.demo_url}   target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-primary-400 hover:text-primary-300 transition-colors"><FiExternalLink size={12} /> Demo</a>}
                  {item.github_url && <a href={item.github_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"><FiGithub size={12} /> Source</a>}
                  <div className="ml-auto flex gap-2">
                    <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-gray-500 hover:text-primary-400 hover:bg-primary-500/10 transition-all"><FiEdit2 size={13} /></button>
                    <button onClick={() => openDel(item)}  className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><FiTrash2 size={13} /></button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editItem ? 'Edit Project' : 'Add Project'} size="lg">
        <ProjectForm form={form} setForm={setForm} imagePreview={imagePreview} setImagePreview={setImagePreview}
          imageFile={imageFile} setImageFile={setImageFile} onSubmit={handleSubmit} saving={saving} onClose={() => setShowModal(false)} isEdit={!!editItem} />
      </Modal>
      <ConfirmDelete isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} loading={deleting} itemName={deleteItem?.title} />
    </div>
  )
}

export default ManageProjects