import { AVAILABLE_COLORS } from '../constants/availableColors'

export const generateRandomColor = (): string => {
  const randomIndex = Math.floor(Math.random() * AVAILABLE_COLORS.length)
  return AVAILABLE_COLORS[randomIndex]
}
