import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiUser, FiMessageSquare, FiSend, FiCheck, FiGithub, FiLinkedin, FiMapPin, FiClock } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { contactService, aboutService } from '../../api/services'

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const Contact = () => {
  const [form,      setForm]      = useState({ name: '', email: '', subject: '', message: '' })
  const [errors,    setErrors]    = useState({})
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [about,     setAbout]     = useState(null)

  // Load about info for contact details
  useEffect(() => {
    aboutService.get()
      .then(r => setAbout(r?.data?.data ?? null))
      .catch(() => setAbout(null))
  }, [])

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'Name is required'
    if (!form.email.trim())   e.email   = 'Email is required'
    else if (!isValidEmail(form.email)) e.email = 'Enter a valid email'
    if (!form.subject.trim()) e.subject = 'Subject is required'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    try {
      await contactService.send(form)
      setSubmitted(true)
      setForm({ name: '', email: '', subject: '', message: '' })
      setErrors({})
      toast.success('Message sent successfully!')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send. Please try again.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const infoCards = [
    { icon: <FiMapPin size={18} />,  title: 'Location',  value: about?.location  || 'Available Worldwide'     },
    { icon: <FiMail size={18} />,    title: 'Email',     value: about?.email     || 'hello@portfolio.com'     },
    { icon: '💼',                    title: 'Freelance', value: about?.available || 'Open to opportunities'   },
    { icon: <FiClock size={18} />,   title: 'Response',  value: 'Within 24 hours'                             },
  ]

  return (
    <div className="py-4">

      {/* Title */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-white mb-2">Contact Me</h1>
        <p className="text-gray-400">Let's work together</p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="w-12 h-0.5 bg-primary-500/50 rounded" />
          <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" />
          <div className="w-12 h-0.5 bg-primary-500/50 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">

        {/* Left — Info cards */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          {infoCards.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="card flex items-center gap-4 hover:border-primary-500/30 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 shrink-0">
                {typeof item.icon === 'string' ? <span className="text-lg">{item.icon}</span> : item.icon}
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider">{item.title}</p>
                <p className="text-white text-sm font-medium">{item.value}</p>
              </div>
            </motion.div>
          ))}

          {/* Social links */}
          {(about?.github_url || about?.linkedin_url) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card"
            >
              <p className="text-gray-400 text-sm mb-3">Connect with me</p>
              <div className="flex gap-3">
                {about?.github_url && (
                  <a href={about.github_url} target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-sm border border-white/5 hover:border-white/15">
                    <FiGithub size={15} /> GitHub
                  </a>
                )}
                {about?.linkedin_url && (
                  <a href={about.linkedin_url} target="_blank" rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-sm border border-white/5 hover:border-white/15">
                    <FiLinkedin size={15} /> LinkedIn
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Right — Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-2"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card text-center py-14"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4"
              >
                <FiCheck size={30} className="text-green-400" />
              </motion.div>
              <h3 className="text-xl font-black text-white mb-2">Message Sent! 🎉</h3>
              <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                Thanks for reaching out, {form.name || 'friend'}! I'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-primary"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-5">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <FiUser size={12} className="inline mr-1" />Name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className={`input-field ${errors.name ? 'border-red-500/60 focus:border-red-500' : ''}`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="label">
                      <FiMail size={12} className="inline mr-1" />Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={`input-field ${errors.email ? 'border-red-500/60 focus:border-red-500' : ''}`}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="label">Subject</label>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="What's this about?"
                    className={`input-field ${errors.subject ? 'border-red-500/60 focus:border-red-500' : ''}`}
                  />
                  {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label className="label">
                    <FiMessageSquare size={12} className="inline mr-1" />Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell me about your project or opportunity..."
                    className={`input-field resize-none ${errors.message ? 'border-red-500/60 focus:border-red-500' : ''}`}
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                  <p className="text-gray-600 text-xs mt-1 text-right">{form.message.length} chars</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60"
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                  ) : (
                    <><FiSend size={16} /> Send Message</>
                  )}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Contact