'use client'

import { useEffect, useRef } from 'react'

export default function FallingDollars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    class Dollar {
      x: number
      y: number
      size: number
      speed: number
      opacity: number
      canvas: HTMLCanvasElement

      constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.x = Math.random() * this.canvas.width
        this.y = Math.random() * this.canvas.height - this.canvas.height
        this.size = Math.random() * 20 + 10
        this.speed = Math.random() * 2 + 1
        this.opacity = Math.random() * 0.5 + 0.3
      }

      update() {
        this.y += this.speed
        if (this.y > this.canvas.height) {
          this.y = -this.size
          this.x = Math.random() * this.canvas.width
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = `rgba(0, 255, 65, ${this.opacity})`
        ctx.font = `${this.size}px Arial`
        ctx.fillText('$', this.x, this.y)
      }
    }

    const dollars: Dollar[] = []
    for (let i = 0; i < 50; i++) {
      dollars.push(new Dollar(canvas))
    }

    let animationFrameId: number;

    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      dollars.forEach(dollar => {
        dollar.update()
        dollar.draw(ctx)
      })
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />
}