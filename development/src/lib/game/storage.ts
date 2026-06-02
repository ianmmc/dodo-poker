import type { AssessmentRecord } from './assessment'

const KEY = 'dodo-poker-v1'

export interface SavedSession {
  avatar: string
  playerSeeds: number
  hankSeeds: number
  handNumber: number
  handsPlayed: number
  betAmount: number
  ante: number
  firedOnce: string[]
  assessmentLog: AssessmentRecord[]
}

export function save(data: SavedSession): void {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function load(): SavedSession | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as SavedSession) : null
  } catch {
    return null
  }
}

export function clear(): void {
  localStorage.removeItem(KEY)
}
