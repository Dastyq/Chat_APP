'use client'

import { useState } from 'react'

export default function DexscreenerChart() {
  const [isMaximized, setIsMaximized] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const handleMaximize = () => {
    if (isMinimized) {
      setIsMinimized(false)
    }
    setIsMaximized(!isMaximized)
  }

  const handleMinimize = () => {
    if (isMaximized) {
      setIsMaximized(false)
    }
    setIsMinimized(!isMinimized)
  }

  const handleClose = () => {
    const chartWindow = document.querySelector('.chart-window')
    chartWindow?.classList.add('close-animation')
    setTimeout(() => {
      setIsVisible(false)
    }, 300)
  }

  if (!isVisible) return null

  return (
    <div 
      className={`
        chart-window
        relative
        transition-all duration-300 ease-in-out
        ${isMaximized ? 
          'fixed inset-4 m-auto rounded-lg z-50' : 
          'w-full max-w-[56rem] rounded-lg'
        }
        ${isMinimized ?
          'fixed top-1 h-[4rem] left-1/2 -translate-x-1/2' :
          'h-[600px]'
        }
        bg-black overflow-hidden border border-[#00ff41] shadow-[0_0_20px_rgba(0,255,0,0.5)]
      `}
    >
      {/* Window Controls - Matching ChatInterface style */}
      <div className="bg-black bg-opacity-50 px-4 py-2 flex flex-col items-center justify-center">
        <div className="flex w-full justify-between items-center mb-2">
          <div className="flex space-x-2">
            <button 
              onClick={handleClose}
              className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors duration-150 flex items-center justify-center group"
              aria-label="Close"
            >
              <span className="hidden group-hover:inline text-black text-xs">×</span>
            </button>
            <button 
              onClick={handleMinimize}
              className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors duration-150 flex items-center justify-center group"
              aria-label="Minimize"
            >
              <span className="hidden group-hover:inline text-black text-xs">−</span>
            </button>
            <button 
              onClick={handleMaximize}
              className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors duration-150 flex items-center justify-center group"
              aria-label="Maximize"
            >
              <span className="hidden group-hover:inline text-black text-xs">+</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Chart Content - Hide when minimized */}
      {!isMinimized && (
        <iframe
          title="Dexscreener Chart"
          src={`https://dexscreener.com/solana/${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}?embed=1&theme=dark&info=0&trades=0&chartType=mcap`}
          className="w-full h-[calc(100%-2.5rem)]"
          style={{ 
            border: 'none',
            background: 'transparent',
            colorScheme: 'dark'
          }}
        />
      )}
    </div>
  )
} 