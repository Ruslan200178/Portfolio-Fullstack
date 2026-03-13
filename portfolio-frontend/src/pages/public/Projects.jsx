import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGithub, FiExternalLink, FiFilter } from 'react-icons/fi'
import { projectService } from '../../api/services'
import { getImageUrl, parseTags } from '../../utils/helpers'
import Loader from '../../components/ui/Loader'
import PageTitle from '../../components/ui/PageTitle'

const ProjectCard = ({ project, index }) => {
  const [hovered, setHovered] = useState(false)
  const tags = parseTags(project.tags)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1   }}
      exit={{ opacity: 0, scale: 0.9    }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="card overflow-hidden group p-0"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-video bg-dark-200">
        {project.image ? (
          <img
            src={getImageUrl(project.image)}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-900/50 to-dark-200">
            <span className="text-5xl">🚀</span>
          </div>
        )}

        {/* Overlay on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-dark-300/80 backdrop-blur-sm flex items-center justify-center gap-4"
            >
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank" rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white text-sm font-medium transition-all"
                >
                  <FiGithub size={16} /> Code
                </a>
              )}
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank" rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-xl text-white text-sm font-medium transition-all"
                >
                  <FiExternalLink size={16} /> Live Demo
                </a>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured badge */}
        {project.featured && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-primary-600 text-white text-xs font-bold rounded-lg">
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-white font-bold text-lg mb-2 group-hover:text-primary-400 transition-colors">
          {project.title}
        </h3>

        {project.description && (
          <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 4).map((tag, i) => (
              <span key={i} className="badge text-xs">{tag}</span>
            ))}
            {tags.length > 4 && (
              <span className="badge text-xs">+{tags.length - 4}</span>
            )}
          </div>
        )}

        {/* Links */}
        <div className="flex items-center gap-3 pt-3 border-t border-white/5">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs transition-colors">
              <FiGithub size={14} /> Source Code
            </a>
          )}
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-primary-400 hover:text-primary-300 text-xs transition-colors ml-auto">
              <FiExternalLink size={14} /> Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const Projects = () => {
  const [projects,   setProjects]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [activeTag,  setActiveTag]  = useState('All')

  useEffect(() => {
    projectService.getAll()
      .then(res => setProjects(res.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  // Collect all unique tags
  const allTags = ['All', ...new Set(
    projects.flatMap(p => parseTags(p.tags))
  )]

  const filtered = activeTag === 'All'
    ? projects
    : projects.filter(p => parseTags(p.tags).includes(activeTag))

  return (
    <div>
      <PageTitle title="Projects" subtitle="Things I have built" />

      {/* Tag Filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0  }}
        className="flex flex-wrap items-center gap-2 mb-8"
      >
        <FiFilter size={14} className="text-gray-500" />
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              activeTag === tag
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            {tag}
          </button>
        ))}
      </motion.div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-3">🚀</p>
          <p>No projects found</p>
        </div>
      ) : (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

export default Projects