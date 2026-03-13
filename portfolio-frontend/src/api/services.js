import API from './axios'

// ─── AUTH ────────────────────────────────────────────────
export const authService = {
  login:  (credentials) => API.post('/api/login', credentials),
  logout: ()            => API.post('/api/logout'),
  me:     ()            => API.get('/api/me'),
}

// ─── ABOUT ───────────────────────────────────────────────
export const aboutService = {
  get:    ()     => API.get('/api/about'),
  update: (data) => API.post('/api/about', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

// ─── SKILLS ──────────────────────────────────────────────
export const skillService = {
  getAll:  ()           => API.get('/api/skills'),
  create:  (data)       => API.post('/api/skills', data),
  update:  (id, data)   => API.put(`/api/skills/${id}`, data),
  delete:  (id)         => API.delete(`/api/skills/${id}`),
}

// ─── EXPERIENCE ──────────────────────────────────────────
export const experienceService = {
  getAll:  ()           => API.get('/api/experiences'),
  create:  (data)       => API.post('/api/experiences', data),
  update:  (id, data)   => API.put(`/api/experiences/${id}`, data),
  delete:  (id)         => API.delete(`/api/experiences/${id}`),
}

// ─── EDUCATION ───────────────────────────────────────────
export const educationService = {
  getAll:  ()           => API.get('/api/educations'),
  create:  (data)       => API.post('/api/educations', data),
  update:  (id, data)   => API.put(`/api/educations/${id}`, data),
  delete:  (id)         => API.delete(`/api/educations/${id}`),
}

// ─── PROJECTS ────────────────────────────────────────────
export const projectService = {
  getAll:  ()           => API.get('/api/projects'),
  getOne:  (id)         => API.get(`/api/projects/${id}`),
  create:  (data)       => API.post('/api/projects', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update:  (id, data)   => API.post(`/api/projects/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete:  (id)         => API.delete(`/api/projects/${id}`),
}

// ─── CONTACT ─────────────────────────────────────────────
export const contactService = {
  send:       (data)  => API.post('/api/contact', data),
  getAll:     ()      => API.get('/api/contacts'),
  markRead:   (id)    => API.put(`/api/contacts/${id}/read`),
  delete:     (id)    => API.delete(`/api/contacts/${id}`),
}