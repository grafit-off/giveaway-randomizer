import { useEffect, useRef, useMemo, useState } from 'react'
import { Participant, CarouselConfig } from '../types'
import { easeOutQuint } from '../utils'
import './Carousel.css'

interface CarouselProps {
  participants: Participant[]
  winnerIndex: number | null
  isAnimating: boolean
  onAnimationComplete: () => void
  config: CarouselConfig
}

export const Carousel: React.FC<CarouselProps> = ({
  participants,
  winnerIndex,
  isAnimating,
  onAnimationComplete,
  config
}) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()
  const startTimeRef = useRef<number>()
  const currentPositionRef = useRef<number>(0)
  const [centeredTileIndex, setCenteredTileIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!isAnimating || winnerIndex === null || participants.length === 0) return

    const { tileWidth, fillerTilesBeforeWinner, visibleItems } = config
    const tileMargin = 10 // margin-right from CSS
    const tileTotalWidth = tileWidth + tileMargin
    const containerWidth = tileWidth * visibleItems
    const centerOffset = containerWidth / 2 - tileWidth / 2
    const centerLinePosition = containerWidth / 2
    
    // Calculate final position: winner tile should be centered
    // Winner is at index fillerTilesBeforeWinner
    const winnerTileIndex = fillerTilesBeforeWinner
    const finalPosition = winnerTileIndex * tileTotalWidth - centerOffset

    // Animation phases - CS2 style roulette timing (total 9 seconds)
    const totalDuration = 9000 // 9 seconds total
    const accelerationPhase = 2000 // 1s - Slower acceleration
    const constantSpeedPhase = 5000 // 5s - Constant speed
    const decelerationPhase = 2000 // 3s - Smooth deceleration

    // Distance distribution - ensure total equals finalPosition
    // Calculate distances based on time proportions to maintain consistent speed
    const accelDistance = finalPosition * 0.05 // 5% during acceleration
    const constantDistance = finalPosition * 0.25 // 20% during constant speed (3x slower)
    // Remaining 75% will be covered during deceleration phase
    
    // Pre-calculate phase end positions for smooth transitions
    const accelEndPosition = accelDistance
    const constantEndPosition = accelDistance + constantDistance
    const crossedTiles = new Set<number>() // Track which tiles have crossed the center line

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = currentTime
        currentPositionRef.current = 0
      }

      const elapsed = currentTime - startTimeRef.current

      let position = 0

      if (elapsed < accelerationPhase) {
        // Phase 1: Slower Acceleration - gentler start
        const accelProgress = Math.min(elapsed / accelerationPhase, 1)
        // Use a gentler easing function (ease-in cubic)
        const easedProgress = accelProgress * accelProgress * accelProgress
        position = accelDistance * easedProgress
      } else if (elapsed < accelerationPhase + constantSpeedPhase) {
        // Phase 2: Constant High Speed - steady fast pace with subtle jitter
        const constantProgress = Math.min(
          (elapsed - accelerationPhase) / constantSpeedPhase,
          1
        )
        
        // Start from acceleration end position for smooth transition
        const basePosition = accelEndPosition + constantDistance * constantProgress
        
        // Subtle jitter ±1-2px per frame (CS2 style) - but don't affect deceleration start
        const jitter = (Math.random() - 0.5) * 4 // ±2px max
        position = basePosition + jitter
      } else {
        // Phase 3: Smooth Deceleration - starts at constant speed and reduces to stop
        const decelProgress = Math.min(
          (elapsed - accelerationPhase - constantSpeedPhase) / decelerationPhase,
          1
        )
        
        // Start from constant speed end position for smooth transition
        const decelStartPos = constantEndPosition
        const remainingDistance = finalPosition - decelStartPos
        
        // Deceleration starts at constant speed and smoothly reduces to zero
        // Use easeOutQuint which starts fast (matching constant speed velocity) and slows to stop
        // The easing curve ensures smooth deceleration from constant speed to zero velocity
        const easedProgress = easeOutQuint(decelProgress)
        
        // Apply easing to remaining distance
        // At decelProgress = 0: position = decelStartPos (starting at constant speed)
        // At decelProgress = 1: position = finalPosition (stopped)
        // The easeOutQuint curve ensures initial velocity matches constant speed
        position = decelStartPos + remainingDistance * easedProgress
      }

      // Ensure we never exceed final position
      position = Math.min(position, finalPosition)
      currentPositionRef.current = position

      // Check which tiles have crossed the center line and play sound
      // Calculate total number of tiles (filler + winner + extra)
      const totalTiles = config.fillerTilesBeforeWinner + (winnerIndex !== null ? 1 : 0) + 50
      
      let currentCenteredTile: number | null = null
      
      for (let i = 0; i < totalTiles; i++) {
        // Calculate tile's center position relative to viewport
        const tileLeftEdge = i * tileTotalWidth
        const tileCenter = tileLeftEdge + tileWidth / 2
        const tileCenterRelativeToViewport = tileCenter - position
        
        // Check if tile is currently at the center line
        const threshold = tileWidth / 2 + 5 // Half tile width + small buffer
        if (tileCenterRelativeToViewport <= centerLinePosition + threshold && 
            tileCenterRelativeToViewport >= centerLinePosition - threshold) {
          currentCenteredTile = i
          
          // Play sound when tile first crosses center line
          if (!crossedTiles.has(i)) {
            crossedTiles.add(i)
            
            // Play sound when tile crosses center line
            const audio = new Audio('/scroll.mp3')
            audio.volume = 0.4
            audio.currentTime = 0 // Start from beginning each time
            audio.play().catch(err => console.error('Audio play failed:', err))
          }
        }
      }
      
      // Update centered tile for scaling
      setCenteredTileIndex(currentCenteredTile)

      if (carouselRef.current) {
        carouselRef.current.style.transform = `translateX(-${position}px)`
      }

      if (elapsed < totalDuration) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        // Animation complete - ensure EXACT final position for perfect alignment
        if (carouselRef.current) {
          carouselRef.current.style.transform = `translateX(-${finalPosition}px)`
        }
        onAnimationComplete()
      }
    }

    // Reset animation state
    startTimeRef.current = undefined
    currentPositionRef.current = 0
    setCenteredTileIndex(null)
    if (carouselRef.current) {
      carouselRef.current.style.transform = 'translateX(0px)'
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isAnimating, winnerIndex, participants, config, onAnimationComplete])

  // Create tiles array with filler tiles before winner - memoized to prevent regeneration
  const tiles = useMemo(() => {
    if (participants.length === 0) return []
    
    const tilesArray: Participant[] = []
    
    // Add filler tiles before winner
    for (let i = 0; i < config.fillerTilesBeforeWinner; i++) {
      const randomIndex = Math.floor(Math.random() * participants.length)
      tilesArray.push(participants[randomIndex])
    }
    
    // Add winner
    if (winnerIndex !== null && winnerIndex < participants.length) {
      tilesArray.push(participants[winnerIndex])
    }
    
    // Add some tiles after winner for smooth scrolling
    for (let i = 0; i < 50; i++) {
      const randomIndex = Math.floor(Math.random() * participants.length)
      tilesArray.push(participants[randomIndex])
    }
    
    return tilesArray
  }, [participants, config.fillerTilesBeforeWinner, winnerIndex])

  if (participants.length === 0) {
    return (
      <div className="carousel-container">
        <div className="carousel-empty">Add participants to start</div>
      </div>
    )
  }

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <div className="carousel-center-line" />
        <div className="carousel-track" ref={carouselRef}>
          {tiles.map((participant, index) => (
            <div
              key={`filler-${index}`}
              className="carousel-tile"
              style={{
                width: `${config.tileWidth}px`,
                backgroundColor: participant.color,
                borderColor: index === config.fillerTilesBeforeWinner && winnerIndex !== null
                  ? '#00E1E1'
                  : 'transparent',
                transform: centeredTileIndex === index ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.1s ease-out'
              }}
            >
              <div className="tile-glow" />
              <div className="tile-content">
                <div className="tile-name">{participant.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

