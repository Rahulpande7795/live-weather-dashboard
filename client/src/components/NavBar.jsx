import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function NavBar() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const fmt = time.toLocaleTimeString('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  const dateFmt = time.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })

  return (
    <motion.nav
      className="top-nav"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="nav-brand">
        <span className="nav-brand-icon">🌌</span>
        Cosmos Weather
      </div>

      <div className="nav-time">
        <span>{dateFmt} &nbsp;·&nbsp; {fmt}</span>
      </div>
    </motion.nav>
  )
}
