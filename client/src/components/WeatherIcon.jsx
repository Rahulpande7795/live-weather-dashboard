// Maps OpenWeatherMap condition codes → emoji + label + theme color
const CODE_MAP = [
  { min: 200, max: 232, icon: '⛈️',  label: 'Thunderstorm', color: '#7c6cff' },
  { min: 300, max: 321, icon: '🌦️',  label: 'Drizzle',      color: '#5ec5ff' },
  { min: 500, max: 531, icon: '🌧️',  label: 'Rain',         color: '#4b9fff' },
  { min: 600, max: 622, icon: '❄️',   label: 'Snow',         color: '#b3e8ff' },
  { min: 700, max: 781, icon: '🌫️',  label: 'Mist / Fog',   color: '#9faab5' },
  { min: 800, max: 800, icon: '☀️',   label: 'Clear Sky',    color: '#ffcc44' },
  { min: 801, max: 801, icon: '🌤️',  label: 'Few Clouds',   color: '#ffd88a' },
  { min: 802, max: 802, icon: '⛅',   label: 'Partly Cloudy', color: '#96c8e8' },
  { min: 803, max: 804, icon: '☁️',   label: 'Overcast',     color: '#7a8fa0' },
]

function resolve(code) {
  if (!code) return { icon: '🌡️', label: 'Weather', color: '#7c6cff' }
  return CODE_MAP.find(r => code >= r.min && code <= r.max)
    ?? { icon: '🌡️', label: 'Weather', color: '#7c6cff' }
}

export function getWeatherMeta(code) { return resolve(code) }

export default function WeatherIcon({ code, size = 40 }) {
  const { icon, label } = resolve(code)
  return (
    <span
      role="img"
      aria-label={label}
      style={{ fontSize: size, lineHeight: 1, display: 'inline-block' }}
    >
      {icon}
    </span>
  )
}
