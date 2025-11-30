import { Participant } from '../types'
import './WinnerMenu.css'

interface WinnerMenuProps {
  winner: Participant | null
  onRemoveWinner: () => void
  onContinue: () => void
}

export const WinnerMenu: React.FC<WinnerMenuProps> = ({
  winner,
  onRemoveWinner,
  onContinue
}) => {
  if (!winner) return null

  return (
    <div className="winner-menu-overlay">
      <div className="winner-menu">
        <h2 className="winner-menu-title">🎉 Winner Selected!</h2>
        <div 
          className="winner-menu-winner"
          style={{ backgroundColor: winner.color }}
        >
          <div className="winner-menu-winner-name">{winner.name}</div>
        </div>
        <div className="winner-menu-actions">
          <button
            className="winner-menu-button winner-menu-button-remove"
            onClick={onRemoveWinner}
          >
            Remove Winner
          </button>
          <button
            className="winner-menu-button winner-menu-button-continue"
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

