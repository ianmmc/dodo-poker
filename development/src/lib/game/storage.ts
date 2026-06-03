import type { AssessmentRecord } from './assessment'
import type { HandSummary } from './observationEngine'
import type { FrequencyData } from './frequencyData'

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
  observationLog: HandSummary[]
  firedRules: string[]
  // Table 1B
  frequencyData?: FrequencyData
  handsAt1B?: number
  surveillanceRoomVisited?: boolean
  // NPC swap system
  currentNpcName?: string
  usedBackupIds?: string[]
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
