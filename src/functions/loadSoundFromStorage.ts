import { SOUND_STORAGE_KEY } from '../constants/soundStorageKey'

export const loadSoundFromStorage = (): boolean => {
  try {
    const stored = localStorage.getItem(SOUND_STORAGE_KEY)
    if (stored === null) {
      // Return default value (true) if not found
      return true
    }
    return stored === 'true'
  } catch (error) {
    console.error('Failed to load sound setting from localStorage:', error)
    // Return default value on error
    return true
  }
}

