import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Droplets } from 'lucide-react'
import WeatherIcon, { getWeatherMeta } from './WeatherIcon'

const ease = [0.16, 1, 0.3, 1]

function buildDaily(list) {
  const days = {}
  for (const it of list) {
    const day = it.dt_txt.split(' ')[0]
    if (!days[day]) days[day] = { temps: [], pops: [], codes: [], dt_txt: it.dt_txt }
    days[day].temps.push(it.main.temp_max, it.main.temp_min)
    days[day].pops.push(it.pop || 0)
    days[day].codes.push(it.weather?.[0]?.id)
  }
  return Object.entries(days).slice(0, 5).map(([date, d]) => ({
    date,
    high: Math.round(Math.max(...d.temps)),
    low:  Math.round(Math.min(...d.temps)),
    pop:  Math.round(Math.max(...d.pops) * 100),
    code: d.codes
      .sort((a, b) => d.codes.filter(v => v === a).length - d.codes.filter(v => v === b).length)
      .pop(),
  }))
}

function dayLabel(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  if (d.toDateString() === new Date().toDateString()) return 'Today'
  return d.toLocaleDateString('en-US', { weekday: 'short' })
}

/* 3D tilt handler */
function useTilt(ref) {
  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const x = (e.clientX - left) / width  - 0.5
    const y = (e.clientY - top)  / height - 0.5
    el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 11}deg) scale3d(1.03,1.03,1.03)`
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }
  return { onMouseMove: onMove, onMouseLeave: onLeave }
}

function ForecastCard({ item, index }) {
  const ref  = useRef(null)
  const tilt = useTilt(ref)
  const { label } = getWeatherMeta(item.code)

  return (
    <motion.div
      ref={ref}
      className="f-card"
      data-hover
      initial={{ opacity: 0, y: 32, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.38 + index * 0.08, ease }}
      style={{ transition: 'border-color 0.18s, box-shadow 0.3s' }}
      {...tilt}
    >
      <span className="f-day">{dayLabel(item.date)}</span>

      <span className="f-icon-wrap">
        <WeatherIcon code={item.code} size={44} />
      </span>

      <span className="f-condition">{label}</span>

      <div className="f-temps">
        <span className="f-hi">{item.high}°</span>
        <span className="f-lo">{item.low}°</span>
      </div>

      {item.pop > 0 && (
        <div className="f-pop">
          <Droplets size={11} />
          {item.pop}%
        </div>
      )}
    </motion.div>
  )
}

export default function FiveDayForecast({ data }) {
  const daily = buildDaily(data.forecast.list)

  return (
    <motion.section
      className="forecast-wrap"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.38 }}
      aria-label="5-day forecast"
    >
      <p className="s-label">
        5-Day Forecast
        <span className="s-line" />
      </p>

      <div className="forecast-grid" role="list">
        {daily.map((item, i) => (
          <ForecastCard key={item.date} item={item} index={i} />
        ))}
      </div>
    </motion.section>
  )
}
