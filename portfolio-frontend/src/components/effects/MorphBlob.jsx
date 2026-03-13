const MorphBlob = ({
  color  = 'primary',
  size   = 'md',
  opacity = 0.15,
  className = '',
  delay  = '0s',
}) => {
  const sizes = { sm: 'w-48 h-48', md: 'w-72 h-72', lg: 'w-96 h-96', xl: 'w-[32rem] h-[32rem]' }
  const colors = {
    primary: 'bg-primary-500',
    cyan:    'bg-cyan-500',
    purple:  'bg-purple-500',
    pink:    'bg-pink-500',
  }

  return (
    <div
      className={`${sizes[size]} ${colors[color]} animate-morph blur-3xl ${className}`}
      style={{ opacity, animationDelay: delay, animationDuration: '12s' }}
    />
  )
}

export default MorphBlob