const Loader = ({ fullScreen = false, size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`
          ${sizes[size]}
          rounded-full
          border-primary-500/30
          border-t-primary-500
          animate-spin
        `}
      />
      {text && (
        <p className="text-gray-400 text-sm animate-pulse">{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-300 flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  )
}

export default Loader