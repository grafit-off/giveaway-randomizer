import { useEffect, useRef, useMemo, useState } from 'react'
import { HiVolumeUp, HiVolumeOff } from 'react-icons/hi'
import { Participant } from '../../models/Participant'
import { CarouselProps } from '../../models/CarouselProps'
import { AVAILABLE_COLORS } from '../../constants/availableColors'
import { ACCELERATION_RATIO } from '../../constants/accelerationRatio'
import { DECELERATION_RATIO } from '../../constants/decelerationRatio'
import { DEFAULT_ANIMATION } from '../../constants/defaultAnimation'
import { TILE_MARGIN } from '../../constants/tileMargin'
import { FILLER_TILES_AFTER } from '../../constants/fillerTilesAfter'
import { IMAGE_COUNT } from '../../constants/imageCount'
import { AUDIO_VOLUME } from '../../constants/audioVolume'
import { CENTER_THRESHOLD_OFFSET } from '../../constants/centerThresholdOffset'
import { IDLE_LOOP_MULTIPLIER } from '../../constants/idleLoopMultiplier'
import { WINNER_BORDER_COLOR } from '../../constants/winnerBorderColor'
import { AUDIO_PATH } from '../../constants/audioPath'
import { BASE_URL } from '../../constants/baseUrl'
import { calculateSmoothProgress } from '../../functions/calculateSmoothProgress'
import styles from './Carousel.module.scss'

export const Carousel: React.FC<CarouselProps> = ({
  participants,
  winnerIndex,
  isAnimating,
  onAnimationComplete,
  config,
  soundEnabled,
  onSoundToggle,
  onStartRandomize,
  canStart
}) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()
  const idleAnimationFrameRef = useRef<number>()
  const startTimeRef = useRef<number>()
  const idleStartTimeRef = useRef<number>()
  const [centeredTileIndex, setCenteredTileIndex] = useState<number | null>(null)
  const crossedTilesRef = useRef<Set<number>>(new Set())

  const getContainerWidth = useRef(() => {
    if (carouselRef.current?.parentElement) {
      return carouselRef.current.parentElement.clientWidth
    }
    return config.tileWidth * config.visibleItems
  })

  const calculateFinalPosition = useRef((containerWidth: number) => {
    const { tileWidth, fillerTilesBeforeWinner } = config
    const tileTotalWidth = tileWidth + TILE_MARGIN
    const winnerTileIndex = fillerTilesBeforeWinner
    const centerOffset = containerWidth / 2 - tileWidth / 2
    return winnerTileIndex * tileTotalWidth - centerOffset
  })

  useEffect(() => {
    if (!isAnimating || winnerIndex === null || participants.length === 0) {
      return
    }

    const { tileWidth, fillerTilesBeforeWinner } = config
    const tileTotalWidth = tileWidth + TILE_MARGIN
    const travelDuration = DEFAULT_ANIMATION.spinDuration

    const accelerationDuration = travelDuration * ACCELERATION_RATIO
    const decelerationDuration = travelDuration * DECELERATION_RATIO

    const animationRuntime = travelDuration

    startTimeRef.current = undefined
    crossedTilesRef.current.clear()
    setCenteredTileIndex(null)

    if (carouselRef.current) {
      carouselRef.current.style.transform = 'translateX(0px)'
    }

    const animate = (currentTime: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = currentTime
      }

      const elapsed = currentTime - startTimeRef.current
      const containerWidth = getContainerWidth.current()
      const centerLinePosition = containerWidth / 2
      const finalPosition = calculateFinalPosition.current(containerWidth)

      let position = 0

      if (elapsed < travelDuration) {
        const progress = calculateSmoothProgress(
          elapsed,
          accelerationDuration,
          decelerationDuration,
          travelDuration
        )
        position = finalPosition * progress
      } else {
        position = finalPosition
      }

      if (carouselRef.current) {
        carouselRef.current.style.transform = `translateX(-${position}px)`
      }

      const totalTiles = fillerTilesBeforeWinner + 1 + FILLER_TILES_AFTER
      let currentCenteredTile: number | null = null

      for (let i = 0; i < totalTiles; i++) {
        const tileLeftEdge = i * tileTotalWidth
        const tileCenter = tileLeftEdge + tileWidth / 2
        const tileCenterRelativeToViewport = tileCenter - position
        const threshold = tileWidth / 2 + CENTER_THRESHOLD_OFFSET

        if (
          tileCenterRelativeToViewport >= centerLinePosition - threshold &&
          tileCenterRelativeToViewport <= centerLinePosition + threshold
        ) {
          currentCenteredTile = i

          if (elapsed < travelDuration && !crossedTilesRef.current.has(i)) {
            crossedTilesRef.current.add(i)

            if (soundEnabled) {
              const audio = new Audio(AUDIO_PATH)
              audio.volume = AUDIO_VOLUME
              audio.currentTime = 0
              audio.play().catch(err => console.error('Audio play failed:', err))
            }
          }
        }
      }

      setCenteredTileIndex(currentCenteredTile)

      if (elapsed < animationRuntime) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        if (carouselRef.current) {
          const exactFinalPosition = calculateFinalPosition.current(containerWidth)
          carouselRef.current.style.transform = `translateX(-${exactFinalPosition}px)`
        }
        onAnimationComplete()
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isAnimating, winnerIndex, participants, config, onAnimationComplete, soundEnabled])

  useEffect(() => {
    if (isAnimating || winnerIndex === null || participants.length === 0 || !carouselRef.current) {
      return
    }

    const { tileWidth, fillerTilesBeforeWinner } = config
    const tileTotalWidth = tileWidth + TILE_MARGIN

    const updatePosition = () => {
      const containerWidth = getContainerWidth.current()
      const finalPosition = calculateFinalPosition.current(containerWidth)
      const centerLinePosition = containerWidth / 2

      if (carouselRef.current) {
        carouselRef.current.style.transform = `translateX(-${finalPosition}px)`
      }

      const winnerTileIndex = fillerTilesBeforeWinner
      const tileLeftEdge = winnerTileIndex * tileTotalWidth
      const tileCenter = tileLeftEdge + tileWidth / 2
      const tileCenterRelativeToViewport = tileCenter - finalPosition
      const threshold = tileWidth / 2 + CENTER_THRESHOLD_OFFSET

      if (
        tileCenterRelativeToViewport >= centerLinePosition - threshold &&
        tileCenterRelativeToViewport <= centerLinePosition + threshold
      ) {
        setCenteredTileIndex(winnerTileIndex)
      } else {
        setCenteredTileIndex(null)
      }
    }

    updatePosition()

    window.addEventListener('resize', updatePosition)
    return () => window.removeEventListener('resize', updatePosition)
  }, [isAnimating, winnerIndex, participants, config])

  useEffect(() => {
    if (isAnimating || participants.length === 0 || !carouselRef.current) {
      return
    }

    if (winnerIndex !== null) {
      return
    }

    const { tileWidth } = config
    const tileTotalWidth = tileWidth + TILE_MARGIN

    let currentPosition = 0
    if (carouselRef.current) {
      const currentTransform = carouselRef.current.style.transform
      if (currentTransform && currentTransform !== 'none') {
        const match = currentTransform.match(/translateX\(-?(\d+)px\)/)
        if (match) {
          currentPosition = parseFloat(match[1]) || 0
        }
      }
    }

    const animateIdle = (currentTime: number) => {
      if (idleStartTimeRef.current === undefined) {
        idleStartTimeRef.current = currentTime
      }

      const elapsed = (currentTime - idleStartTimeRef.current) / 1000
      const distance = elapsed * DEFAULT_ANIMATION.idleSpeed
      const newPosition = currentPosition + distance

      const loopDistance = tileTotalWidth * IDLE_LOOP_MULTIPLIER
      const loopedPosition = newPosition % loopDistance

      if (carouselRef.current) {
        carouselRef.current.style.transform = `translateX(-${loopedPosition}px)`
      }

      idleAnimationFrameRef.current = requestAnimationFrame(animateIdle)
    }

    idleStartTimeRef.current = undefined
    idleAnimationFrameRef.current = requestAnimationFrame(animateIdle)

    return () => {
      if (idleAnimationFrameRef.current) {
        cancelAnimationFrame(idleAnimationFrameRef.current)
      }
      idleStartTimeRef.current = undefined
    }
  }, [isAnimating, participants, config, winnerIndex])

  const tiles = useMemo(() => {
    if (participants.length === 0) return []
    
    const tilesArray: Participant[] = []
    
    for (let i = 0; i < config.fillerTilesBeforeWinner; i++) {
      const randomIndex = Math.floor(Math.random() * participants.length)
      tilesArray.push(participants[randomIndex])
    }
    
    if (winnerIndex !== null && winnerIndex < participants.length) {
      tilesArray.push(participants[winnerIndex])
    }
    
    for (let i = 0; i < FILLER_TILES_AFTER; i++) {
      const randomIndex = Math.floor(Math.random() * participants.length)
      tilesArray.push(participants[randomIndex])
    }
    
    return tilesArray
  }, [participants, config.fillerTilesBeforeWinner, winnerIndex])

  if (participants.length === 0) {
    return (
      <div className={styles.carouselContainer}>
        <div className={styles.carouselEmpty}>Add participants to start</div>
      </div>
    )
  }

  return (
    <div className={styles.carouselContainer}>
      <h1 className={styles.carouselTitle}>Giveaway Randomizer</h1>
      <div className={styles.carouselWrapper}>
        <div className={styles.carouselCenterLine} />
          <div className={`${styles.carouselTrack} ${!isAnimating && participants.length > 0 ? styles.idleAnimation : ''}`} ref={carouselRef}>
          {tiles.map((participant, index) => {
            const participantIndex = participants.findIndex(p => p.id === participant.id)
            const imageIndex = participantIndex >= 0 ? participantIndex : 0
            const tileColor = AVAILABLE_COLORS[index % AVAILABLE_COLORS.length]
            
            return (
            <div
              key={`filler-${index}`}
              className={`${styles.carouselTile} ${centeredTileIndex === index ? styles.tileCentered : ''}`}
              style={{
                width: `${config.tileWidth}px`,
                backgroundColor: tileColor,
                borderColor: centeredTileIndex === index
                  ? WINNER_BORDER_COLOR
                  : 'transparent',
                transform: centeredTileIndex === index ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 0.1s ease-out, border-color 0.2s ease-out'
              }}
            >
              <div className={styles.tileGlow} />
              <div className={styles.tileContent}>
                <img 
                  src={`${BASE_URL}participant-${(imageIndex % IMAGE_COUNT) + 1}.png`}
                  alt={participant.name}
                  className={styles.tileAvatar}
                />
                <div className={styles.tileName}>{participant.name}</div>
              </div>
            </div>
            )
          })}
        </div>
      </div>
      <div className={styles.carouselControls}>
        <button
          className={styles.soundToggleButton}
          onClick={() => onSoundToggle(!soundEnabled)}
          title={soundEnabled ? 'Disable sound' : 'Enable sound'}
          aria-label={soundEnabled ? 'Disable sound' : 'Enable sound'}
        >
          {soundEnabled ? <HiVolumeUp size={24} /> : <HiVolumeOff size={24} />}
        </button>
        <button
          className={styles.randomizeButton}
          onClick={onStartRandomize}
          disabled={isAnimating || !canStart}
        >
          {isAnimating ? 'Randomizing...' : '🎲 Spin'}
        </button>
      </div>
    </div>
  )
}
