'use client'

import React, { useEffect, useRef } from 'react'

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (typeof (window as any).debugEnabled === 'undefined') {
      (window as any).debugEnabled = true
    }

    const config = {
      canvas: null as HTMLCanvasElement | null,
      context: null as CanvasRenderingContext2D | null,
      width: window.innerWidth,
      height: window.innerHeight,
      fontSize: 36,
      symbols: [] as Symbol[],
      maxSymbols: 1000,
      centerX: window.innerWidth / 2,
      centerY: window.innerHeight / 2,
      tunnel: {
        depth: 6000,
        radius: Math.min(window.innerWidth, window.innerHeight) * 0.8,
        rotationSpeed: 0,
        symbolCount: 500,
        minZ: -2000
      },
      characters: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 
                  'ｱ', 'ｲ', 'ｳ', 'ｴ', 'ｵ', 'カ', 'キ', 'ク', 'ケ', 'コ',
                  'サ', 'シ', 'ス', 'セ', 'ソ', 'タ', 'チ', 'ツ', 'テ', 'ト'],
      animation: {
        speed: 15
      },
      prerender: {
        radius: Math.min(window.innerWidth, window.innerHeight) * 0.3,
        duration: 1000
      },
      trail: {
        length: 25,
        fadeSpeed: 0.02,
        glowSize: 4,
        maxTrails: 50
      }
    }

    const perspective = 1000
    const TWO_PI = Math.PI * 2
    const fontCache = new Map()

    class Symbol {
      row: number
      initialAngle: number
      z: number
      angle: number
      value: string
      opacity: number
      x: number
      y: number
      minZ: number
      lastUpdate: number

      constructor(initialAngle: number, row: number) {
        this.row = row
        this.initialAngle = initialAngle
        this.z = config.tunnel.depth * (Math.random() * 0.8 + 0.2)
        this.angle = this.initialAngle
        this.value = config.characters[Math.floor(Math.random() * config.characters.length)]
        this.opacity = 0.3 + Math.random() * 0.7
        this.x = 0
        this.y = 0
        this.updatePosition()
        this.minZ = -1000
        this.lastUpdate = performance.now()
      }

      updatePosition() {
        const r = config.tunnel.radius * 1.2
        const cos = Math.cos(this.initialAngle)
        const sin = Math.sin(this.initialAngle)
        this.x = cos * r
        this.y = sin * r
      }

      update() {
        const now = performance.now()
        const deltaTime = (now - this.lastUpdate) / 16.67
        this.lastUpdate = now
        
        this.z -= config.animation.speed * deltaTime
        
        const scale = perspective / (perspective + this.z)
        const x = config.centerX + (this.x * scale)
        const y = config.centerY + (this.y * scale)
        
        const size = Math.round(Math.max(8, config.fontSize * scale))
        
        const isCompletelyOutOfView = 
            x < -size * 2 || 
            x > config.width + size * 2 || 
            y < -size * 2 || 
            y > config.height + size * 2 ||
            this.z < this.minZ

        if (isCompletelyOutOfView) {
          this.z = config.tunnel.depth
          this.reset()
        }

        this.updatePosition()
      }

      reset() {
        this.angle = this.initialAngle
        this.value = config.characters[Math.floor(Math.random() * config.characters.length)]
        this.opacity = 0.3 + Math.random() * 0.7
        this.z = config.tunnel.depth * (Math.random() * 0.8 + 0.2)
        this.updatePosition()
      }

      draw(ctx: CanvasRenderingContext2D) {
        const scale = perspective / (perspective + this.z)
        const x = config.centerX + (this.x * scale)
        const y = config.centerY + (this.y * scale)
        
        if (x < 0 || x > config.width || y < 0 || y > config.height) return

        const size = Math.round(Math.max(8, config.fontSize * scale))
        const fontString = `${size}px monospace`
        
        if (!fontCache.has(size)) {
          fontCache.set(size, fontString)
        }
        ctx.font = fontCache.get(size)

        const distanceFactor = 1 - (this.z / config.tunnel.depth)
        const alpha = Math.min(1, distanceFactor * 2) * this.opacity

        ctx.fillStyle = `rgba(0,255,0,${alpha})`
        ctx.shadowBlur = 2
        ctx.fillText(this.value, x, y)
      }
    }

    let offscreenCanvas: HTMLCanvasElement | OffscreenCanvas
    let offscreenContext: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D

    function initCanvas() {
      config.canvas = canvasRef.current
      if (!config.canvas) {
        console.error('Canvas element not found')
        return false
      }
      
      config.canvas.width = config.width
      config.canvas.height = config.height
      
      const contextOptions = {
        alpha: false,
        antialias: false,
        desynchronized: true
      }
      
      config.context = config.canvas.getContext('2d', contextOptions) as CanvasRenderingContext2D | null
      
      try {
        offscreenCanvas = new OffscreenCanvas(config.width, config.height)
        offscreenContext = offscreenCanvas.getContext('2d', contextOptions) as OffscreenCanvasRenderingContext2D
      } catch (e) {
        offscreenCanvas = document.createElement('canvas')
        offscreenCanvas.width = config.width
        offscreenCanvas.height = config.height
        offscreenContext = offscreenCanvas.getContext('2d', contextOptions) as CanvasRenderingContext2D
      }
      
      config.centerX = config.width / 2
      config.centerY = config.height / 2
      
      ;[config.context, offscreenContext].forEach(ctx => {
        if (ctx) {
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.shadowColor = 'rgba(0,255,0,0.5)'
        }
      })
      
      return true
    }

    function initSymbols() {
      config.symbols = new Array(config.tunnel.symbolCount)
      const angleStep = TWO_PI / config.tunnel.symbolCount
      
      for (let i = 0; i < config.tunnel.symbolCount; i++) {
        config.symbols[i] = new Symbol(i * angleStep, i)
      }
    }

    class CenterRain {
      static groupProperties: any[] = []
      static activeGroups = new Set<number>()

      index: number
      total: number
      groupSize: number
      groupIndex: number
      positionInGroup: number
      minZ: number
      zoomSpeed: number
      state: string
      waitTime: number
      startTime: number
      prerenderProgress: number
      lineFormed: boolean
      trail: any[]
      moveSpeed: number
      prerenderSpeed: number
      lastUpdate: number
      startX: number
      startY: number
      midX: number
      midY: number
      targetX: number
      targetY: number
      currentX: number
      currentY: number
      drawX: number
      drawY: number
      lastX!: number | null
      lastY!: number | null
      opacity!: number
      value!: string
      x!: number
      y!: number
      z!: number
      phase!: string

      constructor(index: number, total: number) {
        this.index = index
        this.total = total
        this.groupSize = 5
        this.groupIndex = Math.floor(index / this.groupSize)
        this.positionInGroup = index % this.groupSize
        this.minZ = -2000
        this.zoomSpeed = config.animation.speed * 2
        this.state = 'waiting'
        this.waitTime = Math.random() * 2000
        this.startTime = performance.now()
        this.prerenderProgress = 0
        this.lineFormed = false
        this.trail = []
        this.moveSpeed = 0.05
        this.prerenderSpeed = 0.05
        this.lastUpdate = performance.now()
        this.startX = 0
        this.startY = 0
        this.midX = 0
        this.midY = 0
        this.targetX = 0
        this.targetY = 0
        this.currentX = 0
        this.currentY = 0
        this.drawX = 0
        this.drawY = 0
        this.reset()
      }

      static resetAllGroups() {
        CenterRain.groupProperties = []
        CenterRain.activeGroups.clear()
        
        rainDrops.forEach(drop => {
          if (drop.positionInGroup === 0) {
            drop.initGroupProperties()
          }
        })

        rainDrops.forEach(drop => {
          drop.reset()
        })
      }

      initGroupProperties() {
        const angle = Math.random() * TWO_PI
        const startRadius = config.tunnel.radius * 0.6
        const targetRadius = config.prerender.radius * 0.2
        
        const startPoint = {
          x: config.centerX + Math.cos(angle) * startRadius,
          y: config.centerY + Math.sin(angle) * startRadius
        }
        
        const targetPoint = {
          x: config.centerX + Math.cos(angle) * targetRadius,
          y: config.centerY + Math.sin(angle) * targetRadius
        }
        
        CenterRain.groupProperties[this.groupIndex] = {
          startPoint,
          targetPoint,
          lineCenter: targetPoint,
          startTime: performance.now(),
          formationPhase: false,
          moveProgress: 0,
          zoomStarted: false,
          symbolsInPlace: 0,
          lineComplete: false,
          zoomDelay: false,
          active: true,
          angle: angle
        }
        
        CenterRain.activeGroups.add(this.groupIndex)
      }

      calculateFinalLinePosition() {
        const groupProps = CenterRain.groupProperties[this.groupIndex]
        return groupProps.targetPoint
      }

      calculateLinePosition() {
        const groupProps = CenterRain.groupProperties[this.groupIndex]
        const verticalSpacing = 30
        const lineHeight = verticalSpacing * (this.groupSize - 1)
        
        const finalPos = this.calculateFinalLinePosition()
        
        const startY = finalPos.y - lineHeight / 2
        
        return {
          centerX: finalPos.x,
          centerY: startY + (lineHeight / 2),
          myY: startY + (this.positionInGroup * verticalSpacing)
        }
      }

      reset() {
        if (this.positionInGroup === 0) {
          CenterRain.groupProperties[this.groupIndex] = null
          CenterRain.activeGroups.delete(this.groupIndex)
          this.initGroupProperties()
        }

        const groupProps = CenterRain.groupProperties[this.groupIndex]
        if (!groupProps) return

        this.state = 'waiting'
        this.startTime = performance.now()
        this.waitTime = Math.random() * 500 + this.positionInGroup * 100
        this.prerenderProgress = 0
        this.lineFormed = false
        this.phase = 'toCenter'
        this.z = config.tunnel.depth
        this.trail = []
        this.lastUpdate = performance.now()
        
        this.startX = groupProps.startPoint.x
        this.startY = groupProps.startPoint.y
        this.midX = groupProps.targetPoint.x
        this.midY = groupProps.targetPoint.y
        
        const finalPos = this.calculateFinalPosition()
        this.targetX = finalPos.x
        this.targetY = finalPos.y
        
        this.currentX = this.startX
        this.currentY = this.startY
        this.drawX = this.startX
        this.drawY = this.startY
        
        this.lastX = null
        this.lastY = null
        this.opacity = 1
        this.value = config.characters[Math.floor(Math.random() * config.characters.length)]
      }

      calculateFinalPosition() {
        const groupProps = CenterRain.groupProperties[this.groupIndex]
        const verticalSpacing = 30
        const lineHeight = verticalSpacing * (this.groupSize - 1)
        const startY = groupProps.lineCenter.y - lineHeight / 2
        
        return {
          x: groupProps.lineCenter.x,
          y: startY + (this.positionInGroup * verticalSpacing)
        }
      }

      update() {
        const now = performance.now()
        const deltaTime = (now - this.lastUpdate) / 16.67
        this.lastUpdate = now

        if (!CenterRain.groupProperties[this.groupIndex]) {
          if (this.positionInGroup === 0) {
            this.initGroupProperties()
          } else {
            return
          }
        }

        const groupProps = CenterRain.groupProperties[this.groupIndex]
        
        if (!groupProps || !groupProps.active) {
          this.reset()
          return
        }

        if (this.state === 'waiting') {
          if (now - this.startTime > this.waitTime) {
            this.state = 'prerender'
            this.phase = 'toCenter'
            this.prerenderProgress = 0
          }
        } else if (this.state === 'prerender') {
          this.prerenderProgress += this.prerenderSpeed * deltaTime
          
          if (this.prerenderProgress >= 1) {
            this.state = 'formation'
            groupProps.formationPhase = true
            groupProps.moveProgress = 0
          } else {
            this.updatePrerender(deltaTime)
          }
        } else if (groupProps.formationPhase) {
          this.updateFormation(groupProps, deltaTime)
        } else if (groupProps.zoomStarted) {
          this.updateZoom(deltaTime)
        }

        if (this.hasMovedSignificantly()) {
          this.updateTrail()
        }
      }

      updatePrerender(deltaTime: number) {
        const easeProgress =   this.prerenderProgress
        
        if (this.phase === 'toCenter') {
          this.currentX = this.startX + (this.midX - this.startX) * easeProgress
          this.currentY = this.startY + (this.midY - this.startY) * easeProgress
          
          if (easeProgress > 0.95) {
            this.phase = 'toPosition'
            this.startX = this.midX
            this.startY = this.midY
            this.prerenderProgress = 0
          }
        } else {
          this.currentX = this.startX + (this.targetX - this.startX) * easeProgress
          this.currentY = this.startY + (this.targetY - this.startY) * easeProgress
        }
      }

      updateFormation(groupProps: any, deltaTime: number) {
        groupProps.moveProgress = Math.min(1, groupProps.moveProgress + this.moveSpeed * deltaTime)
        
        const easeProgress = groupProps.moveProgress
        
        this.currentX = this.x + (this.targetX - this.x) * easeProgress
        this.currentY = this.y + (this.targetY - this.y) * easeProgress

        if (!this.lineFormed && easeProgress > 0.95) {
          this.lineFormed = true
          groupProps.symbolsInPlace++
        }

        if (groupProps.symbolsInPlace >= this.groupSize && !groupProps.lineComplete) {
          this.completeFormation(groupProps)
        }
      }

      updateZoom(deltaTime: number) {
        this.z -= this.zoomSpeed * deltaTime
        
        if (this.z < this.minZ) {
          if (this.positionInGroup === 0) {
            const groupProps = CenterRain.groupProperties[this.groupIndex]
            if (groupProps) {
              groupProps.active = false
            }
          }
          return true
        }

        const scale = perspective / (perspective + this.z)
        this.drawX = config.centerX + (this.targetX - config.centerX) * scale
        this.drawY = config.centerY + (this.targetY - config.centerY) * scale
        return false
      }

      completeFormation(groupProps: any) {
        groupProps.lineComplete = true
        if (!groupProps.zoomDelay) {
          groupProps.zoomDelay = true
          setTimeout(() => {
            if (groupProps.active) {
              groupProps.formationPhase = false
              groupProps.zoomStarted = true
              groupProps.symbolsInPlace = 0
              groupProps.lineComplete = false
              groupProps.zoomDelay = false
              this.z = config.tunnel.depth
            }
          }, 100)
        }
      }

      hasMovedSignificantly() {
        return !this.lastX || !this.lastY || 
               Math.abs(this.currentX - this.lastX) > 1 || 
               Math.abs(this.currentY - this.lastY) > 1
      }

      updateTrail() {
        if (!this.lineFormed) {
          const currentX = this.state === 'prerender' ? this.currentX : this.drawX
          const currentY = this.state === 'prerender' ? this.currentY : this.drawY
          
          const moveThreshold = 2
          
          const lastPoint = this.trail[0]
          if (!lastPoint || 
              Math.abs(currentX - lastPoint.x) > moveThreshold || 
              Math.abs(currentY - lastPoint.y) > moveThreshold) {
            
            this.trail.unshift({
              x: currentX,
              y: currentY,
              alpha: 1
            })
            
            while (this.trail.length > Math.min(config.trail.length, 15)) {
              this.trail.pop()
            }
          }
          
          for (let i = 0; i < this.trail.length; i++) {
            this.trail[i].alpha = 1 - (i / this.trail.length)
          }
        } else {
          this.trail = []
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.trail.length > 0) {
          ctx.save()
          ctx.globalCompositeOperation = 'screen'
          
          this.trail.forEach((segment, index) => {
            if (!isFinite(segment.x) || !isFinite(segment.y)) return
            
            const alpha = segment.alpha * 0.2
            const currentGlowSize = config.trail.glowSize * (1 - index / this.trail.length)
            
            try {
              const gradient = ctx.createRadialGradient(
                segment.x, segment.y, 0,
                segment.x, segment.y, currentGlowSize
              )
              
              gradient.addColorStop(0, `rgba(0,255,0,${alpha})`)
              gradient.addColorStop(0.5, `rgba(0,255,0,${alpha * 0.3})`)
              gradient.addColorStop(1, `rgba(0,255,0,0)`)
              
              ctx.fillStyle = gradient
              ctx.beginPath()
              ctx.arc(segment.x, segment.y, currentGlowSize, 0, TWO_PI)
              ctx.fill()
            } catch (e) {
              console.error(`CenterRain [Index: ${this.index}] Gradient Error:`, e)
            }
          })
          
          ctx.restore()
        }

        const scale = (perspective * 1.5) / (perspective + this.z)
        const size = Math.round(18 * scale)
        
        if (scale > 10 || !isFinite(scale)) return
        
        let alpha = this.opacity * 0.8
        
        if (this.state === 'prerender') {
          alpha *= this.prerenderProgress
        } else if (CenterRain.groupProperties[this.groupIndex].formationPhase) {
          alpha *= CenterRain.groupProperties[this.groupIndex].moveProgress
        } else if (CenterRain.groupProperties[this.groupIndex].zoomStarted) {
          const zRange = config.tunnel.depth - this.minZ
          const zProgress = (this.z - this.minZ) / zRange
          alpha *= Math.min(1, Math.max(0, zProgress))
        }
        
        const x = this.state === 'prerender' ? this.currentX : this.drawX
        const y = this.state === 'prerender' ? this.currentY : this.drawY
        
        if (!isFinite(x) || !isFinite(y)) return
        
        ctx.save()
        ctx.shadowColor = 'rgba(0,255,0,0.5)'
        ctx.shadowBlur = 4
        ctx.font = `${size}px monospace`
        ctx.fillStyle = `rgba(0,255,0,${alpha})`
        ctx.fillText(this.value, x, y)
        ctx.restore()
      }

      static cleanupInactiveGroups() {
        Array.from(CenterRain.activeGroups).forEach(groupIndex => {
          const group = CenterRain.groupProperties[groupIndex]
          if (!group || !group.active) {
            CenterRain.activeGroups.delete(groupIndex)
          }
        })
      }
    }

    const RAIN_COUNT = 25
    const rainDrops = Array(RAIN_COUNT).fill(null).map((_, i) => new CenterRain(i, RAIN_COUNT))

    let symbolUpdateCounter = 0

    function animate() {
      requestAnimationFrame(animate)
      
      if (!offscreenContext || !config.context) return

      offscreenContext.fillStyle = 'rgba(0,0,0,0.98)'
      offscreenContext.fillRect(0, 0, config.width, config.height)
      
      config.context.fillStyle = 'rgb(0,0,0)'
      config.context.fillRect(0, 0, config.width, config.height)

      let allGroupsNeedReset = true
      let anyActiveGroups = false

      CenterRain.activeGroups.forEach(groupIndex => {
        const group = CenterRain.groupProperties[groupIndex]
        if (group && group.active) {
          allGroupsNeedReset = false
          anyActiveGroups = true
        }
      })

      if (allGroupsNeedReset && anyActiveGroups) {
        CenterRain.resetAllGroups()
      }

      const symbols = config.symbols
      for (let i = 0; i < symbols.length; i++) {
        symbols[i].update()
        symbols[i].draw(offscreenContext as CanvasRenderingContext2D)
      }

      for (let drop of rainDrops) {
        drop.update()
        drop.draw(offscreenContext as CanvasRenderingContext2D)
      }

      config.context.drawImage(offscreenCanvas as HTMLCanvasElement, 0, 0)
      
      symbolUpdateCounter = (symbolUpdateCounter || 0) + 1
    }

    const RADIUS_FACTOR = 0.8

    const resizeHandler = () => {
      config.width = window.innerWidth
      config.height = window.innerHeight
      
      const aspectRatio = window.innerWidth / window.innerHeight
      config.tunnel.radius = Math.min(
        config.width * RADIUS_FACTOR,
        config.height * RADIUS_FACTOR * aspectRatio
      )
      
      if (offscreenCanvas instanceof HTMLCanvasElement) {
        offscreenCanvas.width = config.width
        offscreenCanvas.height = config.height
      } else if (offscreenCanvas instanceof OffscreenCanvas) {
        offscreenCanvas = new OffscreenCanvas(config.width, config.height)
        offscreenContext = offscreenCanvas.getContext('2d') as OffscreenCanvasRenderingContext2D
      }
      
      config.centerX = config.width / 2
      config.centerY = config.height / 2
      ;[config.context, offscreenContext].forEach(ctx => {
        if (ctx) {
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.shadowColor = 'rgba(0,255,0,0.5)'
        }
      })
      
      initSymbols()
    }
    let resizeTimeout: NodeJS.Timeout
    function handleResize() {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resizeHandler, 250)
    }

    function cleanup() {
      window.removeEventListener('resize', handleResize)
    }

    function init() {
      cleanup()
      if (!initCanvas()) return
      initSymbols()

      rainDrops.forEach(drop => {
        if (drop.positionInGroup === 0) {
          drop.initGroupProperties()
        }
      })

      rainDrops.forEach(drop => drop.reset())

      window.addEventListener('resize', handleResize, { passive: true })
      requestAnimationFrame(animate)
    }

    init()

    return cleanup
  }, [])

  return <canvas ref={canvasRef} id="matrix" className="fixed top-0 left-0 w-full h-full" />
}
export default MatrixBackground
