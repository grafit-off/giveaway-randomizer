import { Participant } from '../models/Participant'
import { STORAGE_KEY } from '../constants/storageKey'

export const loadParticipantsFromStorage = (): Participant[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const parsed = JSON.parse(stored)
    if (Array.isArray(parsed)) {
      return parsed.filter((p: unknown): p is Participant => 
        typeof p === 'object' &&
        p !== null &&
        'id' in p &&
        'name' in p &&
        typeof (p as Participant).id === 'string' &&
        typeof (p as Participant).name === 'string'
      )
    }
    return []
  } catch (error) {
    console.error('Failed to load participants from localStorage:', error)
    return []
  }
}
