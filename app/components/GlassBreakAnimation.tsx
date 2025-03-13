'use client'

import { useEffect, useRef } from 'react'

export default function GlassBreakAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let cracks: { x: number; y: number; angle: number; length: number }[] = []

    function drawCracks() {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = '#00ff41'
      ctx.lineWidth = 2

      cracks.forEach(crack => {
        ctx.beginPath()
        ctx.moveTo(crack.x, crack.y)
        const endX = crack.x + Math.cos(crack.angle) * crack.length
        const endY = crack.y + Math.sin(crack.angle) * crack.length
        ctx.lineTo(endX, endY)
        ctx.stroke()
      })
    }

    function addCrack(x: number, y: number) {
      if (!canvas) return;

      const numBranches = Math.floor(Math.random() * 3) + 3
      for (let i = 0; i < numBranches; i++) {
        cracks.push({
          x,
          y,
          angle: (Math.PI * 2 * i) / numBranches + Math.random() * 0.5,
          length: Math.random() * 50 + 20
        })
      }
      drawCracks()
    }

    function handleClick(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      addCrack(x, y)
    }

    canvas.addEventListener('click', handleClick)

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawCracks()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      canvas.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none" />
}