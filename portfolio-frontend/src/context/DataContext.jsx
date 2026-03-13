import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import {
  skillService, projectService, experienceService,
  educationService, contactService, aboutService,
} from '../api/services'

// ── In-memory cache ───────────────────────────────────────
const CACHE_TTL = 5 * 60 * 1000  // 5 minutes
const cache     = {}
const inflight  = {}

const isFresh = (key) => cache[key] && (Date.now() - cache[key].ts) < CACHE_TTL

const DataContext = createContext(null)

export const DataProvider = ({ children }) => {
  const [loadingMap, setLoadingMap] = useState({})

  const setLoading = (key, val) =>
    setLoadingMap(p => ({ ...p, [key]: val }))

  // Fetch with cache — only one request at a time per key
  const fetchKey = useCallback(async (key, fetcher, force = false) => {
    if (!force && isFresh(key)) return cache[key].data
    if (inflight[key])          return inflight[key]

    setLoading(key, true)

    inflight[key] = fetcher()
      .then(r => {
        const raw  = r?.data?.data ?? r?.data ?? []
        cache[key] = { data: raw, ts: Date.now() }
        return raw
      })
      .catch(err => {
        console.error(`[DataContext] "${key}" failed:`, err?.response?.data || err.message)
        return key === 'about' ? null : []
      })
      .finally(() => {
        setLoading(key, false)
        delete inflight[key]
      })

    return inflight[key]
  }, [])

  const invalidate = useCallback((key) => { delete cache[key] }, [])

  // Prefetch all public data when app first loads
  useEffect(() => {
    fetchKey('about',       () => aboutService.get())
    fetchKey('skills',      () => skillService.getAll())
    fetchKey('experiences', () => experienceService.getAll())
    fetchKey('educations',  () => educationService.getAll())
    fetchKey('projects',    () => projectService.getAll())
  }, [])

  // Typed getters
  const getAbout       = (force) => fetchKey('about',       () => aboutService.get(),        force)
  const getSkills      = (force) => fetchKey('skills',      () => skillService.getAll(),      force)
  const getExperiences = (force) => fetchKey('experiences', () => experienceService.getAll(), force)
  const getEducations  = (force) => fetchKey('educations',  () => educationService.getAll(),  force)
  const getProjects    = (force) => fetchKey('projects',    () => projectService.getAll(),    force)
  const getContacts    = (force) => fetchKey('contacts',    () => contactService.getAll(),    force)

  return (
    <DataContext.Provider value={{
      loadingMap,
      getAbout, getSkills, getExperiences,
      getEducations, getProjects, getContacts,
      invalidate,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}

export default DataContext