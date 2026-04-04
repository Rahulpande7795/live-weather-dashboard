import { motion } from 'framer-motion'
import {
  MapPin, Droplets, Wind, Thermometer, Eye, Gauge, Sunset,
} from 'lucide-react'
import WeatherIcon, { getWeatherMeta } from './WeatherIcon'

const ease = [0.16, 1, 0.3, 1]

const containerVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show:   { opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease } },
}

export default function WeatherHero({ data }) {
  const { currentWeather: w } = data
  const code  = w.weather?.[0]?.id
  const desc  = w.weather?.[0]?.description ?? ''
  const { label } = getWeatherMeta(code)

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const sunrise = w.sys?.sunrise
    ? new Date(w.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : null
  const sunset = w.sys?.sunset
    ? new Date(w.sys.sunset * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : null

  const chips = [
    { icon: <Thermometer size={13} />, label: 'FEELS LIKE', value: `${Math.round(w.main.feels_like)}°C` },
    { icon: <Droplets    size={13} />, label: 'HUMIDITY',   value: `${w.main.humidity}%` },
    { icon: <Wind        size={13} />, label: 'WIND',       value: `${Math.round(w.wind.speed)} m/s` },
    { icon: <Eye         size={13} />, label: 'VISIBILITY', value: w.visibility ? `${(w.visibility / 1000).toFixed(1)} km` : '—' },
    { icon: <Gauge       size={13} />, label: 'PRESSURE',   value: `${w.main.pressure} hPa` },
    ...(sunrise ? [{ icon: <Sunset size={13} />, label: 'SUNRISE', value: sunrise }] : []),
  ]

  return (
    <motion.section
      className="hero-wrap"
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease }}
    >
      <div className="hero-card" data-hover>
        {/* Decorative top line */}
        <div className="hero-glow-line" />
        <div className="hero-ambient" />

        <div className="hero-grid">
          {/* ── LEFT ── */}
          <div className="hero-left">
            <div className="hero-location-row">
              <MapPin size={12} />
              <span>{date}</span>
            </div>

            <h1 className="hero-city">{w.name}</h1>

            <div className="hero-country-row">
              <span>{w.sys?.country}</span>
              <div className="hero-dot" />
              <span style={{ color: 'var(--t4)' }}>
                {w.coord?.lat?.toFixed(2)}° N, {w.coord?.lon?.toFixed(2)}° E
              </span>
            </div>

            <div className="hero-condition">
              <span className="condition-badge">
                <WeatherIcon code={code} size={15} />
                {label}
              </span>
              {desc && (
                <span style={{ fontSize: '14px', color: 'var(--t3)', textTransform: 'capitalize' }}>
                  — {desc}
                </span>
              )}
            </div>

            {/* Stat chips */}
            <motion.div
              className="stat-chips"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {chips.map((c, i) => (
                <motion.div
                  key={i}
                  className="chip"
                  variants={itemVariants}
                  data-hover
                >
                  <span className="chip-icon">{c.icon}</span>
                  <span className="chip-body">
                    <span className="chip-label">{c.label}</span>
                    <span className="chip-val">{c.value}</span>
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT ── */}
          <div className="hero-right">
            <motion.div
              className="hero-icon-wrap"
              initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <WeatherIcon code={code} size={88} />
            </motion.div>

            <motion.div
              className="temp-display"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
            >
              <span className="temp-value">{Math.round(w.main.temp)}</span>
              <span className="temp-unit">°C</span>
            </motion.div>

            <motion.div
              className="temp-range"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <span className="temp-hi">H: {Math.round(w.main.temp_max)}°</span>
              <span className="temp-lo">L: {Math.round(w.main.temp_min)}°</span>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
