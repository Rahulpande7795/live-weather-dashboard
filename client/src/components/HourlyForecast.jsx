import { motion } from 'framer-motion'
import { Droplets } from 'lucide-react'
import WeatherIcon from './WeatherIcon'

function fmt12h(dtTxt) {
  const d = new Date(dtTxt)
  const h = d.getHours()
  return `${h % 12 || 12}${h >= 12 ? 'PM' : 'AM'}`
}

function isNow(dtTxt) {
  return new Date(dtTxt).getHours() === new Date().getHours()
}

const ease = [0.16, 1, 0.3, 1]

export default function HourlyForecast({ data }) {
  // Take next 12 slots (3-hr intervals = 36 hours)
  const items = data.forecast.list.slice(0, 12)

  return (
    <motion.section
      className="hourly-wrap"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25, ease }}
      aria-label="Hourly forecast"
    >
      <p className="s-label">
        Hourly Forecast
        <span className="s-line" />
      </p>

      <div className="hourly-scroll" role="list">
        {items.map((item, i) => {
          const code   = item.weather?.[0]?.id
          const pop    = item.pop ? Math.round(item.pop * 100) : 0
          const active = isNow(item.dt_txt)

          return (
            <motion.div
              key={item.dt}
              role="listitem"
              className={`h-card${active ? ' now' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.28 + i * 0.04, ease }}
              whileHover={{ y: -8, transition: { duration: 0.25, ease } }}
            >
              <span className="h-time">{active ? 'NOW' : fmt12h(item.dt_txt)}</span>
              <span className="h-icon">
                <WeatherIcon code={code} size={28} />
              </span>
              <span className="h-temp">{Math.round(item.main.temp)}°</span>
              {pop > 0 && (
                <span className="h-pop">
                  <Droplets size={9} />
                  {pop}%
                </span>
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}
