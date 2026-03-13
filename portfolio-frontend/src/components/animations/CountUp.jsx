import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

const CountUp = ({ end, duration = 1800, suffix = '', prefix = '', className = '' }) => {
  const [count, setCount] = useState(0)
  const [ref, inView]     = useInView({ triggerOnce: true, threshold: 0.3 })

  useEffect(() => {
    if (!inView) return
    let startTime
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // Ease out
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(ease * end))
      if (progress < 1) requestAnimationFrame(step)
      else setCount(end)
    }
    requestAnimationFrame(step)
  }, [inView, end, duration])

  return (
    <span ref={ref} className={`font-black tabular-nums ${className}`}>
      {prefix}{count}{suffix}
    </span>
  )
}

export default CountUp