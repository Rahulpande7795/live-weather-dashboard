export default function SkeletonLoader() {
  return (
    <div aria-busy="true" aria-label="Loading weather data">
      {/* Hero */}
      <div className="skel skel-hero" />

      {/* Hourly */}
      <div className="skel skel-hourly" />

      {/* Extra metrics */}
      <div className="skel-extras-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skel skel-extra" />
        ))}
      </div>

      {/* 5-day grid */}
      <div className="skel-grid">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skel skel-cell" />
        ))}
      </div>
    </div>
  )
}
