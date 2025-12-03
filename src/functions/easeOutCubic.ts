export const easeOutCubic = (t: number): number => {
  const t1 = t - 1
  return t1 * t1 * t1 + 1
}
