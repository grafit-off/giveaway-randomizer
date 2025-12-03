import { Participant } from '../models/Participant'
import { STORAGE_KEY } from '../constants/storageKey'
import { getDefaultParticipants } from '../constants/defaultParticipants'

export const loadParticipantsFromStorage = (): Participant[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      // Return default participants if localStorage is empty
      return getDefaultParticipants()
    }
    
    const parsed = JSON.parse(stored)
    if (Array.isArray(parsed)) {
      const loaded = parsed.filter((p: unknown): p is Participant => 
        typeof p === 'object' &&
        p !== null &&
        'id' in p &&
        'name' in p &&
        typeof (p as Participant).id === 'string' &&
        typeof (p as Participant).name === 'string'
      )
      // Return default participants if loaded array is empty
      return loaded.length > 0 ? loaded : getDefaultParticipants()
    }
    // Return default participants if parsed data is not an array
    return getDefaultParticipants()
  } catch (error) {
    console.error('Failed to load participants from localStorage:', error)
    // Return default participants on error
    return getDefaultParticipants()
  }
}
