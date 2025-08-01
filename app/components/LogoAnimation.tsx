'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type AsciiArt = string[]

const asciiArts: AsciiArt[] = [
  // SEC Logo
  `
███████╗███████╗ ██████╗    ████████╗███████╗██████╗ ███╗   ███╗██╗███╗   ██╗ █████╗ ██╗     
██╔════╝██╔════╝██╔════╝    ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║     
███████╗█████╗  ██║            ██║   █████╗  ██████╔╝██╔████╔██║██║██╔██╗ ██║███████║██║     
╚════██║██╔══╝  ██║            ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║██║╚██╗██║██╔══██║██║     
███████║███████╗╚██████╗       ██║   ███████╗██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██║  ██║███████╗
╚══════╝╚══════╝ ╚═════╝       ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝
`.trim().split('\n'),

  // Dollar Sign
  `
... .... .... .... .... .... .... ... .... .... .... .... .... .... ... .... .... .... .... .... ...
....................................................................................................
..............................:-+*#%%%#*=-:..............:-=*#%%%##+-:..............................
...........................=%@@@@@@@@@@@@@@@#-........-#@@@@@@@@@@@@@@@%=...........................
........................-#@@@@@*=:....::+#@@@@@*:..:*@@@@@%+:::...:=*@@@@@%-........................
......................:#@@@%=:.............:*@@@@*+@@@@*:.............:=%@@@#:......................
.....................=%@@%=..................:+@@@@@@*:..................=%@@%=.....................
  ... .... .... ....=%@@*:.... ... .... .... ..-#@@%-......................*@@@=................... 
... .... .... .... -%@@*:... .... ... .... .....:##- .... .... .... ... ...:+@@%=..... .... .... ...
...................*@@%-..........................:.........................:#@@#:..................
..................-#@@+......................................................=@@%-..................
..................-%@@=......................................................-@@%=..................
  ... .... .... ..-%@@=.. .... ... ...-#@@%=..... ......=#@@#-...............=@@%=................. 
..................:#@@+.............-@@@@@@@@*........+@@@@@@@@-.............+@@#:..................
...................*@@%-...........:@@@@@@@@@@+......+@@@@@@@@@@:...........:%@@*...................
  ... .... .... ...-#@@*: .... ... :@@@@@@@@@@*.. ...+@@@@@@@@@@:..........:*@@#-.................. 
... .... .... .... .=@@@+:.. .... ..*@@@@@@@@#: .... :#@@@@@@@@*:.. ... ..:+@@@+. .... .... .... ...
.....................+@@@+...........-#%@@@#=..........=#%@@%#=...........+@@@+.....................
......................+@@@*:............................................:*@@@+......................
.......................=%@@%:..........................................:%@@%=.......................
  ... .... .... .... ...:%@@@=.... .... .... .... ....................=@@@%:....................... 
..........................*@@@@:....................................:@@@@*..........................
...........................:%@@@%:................................:%@@@%:...........................
  ... .... .... .... .... ...=%@@@#:... .... .... ..............:#@@@%-............................ 
... .... .... .... .... .... ..=%@@@#-.... .... .... .... ....-#@@@%=.. .... .... .... .... .... ...
.................................=%@@@%=....................=%@@@%=.................................
...................................=#@@@@+:..............:+@@@@#=...................................
.....................................:#@@@@#=:........:=#@@@@#:.....................................
  ... .... .... .... .... .... ... .....=@@@@@*-....-*@@@@%=....................................... 
... .... .... .... .... .... .... ... ....:*@@@@@#*@@@@@*:.... .... ... .... .... .... .... .... ...
.............................................-#@@@@@@#-.............................................
  ... .... .... .... .... .... ... .... .... ..:-**-:.............................................. 
... .... .... .... .... .... .... ... .... .... .... .... .... .... ... .... .... .... .... .... ...
....................................................................................................
`.trim().split('\n'),

  // Matrix-style @
  `
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%%@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@*-.... ..=#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#=.......-*@@@@@@@@@@@@@@
@@@@@@@@@@@@#...      ....#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#....      ...#@@@@@@@@@@@@
@@@@@@@@@@@+....        ...:#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#:...        ....+@@@@@@@@@@@
@@@@@@@@@@%.                .-%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%-.                .%@@@@@@@@@@
@@@@@@@@@@*.                ...=%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%=...                .*@@@@@@@@@@
@@@@@@@@@@*.                    .+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+.                    .*@@@@@@@@@@
@@@@@@@@@@@:...                 ...*@@@@@@@@@@@@@@@@@@@@@@@@@@@@*...                 ...:@@@@@@@@@@@
@@@@@@@@@@@@:...                    .#@@@@@@@@@@@@@@@@@@@@@@@@#.                    ...:@@@@@@@@@@@@
@@@@@@@@@@@@@*..                    ..:%@@@@@@@@@@@@@@@@@@@@%:..                    ..*@@@@@@@@@@@@@
@@@@@@@@@@@@@@@+....                  ..-%@@@@@@@@@@@@@@@@%-....                ....+@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@%=..                    ..+@@@@@@@@@@@@@@+..                    ..=%@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@%-....                ....+@@@@@@@@@@+....                ....-%@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@%:..                    ..#@@@@@@#..                    ..:%@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@#.                    ...:#@@#:...                    .#@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@*...                    .--.                    ...*@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@+.                    ....                    .+@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@%-..                                      ..-%@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%:.                                    .:%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#....                            ....#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*..                            ..*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+....                    ....+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#..                      ..#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+....                    ....+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#..                            ..#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#...                              ...#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%-.                                    .-%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@%=..                                      ..=%@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@+.                    ....                    .+@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@*...                    .::.                    ...*@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@#.                    ....#@@#....                    .#@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@%:..                    ..*@@@@@@*..                    ..:%@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@%-.. .                ....+@@@@@@@@@@+....                ....-%@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@+..                    ..=%@@@@@@@@@@@@%=..                    ..+@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@+....                  ..-%@@@@@@@@@@@@@@@@%-....                ....+@@@@@@@@@@@@@@@
@@@@@@@@@@@@@#..                    ..:%@@@@@@@@@@@@@@@@@@@@%:..                    ..#@@@@@@@@@@@@@
@@@@@@@@@@@@:...                    .#@@@@@@@@@@@@@@@@@@@@@@@@#.                    ...:@@@@@@@@@@@@
@@@@@@@@@@@:...                 ...*@@@@@@@@@@@@@@@@@@@@@@@@@@@@*...                 ...:@@@@@@@@@@@
@@@@@@@@@@#.                    .+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+.                    .#@@@@@@@@@@
@@@@@@@@@@+.                ...-%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%-...                .*@@@@@@@@@@
@@@@@@@@@@%.                .:%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%:.                .%@@@@@@@@@@
@@@@@@@@@@@+....        ....#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#....        ....+@@@@@@@@@@@
@@@@@@@@@@@@*...      ....*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*....      ...*@@@@@@@@@@@@
@@@@@@@@@@@@@@*-.......-*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*-.......-*@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@%###%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%###%@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
`.trim().split('\n'),

  // Binary Pattern
  `
....................................................................................................
..............................................:.....................................................
................................................:*%+................................................
...............................................:%%%%=...............................................
..............................................-%%%%%%+..............................................
.........................................:...=%%%+-#%%*.............................................
........................................:...+%%%= .:#%%+...:........................................
...........................................+%%%%%#*+-%%%*...:.......................................
..........................................+%%%#:.... .*%%*:.........................................
.........................................+%%#:....:....#%%#.........................................
........................................*%%%%%#+:......-#%%%........................................
.......................................#%%%%%%%%%%%%%%%%%%%%%:......................................
.....................................:#%%%%%%%%%%%%%%%%%%%%%%#-.....................................
.................................:..-#%%%%%%%%%%%%%%%%%%%%%%%%#=....................................
...............................:...-%%%%%%%%#++%%%%%%%%*+---%%%%=...................................
..............................:...-%%%+.  ....... ....   ..-#%%%%=...:....................... ......
.................................=%%#:....-+*#*+++*+=-::::--:.=%%%+.................................
................................+%%#-.:---+***+==--:--=+***=-:.-#%%*................................
...............................+%%%-.-+*=:....::------::....-=*+#%%%*...............................
..............................*%%%+++-..:=****++++**++++*##*=:..:+%%%*:..:..........................
............................:*%%%#-..:+*=-+##%%#---:--*%%##*-+#*:..*%%*:............................
............................#%%%-...:.-#%%%%%%%-      .#%%%%%%#=-+..+%%*. ..........................
.......................:...#%%#:. .:*%%#%%%%%+%=.     .*%%%%%#-#%%=..+%%#...........................
......................:..:%%%%*:.-*%%#-*+%%%%*+=.    .-%%%%%%-:=*%%#--#%%#...:......................
........................-#%%%=:+%%%%#*:-=+%%%%%+-:.:=*%%%%%%=.-==#%%%%%%%%#:........................
....................:..-#%%%**%%%%%%#-=.-=-#%%%%%%%%%%%%%%#:.+-==#%%%%#+#%%#:..:....................
...................:..-#%%#=*+.:=#==-:.-=:=:-#%%%%%%%%%%#-.=-.:...:=:.. .=%%#:..:...................
.....................-%%%+. ...=#.....+#:...==..:=++-:..........:+..*%+. :%%%%:.....................
....................-%%%=.   .... .   ....=##-...  ........:+#+:.*%%#=.:#%%%%%%:....................
...................=%%%=.     ..++-:.. .-+=::...   ........:-+##*-..:+%*:.=%%%%%=...................
..................=%%%=.         ..=+*++=-.:=++++======++++-:..:-=***+=+#%#+=+#%%+..................
.............:...+%%%=.          ..-=-:.::.-=====-:....  ...:--=+*#%%#+=:....:*%%%+...:.............
...............:*%%%+.  ...  ..   ....:::.. .-----=====++****+==-:......-+*#%%%%%%%*:...............
............:..+%%%%%%%%%%%%%%%%%%%%%%%%######**#################%%%%%%%%%%%%%%%%%%%*...............
............. .*%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%:..:...........
............:............. ............................................................:............
.................:..:..:......................:..:..::..:............................:..............
`.trim().split('\n')
].map((art: string | string[]) => Array.isArray(art) ? art : art.split('\n'))

export default function LogoAnimation() {
  const [progress, setProgress] = useState<number>(0)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [visibleLines, setVisibleLines] = useState<number>(0)
  const [showMainContent, setShowMainContent] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const animationStartTimeRef = useRef(Date.now())
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLPreElement>(null)

  // Calculate initial dimensions
  useEffect(() => {
    const calculateDimensions = () => {
      if (containerRef.current && contentRef.current) {
        const container = containerRef.current
        const content = contentRef.current
        setDimensions({
          width: container.clientWidth,
          height: container.clientHeight
        })
      }
    }

    calculateDimensions()
    window.addEventListener('resize', calculateDimensions)
    return () => window.removeEventListener('resize', calculateDimensions)
  }, [])

  // Animation logic
  useEffect(() => {
    const loadTime = 9000
    let lastTime = Date.now()
    let animationFrame: number

    const animate = () => {
      const currentTime = Date.now()
      const deltaTime = currentTime - lastTime
      lastTime = currentTime

      const elapsedTime = currentTime - animationStartTimeRef.current
      const rawProgress = (elapsedTime / loadTime) * 100
      
      setProgress(Math.min(100, rawProgress))

      const phaseTime = loadTime / asciiArts.length
      const currentPhaseIndex = Math.min(
        Math.floor(elapsedTime / phaseTime),
        asciiArts.length - 1
      )

      if (currentPhaseIndex !== currentPhase) {
        setCurrentPhase(currentPhaseIndex)
        setVisibleLines(0)
      } else {
        const phaseProgress = (elapsedTime % phaseTime) / phaseTime
        const targetLines = Math.floor(asciiArts[currentPhaseIndex].length * phaseProgress)
        setVisibleLines(prev => Math.min(prev + 1, targetLines))
      }

      if (rawProgress < 100) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setTimeout(() => setShowMainContent(true), 500)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [currentPhase])

  // Update references to asciiArts to use processedAsciiArts
  const currentArt = asciiArts[currentPhase] || []

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div 
        ref={containerRef}
        className="w-full h-full max-w-[1200px] max-h-[800px] p-4 flex flex-col items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {!showMainContent ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center justify-center space-y-8"
            >
              <div className="relative w-full flex-1 flex items-center justify-center">
                <pre 
                  ref={contentRef}
                  className="text-[#00ff41] text-center font-mono whitespace-pre
                    text-[0.25rem] sm:text-[0.35rem] md:text-[0.5rem] lg:text-[0.7rem]
                    leading-[0.7] sm:leading-[0.8] md:leading-[0.9] lg:leading-[1]"
                >
                  {currentArt.slice(0, visibleLines).join('\n')}
                </pre>
              </div>

              <div className="w-full max-w-md space-y-4">
                <div className="h-2 sm:h-3 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#00ff41]"
                    style={{ width: `${progress}%` }}
                    transition={{ type: "spring", stiffness: 50, damping: 20 }}
                  />
                </div>
                
                <div className="text-[#00ff41] text-center font-mono text-lg sm:text-xl md:text-2xl lg:text-3xl">
                  {Math.round(progress)}%
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="final"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full flex items-center justify-center"
            >
              <pre 
                className="text-[#00ff41] text-center font-mono whitespace-pre
                  text-[0.25rem] sm:text-[0.35rem] md:text-[0.5rem] lg:text-[0.7rem]
                  leading-[0.7] sm:leading-[0.8] md:leading-[0.9] lg:leading-[1]"
              >
                {asciiArts[0].join('\n')}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}