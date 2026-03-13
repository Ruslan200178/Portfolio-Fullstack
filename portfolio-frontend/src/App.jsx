import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'   // ← this import
import { useEffect, useState } from 'react'

import ProtectedRoute from './routes/ProtectedRoute'
import PublicRoutes   from './routes/PublicRoutes'
import Layout         from './components/layout/Layout'
import AdminLayout    from './components/admin/AdminLayout'

import Home       from './pages/public/Home'
import About      from './pages/public/About'
import Skills     from './pages/public/Skills'
import Experience from './pages/public/Experience'
import Education  from './pages/public/Education'
import Projects   from './pages/public/Projects'
import Contact    from './pages/public/Contact'

import Login            from './pages/admin/Login'
import Dashboard        from './pages/admin/Dashboard'
import ManageAbout      from './pages/admin/ManageAbout'
import ManageSkills     from './pages/admin/ManageSkills'
import ManageExperience from './pages/admin/ManageExperience'
import ManageEducation  from './pages/admin/ManageEducation'
import ManageProjects   from './pages/admin/ManageProjects'
import ManageMessages   from './pages/admin/ManageMessages'

// Page load progress bar
const PageLoadBar = () => {
  const location         = useLocation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 1400)
    return () => clearTimeout(t)
  }, [location])

  return visible ? <div className="page-load-bar" /> : null
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>        {/* ← wraps everything */}
        <Toaster position="top-right" toastOptions={{
          duration: 3000,
          style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', fontSize: '14px' },
          success: { iconTheme: { primary: '#0ea5e9', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }} />

        <Routes>
          {/* Public */}
          <Route element={<Layout />}>
            <Route path="/"           element={<Home />}       />
            <Route path="/about"      element={<About />}      />
            <Route path="/skills"     element={<Skills />}     />
            <Route path="/experience" element={<Experience />} />
            <Route path="/education"  element={<Education />}  />
            <Route path="/projects"   element={<Projects />}   />
            <Route path="/contact"    element={<Contact />}    />
          </Route>

          {/* Admin login */}
          <Route element={<PublicRoutes />}>
            <Route path="/admin/login" element={<Login />} />
          </Route>

          {/* Protected admin */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard"   element={<Dashboard />}        />
              <Route path="/admin/about"       element={<ManageAbout />}      />
              <Route path="/admin/skills"      element={<ManageSkills />}     />
              <Route path="/admin/experience"  element={<ManageExperience />} />
              <Route path="/admin/education"   element={<ManageEducation />}  />
              <Route path="/admin/projects"    element={<ManageProjects />}   />
              <Route path="/admin/messages"    element={<ManageMessages />}   />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}



export default App