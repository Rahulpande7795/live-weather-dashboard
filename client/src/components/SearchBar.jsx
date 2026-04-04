import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, Loader2, X } from 'lucide-react'

export default function SearchBar({ onSearch, onLocate, locating }) {
  const [query, setQuery]   = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      onSearch(trimmed)
      setQuery('')
    }
  }

  const clear = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <motion.div
      className="search-outer"
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <form
        id="weather-search-form"
        className="search-form"
        onSubmit={handleSubmit}
        role="search"
        aria-label="Search for a city"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {/* Search icon */}
        <span className="search-icon-wrap">
          <Search size={17} strokeWidth={2.2} />
        </span>

        {/* Input */}
        <input
          ref={inputRef}
          id="city-search-input"
          className="search-input"
          type="text"
          value={query}
          placeholder="Search a city…"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-label="City name"
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Clear button */}
        {query && (
          <motion.button
            type="button"
            aria-label="Clear"
            onClick={clear}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--t3)',
              cursor: 'none',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              flexShrink: 0,
            }}
          >
            <X size={14} />
          </motion.button>
        )}

        <div className="search-divider" />

        {/* Locate button */}
        <motion.button
          type="button"
          id="locate-btn"
          className="btn-locate"
          onClick={onLocate}
          title="Use my location"
          aria-label="Use current location"
          whileTap={{ scale: 0.88 }}
          data-hover
        >
          {locating
            ? <Loader2 size={16} strokeWidth={2.2} className="spin-anim" />
            : <MapPin   size={16} strokeWidth={2.2} />}
        </motion.button>

        {/* Search button */}
        <motion.button
          type="submit"
          id="search-submit-btn"
          className="btn-search"
          disabled={!query.trim()}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          data-hover
        >
          Search
        </motion.button>
      </form>
    </motion.div>
  )
}
