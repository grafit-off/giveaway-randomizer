import { easeInCubic } from './easeInCubic'
import { easeOutCubic } from './easeOutCubic'
import { clamp } from './clamp'

export const calculateSmoothProgress = (
  elapsed: number,
  accelerationDuration: number,
  decelerationDuration: number,
  totalDuration: number
): number => {
  if (elapsed <= 0) return 0
  if (elapsed >= totalDuration) return 1

  const transitionTime = accelerationDuration
  const accelRatio = accelerationDuration / totalDuration
  const decelRatio = decelerationDuration / totalDuration
  
  const transitionPosition = accelRatio / (accelRatio + decelRatio)

  if (elapsed < transitionTime) {
    const phaseProgress = elapsed / transitionTime
    const eased = easeInCubic(phaseProgress)
    return eased * transitionPosition
  } else {
    const phaseElapsed = elapsed - transitionTime
    const phaseDuration = decelerationDuration
    const phaseProgress = clamp(phaseElapsed / phaseDuration, 0, 1)
    
    const eased = easeOutCubic(phaseProgress)
    return transitionPosition + eased * (1 - transitionPosition)
  }
}
