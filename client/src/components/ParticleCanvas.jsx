import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 55

function randomBetween(a, b) { return a + Math.random() * (b - a) }

function createParticle(w, h) {
  return {
    x:     Math.random() * w,
    y:     Math.random() * h,
    size:  randomBetween(0.8, 2.4),
    speedX: randomBetween(-0.12, 0.12),
    speedY: randomBetween(-0.25, -0.08),
    alpha:  randomBetween(0.15, 0.55),
    color:  Math.random() > 0.6
              ? `rgba(124,108,255,`
              : Math.random() > 0.4
                ? `rgba(0,212,255,`
                : `rgba(64,255,176,`,
  }
}

export default function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = window.innerWidth
    let h = window.innerHeight
    canvas.width  = w
    canvas.height = h

    let particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(w, h))
    let mouseX = w / 2, mouseY = h / 2
    let raf

    const onResize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width  = w
      canvas.height = h
    }

    const onMouse = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)

      particles.forEach(p => {
        // gentle parallax pull toward cursor
        const dx = (mouseX - w / 2) * 0.00006
        const dy = (mouseY - h / 2) * 0.00006
        p.x += p.speedX + dx
        p.y += p.speedY + dy

        // reset when leaves screen
        if (p.y < -10 || p.x < -10 || p.x > w + 10) {
          Object.assign(p, createParticle(w, h))
          p.y = h + 5
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${p.alpha})`
        ctx.fill()

        // glow for larger particles
        if (p.size > 1.8) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
          ctx.fillStyle = `${p.color}${p.alpha * 0.12})`
          ctx.fill()
        }
      })

      raf = requestAnimationFrame(draw)
    }

    draw()
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMouse)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return <canvas ref={canvasRef} className="particles-canvas" aria-hidden="true" />
}
