"use client"

import { useEffect, useRef, memo } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  targetOpacity: number
}

function NetworkBackgroundComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>(0)
  const isInitializedRef = useRef(false)

  useEffect(() => {
    // Eğer zaten başlatılmışsa, tekrar başlatma
    if (isInitializedRef.current) return
    isInitializedRef.current = true

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true }
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    // Initialize particles
    const initParticles = () => {
      // Mobil cihazlarda daha az parçacık kullan
      const isMobile = window.innerWidth < 768
      const particleCount = isMobile ? 75 : 150

      particlesRef.current = []

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2.5 + 1.5,
          opacity: 0,
          targetOpacity: 0,
        })
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mouseRadius = 200 // Area around mouse where particles are visible

      // Update and draw particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i]

        // Update position
        p.x += p.vx
        p.y += p.vy

        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // Calculate distance to mouse
        const dx = p.x - mouseRef.current.x
        const dy = p.y - mouseRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Set target opacity based on distance to mouse
        if (mouseRef.current.active && distance < mouseRadius) {
          p.targetOpacity = 1 - distance / mouseRadius
        } else {
          p.targetOpacity = 0
        }

        // Smoothly transition opacity
        p.opacity += (p.targetOpacity - p.opacity) * 0.1

        // Only draw if particle has some opacity
        if (p.opacity > 0.01) {
          // Draw particle
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(80, 110, 255, ${p.opacity * 0.7})`
          ctx.fill()

          // Connect particles that are close to each other and visible
          // Performans için sadece yakındaki parçacıkları kontrol et
          const checkDistance = 80
          for (let j = i + 1; j < particlesRef.current.length; j++) {
            const p2 = particlesRef.current[j]

            if (p2.opacity > 0.01) {
              const dx2 = p.x - p2.x
              const dy2 = p.y - p2.y

              // Hızlı mesafe kontrolü (karekök hesaplamadan)
              if (Math.abs(dx2) < checkDistance && Math.abs(dy2) < checkDistance) {
                const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)

                if (distance2 < checkDistance) {
                  ctx.beginPath()
                  ctx.moveTo(p.x, p.y)
                  ctx.lineTo(p2.x, p2.y)
                  const lineOpacity = Math.min(p.opacity, p2.opacity) * (1 - distance2 / 80) * 0.7
                  ctx.strokeStyle = `rgba(80, 110, 255, ${lineOpacity})`
                  ctx.lineWidth = 0.8
                  ctx.stroke()
                }
              }
            }
          }

          // React to mouse if very close
          if (distance < 60) {
            // Draw connection to mouse for closest particles
            if (distance < 40) {
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(mouseRef.current.x, mouseRef.current.y)
              ctx.strokeStyle = `rgba(80, 110, 255, ${p.opacity * 0.8})`
              ctx.lineWidth = 0.8
              ctx.stroke()
            }

            // Move particle away from mouse (subtle effect)
            const angle = Math.atan2(dy, dx)
            const force = (60 - distance) / 800
            p.vx += Math.cos(angle) * force
            p.vy += Math.sin(angle) * force

            // Limit velocity
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
            if (speed > 2) {
              p.vx = (p.vx / speed) * 2
              p.vy = (p.vy / speed) * 2
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Set up event listeners
    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    // Initialize
    handleResize()
    animate()

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />
}

// Gereksiz yeniden render'ları önlemek için memo kullanıyoruz
export const NetworkBackground = memo(NetworkBackgroundComponent)
