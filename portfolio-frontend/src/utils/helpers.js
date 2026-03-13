// Format date to readable string
export const formatDate = (dateString) => {
  if (!dateString) return 'Present'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

// Get image URL from backend storage
export const getImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `http://localhost:8000/storage/${path}`
}

// Truncate long text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Validate email
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Get initials from name
export const getInitials = (name) => {
  if (!name) return 'A'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Parse tags from string or array
export const parseTags = (tags) => {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  try {
    return JSON.parse(tags)
  } catch {
    return tags.split(',').map(t => t.trim())
  }
}

// Skill level label
export const getSkillLevel = (percentage) => {
  if (percentage >= 90) return { label: 'Expert',        color: 'text-green-400'  }
  if (percentage >= 75) return { label: 'Advanced',      color: 'text-blue-400'   }
  if (percentage >= 50) return { label: 'Intermediate',  color: 'text-yellow-400' }
  return                       { label: 'Beginner',      color: 'text-orange-400' }
}