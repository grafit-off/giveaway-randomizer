import { useState, useMemo, useEffect } from 'react'
import { HiX } from 'react-icons/hi'
import { Participant } from './models/Participant'
import { CarouselConfig } from './models/CarouselConfig'
import { assignColorsToParticipants } from './functions/assignColorsToParticipants'
import { generateRandomColor } from './functions/generateRandomColor'
import { loadParticipantsFromStorage } from './functions/loadParticipantsFromStorage'
import { saveParticipantsToStorage } from './functions/saveParticipantsToStorage'
import { AVAILABLE_COLORS } from './constants/availableColors'
import { DEFAULT_CONFIG } from './constants/defaultConfig'
import { RESIZE_TIMEOUT_MS } from './constants/resizeTimeoutMs'
import { IMAGE_COUNT } from './constants/imageCount'
import { BASE_URL } from './constants/baseUrl'
import { Carousel } from './components/Carousel/Carousel'
import { ParticipantInput } from './components/ParticipantInput/ParticipantInput'
import { WinnerMenu } from './components/WinnerMenu/WinnerMenu'
import { ErrorModal } from './components/ErrorModal/ErrorModal'
import { ConfirmationModal } from './components/ConfirmationModal/ConfirmationModal'
import { TwitchChatSidebar } from './components/TwitchChatSidebar/TwitchChatSidebar'
import styles from './App.module.scss'

function App() {
  // Load participants from localStorage on mount
  const [participants, setParticipants] = useState<Participant[]>(() => {
    return loadParticipantsFromStorage()
  })
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showWinnerMenu, setShowWinnerMenu] = useState(false)
  const [config, setConfig] = useState<CarouselConfig>(DEFAULT_CONFIG)
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: ''
  })
  const [confirmRemoveAll, setConfirmRemoveAll] = useState<boolean>(false)
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true) // Default: enabled
  // Hide chat sidebar by default on mobile devices
  const [chatSidebarVisible, setChatSidebarVisible] = useState<boolean>(() => {
    return window.innerWidth > 768
  })

  // Handle chat sidebar toggle with position recalculation
  const handleChatSidebarToggle = () => {
    if (isAnimating) return // Don't allow toggle during animation
    setChatSidebarVisible(!chatSidebarVisible)
    // Trigger resize event to recalculate positions after sidebar toggle
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, RESIZE_TIMEOUT_MS)
  }

  // Update chat sidebar visibility on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && !chatSidebarVisible) {
        // Auto-show on desktop if it was hidden
        setChatSidebarVisible(true)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [chatSidebarVisible])

  // Save participants to localStorage whenever they change
  useEffect(() => {
    saveParticipantsToStorage(participants)
  }, [participants])

  const participantsWithColors = useMemo(() => {
    return assignColorsToParticipants(participants)
  }, [participants])

  const handleAddParticipant = (name: string) => {
    const trimmedName = name.trim()
    
    // Check for duplicate names (case-insensitive)
    const isDuplicate = participants.some(
      p => p.name.toLowerCase() === trimmedName.toLowerCase()
    )
    
    if (isDuplicate) {
      setErrorModal({
        isOpen: true,
        message: `Participant "${trimmedName}" already exists!`
      })
      return
    }
    
    const newParticipant: Participant = {
      id: Date.now().toString(),
      name: trimmedName,
      color: generateRandomColor()
    }
    setParticipants(prev => [...prev, newParticipant])
  }

  const handleStartRandomize = () => {
    if (participantsWithColors.length === 0) {
      alert('Please add at least one participant!')
      return
    }

    const newConfig: CarouselConfig = {
      ...DEFAULT_CONFIG,
      fillerTilesBeforeWinner: DEFAULT_CONFIG.fillerTilesBeforeWinner
    }
    setConfig(newConfig)

    // Select winner before animation starts
    const randomWinnerIndex = Math.floor(Math.random() * participantsWithColors.length)
    setWinnerIndex(randomWinnerIndex)
    setIsAnimating(true)
    setShowWinnerMenu(false)
  }

  const handleAnimationComplete = () => {
    setIsAnimating(false)
    setShowWinnerMenu(true)
  }

  const handleRemoveWinner = () => {
    if (winnerIndex !== null && winnerIndex < participants.length) {
      setParticipants(prev => prev.filter((_, index) => index !== winnerIndex))
      setWinnerIndex(null)
      setShowWinnerMenu(false)
    }
  }

  const handleContinue = () => {
    setShowWinnerMenu(false)
    setWinnerIndex(null)
  }

  const handleRemoveParticipant = (participantId: string) => {
    if (isAnimating) return // Don't allow removal during animation
    
    const participantIndex = participants.findIndex(p => p.id === participantId)
    
    if (participantIndex === -1) return
    
    setParticipants(prev => prev.filter(p => p.id !== participantId))
    
    // If the removed participant was the winner, reset winner state
    if (winnerIndex !== null && participantIndex === winnerIndex) {
      setWinnerIndex(null)
      setShowWinnerMenu(false)
    } else if (winnerIndex !== null && participantIndex < winnerIndex) {
      // Adjust winner index if a participant before the winner was removed
      setWinnerIndex(winnerIndex - 1)
    }
  }

  const handleRemoveAllParticipants = () => {
    if (isAnimating) return // Don't allow removal during animation
    setConfirmRemoveAll(true)
  }

  const confirmRemoveAllParticipants = () => {
    setParticipants([])
    setWinnerIndex(null)
    setShowWinnerMenu(false)
    setConfirmRemoveAll(false)
  }

  const currentWinner = winnerIndex !== null ? participantsWithColors[winnerIndex] : null

  return (
    <div className={`${styles.app} ${!chatSidebarVisible ? styles.chatSidebarHidden : ''}`}>
      <TwitchChatSidebar
        channel="psragee"
        isVisible={chatSidebarVisible}
        onToggle={handleChatSidebarToggle}
        disabled={isAnimating}
      />
      
      <main className={styles.appMain}>
        <Carousel
          participants={participantsWithColors}
          winnerIndex={winnerIndex}
          isAnimating={isAnimating}
          onAnimationComplete={handleAnimationComplete}
          config={config}
          soundEnabled={soundEnabled}
          onSoundToggle={setSoundEnabled}
          onStartRandomize={handleStartRandomize}
          canStart={participantsWithColors.length > 0}
        />

        <div className={styles.participantsList}>
          <div className={styles.participantsListHeader}>
            <h3 className={styles.participantsListTitle}>Participants ({participantsWithColors.length})</h3>
            {participantsWithColors.length > 0 && (
              <button
                className={styles.removeAllButton}
                onClick={handleRemoveAllParticipants}
                disabled={isAnimating}
                title="Remove all participants"
              >
                Remove All
              </button>
            )}
          </div>
          
          <ParticipantInput
            onAddParticipant={handleAddParticipant}
            disabled={isAnimating}
          />

          {participantsWithColors.length > 0 && (
            <div className={styles.participantsGrid}>
              {Array.from({ length: 6 }, (_, columnIndex) => (
                <div key={columnIndex} className={styles.participantsColumn}>
                  {participantsWithColors
                    .filter((_, index) => index % 6 === columnIndex)
                    .map((participant, participantIndex) => {
                      const globalIndex = columnIndex + participantIndex * 6
                      const imageIndex = globalIndex % IMAGE_COUNT
                      const participantColor = AVAILABLE_COLORS[globalIndex % AVAILABLE_COLORS.length]
                      return (
                        <div
                          key={participant.id}
                          className={styles.participantBadge}
                          style={{ backgroundColor: participantColor }}
                        >
                          <img
                            src={`${BASE_URL}participant-${imageIndex + 1}.png`}
                            alt={participant.name}
                            className={styles.participantBadgeAvatar}
                          />
                          <span className={styles.participantBadgeName}>{participant.name}</span>
                          <button
                            className={styles.participantBadgeRemove}
                            onClick={() => handleRemoveParticipant(participant.id)}
                            disabled={isAnimating}
                            title="Remove participant"
                            aria-label={`Remove ${participant.name}`}
                          >
                            <HiX />
                          </button>
                        </div>
                      )
                    })}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showWinnerMenu && (
        <WinnerMenu
          winner={currentWinner}
          winnerIndex={winnerIndex}
          onRemoveWinner={handleRemoveWinner}
          onContinue={handleContinue}
        />
      )}

      <ErrorModal
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
      />

      <ConfirmationModal
        isOpen={confirmRemoveAll}
        title="Remove All Participants"
        message="Are you sure you want to remove all participants? This action cannot be undone."
        confirmText="Remove All"
        cancelText="Cancel"
        onConfirm={confirmRemoveAllParticipants}
        onCancel={() => setConfirmRemoveAll(false)}
      />
    </div>
  )
}

export default App

