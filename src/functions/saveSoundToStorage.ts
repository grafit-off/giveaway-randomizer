import { SOUND_STORAGE_KEY } from '../constants/soundStorageKey'

export const saveSoundToStorage = (soundEnabled: boolean): void => {
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, String(soundEnabled))
  } catch (error) {
    console.error('Failed to save sound setting to localStorage:', error)
  }
}

