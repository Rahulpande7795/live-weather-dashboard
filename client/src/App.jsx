import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Cloud } from 'lucide-react'

import Background      from './components/Background'
import ParticleCanvas  from './components/ParticleCanvas'
import CustomCursor    from './components/CustomCursor'
import NavBar          from './components/NavBar'
import SearchBar       from './components/SearchBar'
import WeatherHero     from './components/WeatherHero'
import HourlyForecast  from './components/HourlyForecast'
import FiveDayForecast from './components/FiveDayForecast'
import ExtraMetrics    from './components/ExtraMetrics'
import SkeletonLoader  from './components/SkeletonLoader'
import { useWeather }  from './hooks/useWeather'

const ease = [0.16, 1, 0.3, 1]

export default function App() {
  const { data, loading, error, locating, fetchByCity, locate } = useWeather()

  return (
    <>
      {/* Layered ambient background */}
      <Background />
      <ParticleCanvas />

      {/* Premium custom cursor */}
      <CustomCursor />

      <div className="app-shell">
        {/* Sticky top nav */}
        <NavBar />

        {/* Main scrollable content */}
        <main className="page-content">
          {/* ── Search ── */}
          <SearchBar
            onSearch={fetchByCity}
            onLocate={locate}
            locating={locating}
          />

          {/* ── Error toast ── */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="error-toast"
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.96 }}
                transition={{ duration: 0.35, ease }}
              >
                <AlertTriangle size={16} style={{ flexShrink: 0, color: '#ff5572' }} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Skeleton while loading ── */}
          {loading && <SkeletonLoader />}

          {/* ── Weather data ── */}
          <AnimatePresence mode="wait">
            {!loading && data && (
              <motion.div
                key={`${data.currentWeather?.name}-${data.currentWeather?.dt}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <WeatherHero     data={data} />
                <HourlyForecast  data={data} />
                <ExtraMetrics    data={data} />
                <FiveDayForecast data={data} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Welcome / empty state ── */}
          <AnimatePresence>
            {!loading && !data && !error && (
              <motion.div
                className="welcome"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.15, ease }}
              >
                <div className="welcome-orb">
                  <span className="welcome-emoji">🌤️</span>
                </div>

                <h2 className="welcome-title">Cosmos Weather</h2>

                <p className="welcome-sub">
                  Real-time weather intelligence — beautifully crafted.
                  Search any city on Earth or share your location.
                </p>

                <div className="welcome-pill">
                  <Cloud size={13} strokeWidth={2} />
                  Type a city above or click the pin to auto-locate
                </div>

                {/* Feature highlights */}
                <div className="welcome-feat-grid">
                  {[
                    { icon: '🕐', label: 'Live data' },
                    { icon: '📅', label: '5-day outlook' },
                    { icon: '📍', label: 'GPS locate' },
                  ].map(f => (
                    <div key={f.label} className="welcome-feat">
                      <span className="welcome-feat-icon">{f.icon}</span>
                      {f.label}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  )
}
