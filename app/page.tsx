'use client'

import { useEffect, useState, useRef } from 'react'
import ChatInterface from './components/ChatInterface'
import MatrixBackground from './components/MatrixBackground'
import FallingDollars from './components/FallingDollars'
import LogoAnimation from './components/LogoAnimation'
import { Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import DexscreenerChart from './components/DexscreenerChart'
import { createChatMessage } from './config/prompts'
import { textToSpeech } from '../topMediaAi'
import { HELP_INFO } from './config/help_info'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [isIterating, setIsIterating] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isClosed, setIsClosed] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 11000)
    return () => clearTimeout(timer)
  }, [])

  const handleCommand = (command: string) => {
    
    switch (command) {
      case 'help':
        const helpMessage = {
          role: 'assistant' as const,
          content: HELP_INFO.helpMessage
        };
        setMessages(prev => [...prev, helpMessage]);
        break;
      case 'twitter':
        window.open(process.env.NEXT_PUBLIC_TWITTER_LINK, '_blank');
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Opening Twitter...' 
        }]);
        break;
      case 'chart':
        const chartUrl = process.env.NEXT_PUBLIC_CHART;
        window.open(chartUrl, '_blank');
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Opening Chart on Dexscreener...' 
        }]);
        break;
      case 'iteration':
        setIsIterating(true);
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Starting iteration...' 
        }]);
        break;
      case 'stream':
        window.open(process.env.NEXT_PUBLIC_PUMP_FUN_LINK, '_blank');
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: 'Opening Stream...' 
        }]);
        break;
    }
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleMaximize = () => {
    // Maximize/restore logic is handled in ChatInterface component
  }

  const handleClose = () => {
    setIsClosed(true)
    // Optional: Reset state after animation
    setTimeout(() => {
      setIsClosed(false)
      setIsMinimized(false)
    }, 500)
  }

  if (loading) {
    return <LogoAnimation />
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0D0208]">
      <MatrixBackground />
      <AnimatePresence>
        {!isIterating && !isClosed && (
          <motion.div
            className="flex min-h-screen flex-col items-center justify-center p-4"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FallingDollars />
            <main className="relative z-20 flex min-h-screen flex-col items-center justify-start p-4 gap-8">
              <motion.div
                className="w-full max-w-[80rem] flex flex-col items-center gap-8"
                initial={{ opacity: 1, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                {/* Center ASCII art and social links */}
                <div className="w-full flex flex-col items-center justify-center gap-4">
                  <pre className="text-[#00ff41] text-center text-[0.25rem] sm:text-[0.35rem] md:text-[0.5rem] lg:text-[0.7rem] font-mono leading-[0.7] sm:leading-[0.8] md:leading-[0.9] lg:leading-[1] whitespace-pre">
{`
███████╗███████╗ ██████╗    ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
██╔════╝██╔════╝██╔════╝    ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
███████╗█████╗  ██║            ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
╚════██║██╔══╝  ██║            ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
███████║███████╗╚██████╗       ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
╚══════╝╚══════╝ ╚═════╝       ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
`.trim()}
                  </pre>

                  {/* Social links and CA */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex justify-center space-x-6">
                      <a 
                        href={process.env.NEXT_PUBLIC_TWITTER_LINK}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="X (formerly Twitter)"
                        className="transform transition-all duration-300 hover:scale-110 hover:brightness-125 focus:outline-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00ff41]">
                          <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
                          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
                        </svg>
                      </a>
                      <a 
                        href={process.env.NEXT_PUBLIC_DEXSCREENER_LINK}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="Dexscreener"
                        className="transform transition-all duration-300 hover:scale-110 hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-[#00ff41] focus:ring-opacity-50"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 252 300"
                          fill="currentColor"
                          className="text-[#00ff41]"
                        >
                          <path d="M151.818 106.866c9.177-4.576 20.854-11.312 32.545-20.541 2.465 5.119 2.735 9.586 1.465 13.193-.9 2.542-2.596 4.753-4.826 6.512-2.415 1.901-5.431 3.285-8.765 4.033-6.326 1.425-13.712.593-20.419-3.197m1.591 46.886l12.148 7.017c-24.804 13.902-31.547 39.716-39.557 64.859-8.009-25.143-14.753-50.957-39.556-64.859l12.148-7.017a5.95 5.95 0 003.84-5.845c-1.113-23.547 5.245-33.96 13.821-40.498 3.076-2.342 6.434-3.518 9.747-3.518s6.671 1.176 9.748 3.518c8.576 6.538 14.934 16.951 13.821 40.498a5.95 5.95 0 003.84 5.845zM126 0c14.042.377 28.119 3.103 40.336 8.406 8.46 3.677 16.354 8.534 23.502 14.342 3.228 2.622 5.886 5.155 8.814 8.071 7.897.273 19.438-8.5 24.796-16.709-9.221 30.23-51.299 65.929-80.43 79.589-.012-.005-.02-.012-.029-.018-5.228-3.992-11.108-5.988-16.989-5.988s-11.76 1.996-16.988 5.988c-.009.005-.017.014-.029.018-29.132-13.66-71.209-49.359-80.43-79.589 5.357 8.209 16.898 16.982 24.795 16.709 2.929-2.915 5.587-5.449 8.814-8.071C69.31 16.94 77.204 12.083 85.664 8.406 97.882 3.103 111.959.377 126 0m-25.818 106.866c-9.176-4.576-20.854-11.312-32.544-20.541-2.465 5.119-2.735 9.586-1.466 13.193.901 2.542 2.597 4.753 4.826 6.512 2.416 1.901 5.432 3.285 8.766 4.033 6.326 1.425 13.711.593 20.418-3.197" />
                          <path d="M197.167 75.016c6.436-6.495 12.107-13.684 16.667-20.099l2.316 4.359c7.456 14.917 11.33 29.774 11.33 46.494l-.016 26.532.14 13.754c.54 33.766 7.846 67.929 24.396 99.193l-34.627-27.922-24.501 39.759-25.74-24.231L126 299.604l-41.132-66.748-25.739 24.231-24.501-39.759L0 245.25c16.55-31.264 23.856-65.427 24.397-99.193l.14-13.754-.016-26.532c0-16.721 3.873-31.578 11.331-46.494l2.315-4.359c4.56 6.415 10.23 13.603 16.667 20.099l-2.01 4.175c-3.905 8.109-5.198 17.176-2.156 25.799 1.961 5.554 5.54 10.317 10.154 13.953 4.48 3.531 9.782 5.911 15.333 7.161 3.616.814 7.3 1.149 10.96 1.035-.854 4.841-1.227 9.862-1.251 14.978L53.2 160.984l25.206 14.129a41.926 41.926 0 015.734 3.869c20.781 18.658 33.275 73.855 41.861 100.816 8.587-26.961 21.08-82.158 41.862-100.816a41.865 41.865 0 015.734-3.869l25.206-14.129-32.665-18.866c-.024-5.116-.397-10.137-1.251-14.978 3.66.114 7.344-.221 10.96-1.035 5.551-1.25 10.854-3.63 15.333-7.161 4.613-3.636 8.193-8.399 10.153-13.953 3.043-8.623 1.749-17.689-2.155-25.799l-2.01-4.175z" />
                        </svg>
                      </a>
                      <a 
                        href={process.env.NEXT_PUBLIC_PUMP_FUN_LINK}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="Pump.fun"
                        className="transform transition-all duration-300 hover:scale-110 hover:brightness-125 focus:outline-none focus:ring-2 focus:ring-[#00ff41] focus:ring-opacity-50"
                      >
                        <svg
                          version="1.0"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          preserveAspectRatio="xMidYMid meet"
                          className="text-[#00ff41]"
                          fill="currentColor"
                        >
                          <path d="M13.5 22.95c-2.625-1.5-11.925-12.15-12.45-14.4-1.125-4.35 3.525-9.15 7.875-8.175 1.95.375 6.6 4.725 11.925 11.1 1.65 1.95 2.4 3.6 2.4 5.4 0 4.95-5.55 8.4-9.75 6.075zm6.975-1.8c.675-.75 1.425-2.4 1.725-3.6.375-1.95-.075-2.85-2.475-5.7l-3-3.375-4.425 3.975-4.425 3.9 3 3.075c2.4 2.475 3.45 3.075 5.625 3.075 1.725 0 3.225-.525 3.975-1.35zm-9.225-9.525l3.3-3.375-2.55-2.625c-6.225-6.45-13.35 0-7.425 6.75 1.275 1.425 2.55 2.625 2.85 2.625.3 0 2.025-1.5 3.825-3.375z"/>
                        </svg>
                      </a>
                    </div>
                    
                    <div className="text-[#00ff41] text-center text-xs sm:text-sm [font-family:'Namecat',monospace] !font-normal">
                      CA: {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}
                    </div>
                  </div>
                </div>

                {/* Chat Interface */}
                <ChatInterface 
                  messages={messages}
                  setMessages={setMessages}
                  onCommand={handleCommand}
                  onMinimize={handleMinimize}
                  onMaximize={handleMaximize}
                  onClose={handleClose}
                  isProcessing={isProcessing}
                />

                {/* Dexscreener Chart Container */}
                <div className="w-full flex flex-col">
                  <DexscreenerChart />
                </div>
              </motion.div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add audio element */}
      <audio ref={audioRef} className="hidden" />
    </div>
  )
}

