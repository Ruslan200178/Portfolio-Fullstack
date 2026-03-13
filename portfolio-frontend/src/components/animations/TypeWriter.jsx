import { useState, useEffect } from 'react'

const TypeWriter = ({
  words    = ['Developer', 'Designer', 'Creator'],
  speed    = 100,
  deleteSpeed = 55,
  pauseTime   = 1800,
  className   = '',
}) => {
  const [text,     setText]     = useState('')
  const [wordIdx,  setWordIdx]  = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [showCursor, setShowCursor] = useState(true)

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setShowCursor(p => !p), 530)
    return () => clearInterval(id)
  }, [])

  // Typing logic
  useEffect(() => {
    const current = words[wordIdx]

    if (isTyping) {
      if (text.length < current.length) {
        const id = setTimeout(() => setText(current.slice(0, text.length + 1)), speed)
        return () => clearTimeout(id)
      } else {
        const id = setTimeout(() => setIsTyping(false), pauseTime)
        return () => clearTimeout(id)
      }
    } else {
      if (text.length > 0) {
        const id = setTimeout(() => setText(text.slice(0, -1)), deleteSpeed)
        return () => clearTimeout(id)
      } else {
        setWordIdx(i => (i + 1) % words.length)
        setIsTyping(true)
      }
    }
  }, [text, isTyping, wordIdx, words, speed, deleteSpeed, pauseTime])

  return (
    <span className={`font-bold gradient-text ${className}`}>
      {text}
      <span className={`inline-block w-0.5 h-[1em] ml-0.5 align-middle bg-primary-400 transition-opacity duration-100 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
    </span>
  )
}

export default TypeWriter