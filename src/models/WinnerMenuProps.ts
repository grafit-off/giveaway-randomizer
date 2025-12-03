import { Participant } from './Participant'

export interface WinnerMenuProps {
  winner: Participant | null
  winnerIndex: number | null
  onRemoveWinner: () => void
  onContinue: () => void
}
