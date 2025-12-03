import { Participant } from '../models/Participant'
import { generateRandomColor } from './generateRandomColor'

export const assignColorsToParticipants = (participants: Participant[]): Participant[] => {
  return participants.map(p => ({
    ...p,
    color: p.color || generateRandomColor()
  }))
}
