import { useEffect } from 'react'

const CursorGlow = () => {
  useEffect(() => {
    const el = document.getElementById('cursor-glow')
    if (!el) return
    const move = (e) => {
      el.style.left = e.clientX + 'px'
      el.style.top  = e.clientY + 'px'
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return <div id="cursor-glow" />
}

export default CursorGlow