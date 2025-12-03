import { Participant } from './Participant'
import { CarouselConfig } from './CarouselConfig'

export interface CarouselProps {
  participants: Participant[]
  winnerIndex: number | null
  isAnimating: boolean
  onAnimationComplete: () => void
  config: CarouselConfig
  soundEnabled: boolean
  onSoundToggle: (enabled: boolean) => void
  onStartRandomize: () => void
  canStart: boolean
}
