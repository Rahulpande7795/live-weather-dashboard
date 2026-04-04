import { motion } from 'framer-motion'
import { Sun, Wind, Droplets, Gauge } from 'lucide-react'

const ease = [0.16, 1, 0.3, 1]

/* Derive pseudo UV index from weather code & time of day */
function deriveUV(weatherCode, hour) {
  if (!weatherCode) return { value: 3, label: 'Moderate', color: '#ffb347' }
  const isDay = hour >= 6 && hour <= 18
  if (!isDay) return { value: 0, label: 'None', color: '#5ec5ff' }
  if (weatherCode >= 800 && weatherCode <= 801) return { value: 7, label: 'High', color: '#ff7a48' }
  if (weatherCode >= 802 && weatherCode <= 804) return { value: 3, label: 'Moderate', color: '#ffb347' }
  if (weatherCode >= 300 && weatherCode <= 531) return { value: 1, label: 'Low', color: '#40ffb0' }
  return { value: 3, label: 'Moderate', color: '#ffb347' }
}

function deriveAQI(humidity, windSpeed) {
  const score = Math.max(1, Math.min(5, Math.round(6 - windSpeed / 3)))
  const labels = ['Good', 'Good', 'Moderate', 'Unhealthy', 'Very Unhealthy', 'Hazardous']
  const colors = ['#40ffb0', '#40ffb0', '#ffcc44', '#ff7a48', '#ff4488', '#cc44ff']
  return { value: score, label: labels[score] ?? 'Good', color: colors[score] ?? '#40ffb0' }
}

function ProgressBar({ fill, color }) {
  return (
    <div className="prog-track">
      <motion.div
        className="prog-fill"
        initial={{ width: 0 }}
        animate={{ width: `${fill}%` }}
        transition={{ duration: 1.2, delay: 0.6, ease }}
        style={{ background: color }}
      />
    </div>
  )
}

export default function ExtraMetrics({ data }) {
  const w     = data.currentWeather
  const code  = w.weather?.[0]?.id
  const hour  = new Date().getHours()
  const uv    = deriveUV(code, hour)
  const aqi   = deriveAQI(w.main.humidity, w.wind?.speed ?? 3)

  const metrics = [
    {
      id: 'uv',
      icon: <Sun size={14} />,
      label: 'UV Index',
      value: uv.value,
      sub: uv.label,
      fill: (uv.value / 11) * 100,
      color: uv.color,
      unit: '',
    },
    {
      id: 'aqi',
      icon: <Wind size={14} />,
      label: 'Air Quality',
      value: aqi.value,
      sub: aqi.label,
      fill: ((6 - aqi.value) / 5) * 100,
      color: aqi.color,
      unit: '',
    },
    {
      id: 'humidity',
      icon: <Droplets size={14} />,
      label: 'Humidity',
      value: w.main.humidity,
      sub: w.main.humidity > 70 ? 'High' : w.main.humidity > 40 ? 'Comfortable' : 'Low',
      fill: w.main.humidity,
      color: '#5ec5ff',
      unit: '%',
    },
    {
      id: 'pressure',
      icon: <Gauge size={14} />,
      label: 'Pressure',
      value: w.main.pressure,
      sub: w.main.pressure > 1020 ? 'High pressure' : w.main.pressure < 1000 ? 'Low pressure' : 'Normal',
      fill: Math.min(100, ((w.main.pressure - 950) / 100) * 100),
      color: '#c4bfff',
      unit: ' hPa',
    },
  ]

  return (
    <motion.section
      className="extras-wrap"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5, ease }}
      aria-label="Extra weather metrics"
    >
      <p className="s-label">
        Conditions
        <span className="s-line" />
      </p>

      <div className="extras-grid">
        {metrics.map((m, i) => (
          <motion.div
            key={m.id}
            className="extra-card"
            data-hover
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.55 + i * 0.07, ease }}
          >
            <div className="extra-header">
              <span className="extra-icon">{m.icon}</span>
              {m.label}
            </div>

            <div>
              <div className="extra-value">
                {m.value}{m.unit}
              </div>
              <div className="extra-sub" style={{ color: m.color }}>{m.sub}</div>
            </div>

            <ProgressBar fill={m.fill} color={m.color} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}
