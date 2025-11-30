import { useState, useMemo, useEffect } from 'react'
import { Participant, CarouselConfig } from './types'
import { assignColorsToParticipants, generateRandomColor, loadParticipantsFromStorage, saveParticipantsToStorage } from './utils'
import { Carousel } from './components/Carousel'
import { ParticipantInput } from './components/ParticipantInput'
import { WinnerMenu } from './components/WinnerMenu'
import { ErrorModal } from './components/ErrorModal'
import './App.css'

const DEFAULT_CONFIG: CarouselConfig = {
  tileWidth: 180,
  visibleItems: 7,
  fillerTilesBeforeWinner: 200 + Math.floor(Math.random() * 151), // 200-350
  animationDuration: 6000 // 6 seconds
}

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

    // Regenerate config with new random filler tiles count
    const newConfig: CarouselConfig = {
      ...DEFAULT_CONFIG,
      fillerTilesBeforeWinner: 200 + Math.floor(Math.random() * 151) // 200-350
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

  const currentWinner = winnerIndex !== null ? participantsWithColors[winnerIndex] : null

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Giveaway Randomizer</h1>
      </header>

      <main className="app-main">
        <ParticipantInput
          onAddParticipant={handleAddParticipant}
          disabled={isAnimating}
        />

        <Carousel
          participants={participantsWithColors}
          winnerIndex={winnerIndex}
          isAnimating={isAnimating}
          onAnimationComplete={handleAnimationComplete}
          config={config}
        />

        <div className="app-controls">
          <button
            className="randomize-button"
            onClick={handleStartRandomize}
            disabled={isAnimating || participantsWithColors.length === 0}
          >
            {isAnimating ? 'Randomizing...' : '🎲 Start Randomizer'}
          </button>
        </div>

        {participantsWithColors.length > 0 && (
          <div className="participants-list">
            <h3 className="participants-list-title">Participants ({participantsWithColors.length})</h3>
            <div className="participants-grid">
              {participantsWithColors.map((participant) => (
                <div
                  key={participant.id}
                  className="participant-badge"
                  style={{ backgroundColor: participant.color }}
                >
                  <span className="participant-badge-name">{participant.name}</span>
                  <button
                    className="participant-badge-remove"
                    onClick={() => handleRemoveParticipant(participant.id)}
                    disabled={isAnimating}
                    title="Remove participant"
                    aria-label={`Remove ${participant.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {showWinnerMenu && (
        <WinnerMenu
          winner={currentWinner}
          onRemoveWinner={handleRemoveWinner}
          onContinue={handleContinue}
        />
      )}

      <ErrorModal
        isOpen={errorModal.isOpen}
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, message: '' })}
      />
    </div>
  )
}

export default App

