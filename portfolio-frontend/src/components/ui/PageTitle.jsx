const PageTitle = ({ title, subtitle, center = false }) => {
  return (
    <div className={`mb-10 ${center ? 'text-center' : ''}`}>
      <div className="flex items-center gap-3 mb-2">
        {!center && (
          <div className="w-1 h-8 bg-gradient-to-b from-primary-400 to-primary-600 rounded-full" />
        )}
        <h1 className="section-title">{title}</h1>
      </div>
      {subtitle && (
        <p className={`text-gray-400 text-lg ${center ? '' : 'ml-4'}`}>
          {subtitle}
        </p>
      )}
      {center && (
        <div className="flex items-center justify-center mt-4 gap-2">
          <div className="w-12 h-0.5 bg-primary-500/50 rounded" />
          <div className="w-3 h-3 bg-primary-500 rounded-full" />
          <div className="w-12 h-0.5 bg-primary-500/50 rounded" />
        </div>
      )}
    </div>
  )
}

export default PageTitle