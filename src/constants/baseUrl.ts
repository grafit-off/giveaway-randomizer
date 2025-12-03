// Base URL for assets - ensures correct path for GitHub Pages subdirectory
// In production, BASE_URL should be '/giveaway-randomizer/' from vite.config.ts
// Fallback ensures it works even if BASE_URL is not set correctly
export const BASE_URL = import.meta.env.BASE_URL || (import.meta.env.PROD ? '/giveaway-randomizer/' : '/')

