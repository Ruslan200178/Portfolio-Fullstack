import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiSave, FiUpload, FiUser, FiGithub, FiLinkedin, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { aboutService } from '../../api/services'
import { getImageUrl } from '../../utils/helpers'
import Loader from '../../components/ui/Loader'
import PageTitle from '../../components/ui/PageTitle'

const ManageAbout = () => {
  const [form, setForm] = useState({
    name:         '',
    title:        '',
    subtitle:     '',
    description:  '',
    email:        '',
    phone:        '',
    location:     '',
    available:    '',
    github_url:   '',
    linkedin_url: '',
    twitter_url:  '',
  })
  const [profilePreview, setProfilePreview] = useState(null)
  const [profileFile,    setProfileFile]    = useState(null)
  const [cvFile,         setCvFile]         = useState(null)
  const [cvName,         setCvName]         = useState('')
  const [loading,        setLoading]        = useState(true)
  const [saving,         setSaving]         = useState(false)
  const profileRef = useRef()
  const cvRef      = useRef()

  useEffect(() => {
    aboutService.get()
      .then(res => {
        const d = res?.data?.data
        if (d) {
          setForm({
            name:         d.name         || '',
            title:        d.title        || '',
            subtitle:     d.subtitle     || '',
            description:  d.description  || '',
            email:        d.email        || '',
            phone:        d.phone        || '',
            location:     d.location     || '',
            available:    d.available    || '',
            github_url:   d.github_url   || '',
            linkedin_url: d.linkedin_url || '',
            twitter_url:  d.twitter_url  || '',
          })
          if (d.profile_image) setProfilePreview(getImageUrl(d.profile_image))
          if (d.cv_file)       setCvName(d.cv_file.split('/').pop())
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleProfileChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setProfileFile(file)
    setProfilePreview(URL.createObjectURL(file))
  }

  const handleCvChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setCvFile(file)
    setCvName(file.name)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => data.append(k, v))
      if (profileFile) data.append('profile_image', profileFile)
      if (cvFile)      data.append('cv_file',       cvFile)
      await aboutService.update(data)
      toast.success('Profile updated successfully!')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        const first = Object.values(errors)[0]
        toast.error(Array.isArray(first) ? first[0] : first)
      } else {
        toast.error(err.response?.data?.message || 'Update failed')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader text="Loading about data..." />

  return (
    <div>
      <PageTitle title="Manage About" subtitle="Update your profile information" />
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">

            {/* Profile Image */}
            <div className="card">
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider text-primary-400">Profile Photo</h3>
              <div className="flex flex-col items-center gap-4">
                <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-white/10 bg-dark-200">
                  {profilePreview
                    ? <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-gray-600"><FiUser size={40} /></div>
                  }
                </div>
                <input ref={profileRef} type="file" accept="image/*" onChange={handleProfileChange} className="hidden" />
                <button type="button" onClick={() => profileRef.current.click()}
                  className="btn-outline w-full flex items-center justify-center gap-2 text-sm">
                  <FiUpload size={15} /> Upload Photo
                </button>
                <p className="text-gray-600 text-xs">JPG, PNG, WebP — max 2MB</p>
              </div>
            </div>

            {/* CV Upload */}
            <div className="card">
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider text-primary-400">CV / Resume</h3>
              <div className="flex flex-col gap-3">
                {cvName && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-2xl">📄</span>
                    <p className="text-white text-xs truncate">{cvName}</p>
                  </div>
                )}
                <input ref={cvRef} type="file" accept=".pdf,.doc,.docx" onChange={handleCvChange} className="hidden" />
                <button type="button" onClick={() => cvRef.current.click()}
                  className="btn-outline w-full flex items-center justify-center gap-2 text-sm">
                  <FiUpload size={15} /> Upload CV
                </button>
                <p className="text-gray-600 text-xs text-center">PDF, DOC, DOCX — max 5MB</p>
              </div>
            </div>

            {/* Save button (also on left for easy access) */}
            <button type="submit" disabled={saving}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
              {saving
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                : <><FiSave size={16} /> Save Changes</>
              }
            </button>
          </motion.div>

          {/* Right — Form fields */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-5">

            {/* Basic Info */}
            <div className="card">
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider text-primary-400">Basic Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange}
                    placeholder="Marzook Mohamed Ruslan" className="input-field" />
                </div>
                <div>
                  <label className="label">Display Title</label>
                  <input name="title" value={form.title} onChange={handleChange}
                    placeholder="Full Stack Developer" className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Subtitle / Tagline</label>
                  <input name="subtitle" value={form.subtitle} onChange={handleChange}
                    placeholder="Laravel & React Specialist" className="input-field" />
                </div>
              </div>
              <div className="mt-4">
                <label className="label">About Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={5}
                  placeholder="Write something about yourself..." className="input-field resize-none" />
              </div>
            </div>

            {/* Contact Info */}
            <div className="card">
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider text-primary-400">Contact Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label"><FiMail size={12} className="inline mr-1" />Email</label>
                  <input name="email" value={form.email} onChange={handleChange}
                    placeholder="you@email.com" className="input-field" type="email" />
                </div>
                <div>
                  <label className="label"><FiPhone size={12} className="inline mr-1" />Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+94 755 490 341" className="input-field" />
                </div>
                <div>
                  <label className="label"><FiMapPin size={12} className="inline mr-1" />Location</label>
                  <input name="location" value={form.location} onChange={handleChange}
                    placeholder="Colombo, Sri Lanka" className="input-field" />
                </div>
                <div>
                  <label className="label">Availability Status</label>
                  <input name="available" value={form.available} onChange={handleChange}
                    placeholder="Open to opportunities" className="input-field" />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="card">
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider text-primary-400">Social Links</h3>
              <div className="space-y-3">
                <div>
                  <label className="label"><FiGithub size={12} className="inline mr-1" />GitHub URL</label>
                  <input name="github_url" value={form.github_url} onChange={handleChange}
                    placeholder="https://github.com/yourusername" className="input-field" />
                </div>
                <div>
                  <label className="label"><FiLinkedin size={12} className="inline mr-1" />LinkedIn URL</label>
                  <input name="linkedin_url" value={form.linkedin_url} onChange={handleChange}
                    placeholder="https://linkedin.com/in/yourusername" className="input-field" />
                </div>
                <div>
                  <label className="label"><FiTwitter size={12} className="inline mr-1" />Twitter URL</label>
                  <input name="twitter_url" value={form.twitter_url} onChange={handleChange}
                    placeholder="https://twitter.com/yourusername" className="input-field" />
                </div>
              </div>
            </div>

          </motion.div>
        </div>
      </form>
    </div>
  )
}

export default ManageAbout