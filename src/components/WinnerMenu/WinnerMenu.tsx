import { WinnerMenuProps } from '../../models/WinnerMenuProps'
import { IMAGE_COUNT } from '../../constants/imageCount'
import styles from './WinnerMenu.module.scss'

export const WinnerMenu: React.FC<WinnerMenuProps> = ({
  winner,
  winnerIndex,
  onRemoveWinner,
  onContinue
}) => {
  if (!winner || winnerIndex === null) return null

  return (
    <div className={styles.winnerMenuOverlay}>
      <div className={styles.winnerMenu}>
        <h2 className={styles.winnerMenuTitle}>🎉 Winner Selected!</h2>
        <div className={styles.winnerMenuWinner}>
          <img 
            src={`${import.meta.env.BASE_URL}participant-${(winnerIndex % IMAGE_COUNT) + 1}.png`}
            alt={winner.name}
            className={styles.winnerMenuAvatar}
          />
          <div className={styles.winnerMenuWinnerName}>{winner.name}</div>
        </div>
        <div className={styles.winnerMenuActions}>
          <button
            className={`${styles.winnerMenuButton} ${styles.winnerMenuButtonRemove}`}
            onClick={onRemoveWinner}
          >
            Remove Winner
          </button>
          <button
            className={`${styles.winnerMenuButton} ${styles.winnerMenuButtonContinue}`}
            onClick={onContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
