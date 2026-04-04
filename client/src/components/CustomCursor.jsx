import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = -200, my = -200
    let rx = -200, ry = -200
    let raf

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      if (!visible) setVisible(true)
      dot.style.left = mx + 'px'
      dot.style.top  = my + 'px'
    }

    const smooth = () => {
      rx += (mx - rx) * 0.13
      ry += (my - ry) * 0.13
      ring.style.left = rx + 'px'
      ring.style.top  = ry + 'px'
      raf = requestAnimationFrame(smooth)
    }

    const addHover = (el) => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('hovered')
        ring.classList.add('hovered')
      })
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('hovered')
        ring.classList.remove('hovered')
      })
    }

    const onDown = () => dot.classList.add('clicking')
    const onUp   = () => dot.classList.remove('clicking')

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)

    const interactable = document.querySelectorAll('button, input, a, [data-hover]')
    interactable.forEach(addHover)

    // Re-query interactable on DOM changes
    const observer = new MutationObserver(() => {
      document.querySelectorAll('button, input, a, [data-hover]')
        .forEach(el => {
          if (!el._cursorBound) {
            el._cursorBound = true
            addHover(el)
          }
        })
    })
    observer.observe(document.body, { childList: true, subtree: true })

    raf = requestAnimationFrame(smooth)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup',   onUp)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ opacity: visible ? 1 : 0 }}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{ opacity: visible ? 1 : 0 }}
        aria-hidden="true"
      />
    </>
  )
}
