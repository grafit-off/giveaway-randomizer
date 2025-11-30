import { Participant } from './types'

const STORAGE_KEY = 'giveaway-randomizer-participants'

export const generateRandomColor = (): string => {
  const hue = Math.floor(Math.random() * 360)
  const saturation = 60 + Math.floor(Math.random() * 30)
  const lightness = 25 + Math.floor(Math.random() * 15) // Darker range: 25-40%
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export const loadParticipantsFromStorage = (): Participant[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const parsed = JSON.parse(stored)
    if (Array.isArray(parsed)) {
      // Validate that each item has required fields
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

export const saveParticipantsToStorage = (participants: Participant[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participants))
  } catch (error) {
    console.error('Failed to save participants to localStorage:', error)
  }
}

export const assignColorsToParticipants = (participants: Participant[]): Participant[] => {
  return participants.map(p => ({
    ...p,
    color: p.color || generateRandomColor()
  }))
}

export const easeOutQuint = (t: number): number => {
  return 1 - Math.pow(1 - t, 5)
}

export const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export const cubicBezier = (t: number): number => {
  // Cubic Bezier (0.15, 0.85, 0.25, 1)
  const p0 = 0
  const p1 = 0.15
  const p2 = 0.25
  const p3 = 1
  
  const mt = 1 - t
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3
}

export const rapidAccelerationBezier = (t: number): number => {
  // Cubic Bezier (0.5, 0.0, 0.7, 0.0) for rapid acceleration
  const p0 = 0
  const p1 = 0.5
  const p2 = 0.7
  const p3 = 0
  
  const mt = 1 - t
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3
}

