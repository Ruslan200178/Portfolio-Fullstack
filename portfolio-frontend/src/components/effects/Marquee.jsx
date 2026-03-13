const Marquee = ({ items = [], speed = 25, className = '' }) => {
  const doubled = [...items, ...items]
  return (
    <div className={`overflow-hidden py-3 ${className}`}>
      <div
        className="marquee-track"
        style={{ animationDuration: `${speed}s` }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-4 mx-6 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            <span className="text-gray-500 text-sm font-medium uppercase tracking-widest whitespace-nowrap">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Marquee