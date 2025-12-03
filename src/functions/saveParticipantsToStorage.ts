import { Participant } from '../models/Participant'
import { STORAGE_KEY } from '../constants/storageKey'

export const saveParticipantsToStorage = (participants: Participant[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participants))
  } catch (error) {
    console.error('Failed to save participants to localStorage:', error)
  }
}
