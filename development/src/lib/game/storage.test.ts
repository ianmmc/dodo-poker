import { describe, it, expect, beforeEach, vi } from 'vitest'
import { save, load, clear } from './storage'
import type { SavedSession } from './storage'

const MINIMAL: SavedSession = {
  avatar: 'crow',
  playerSeeds: 95,
  npcSeeds: 95,
  handNumber: 1,
  handsPlayed: 0,
  betAmount: 5,
  ante: 5,
  firedOnce: [],
  assessmentLog: [],
  observationLog: [],
  firedRules: [],
}

// Polyfill localStorage for the node test environment
const store: Record<string, string> = {}
vi.stubGlobal('localStorage', {
  getItem: (k: string) => store[k] ?? null,
  setItem: (k: string, v: string) => { store[k] = v },
  removeItem: (k: string) => { delete store[k] },
  clear: () => { Object.keys(store).forEach(k => delete store[k]) },
})

beforeEach(() => {
  Object.keys(store).forEach(k => delete store[k])
})

describe('save / load round-trip', () => {
  it('load returns null when nothing is saved', () => {
    expect(load()).toBeNull()
  })

  it('saves and loads a session', () => {
    save(MINIMAL)
    const loaded = load()
    expect(loaded).not.toBeNull()
    expect(loaded?.avatar).toBe('crow')
    expect(loaded?.playerSeeds).toBe(95)
  })

  it('load returns null when JSON is corrupt', () => {
    store['dodo-poker-v1'] = 'not valid json {'
    expect(load()).toBeNull()
  })

  it('preserves optional fields', () => {
    const session: SavedSession = {
      ...MINIMAL,
      handsAt1B: 12,
      surveillanceRoomVisited: true,
      currentNpcName: 'Lucky',
      usedBackupIds: ['morty'],
    }
    save(session)
    const loaded = load()!
    expect(loaded.handsAt1B).toBe(12)
    expect(loaded.surveillanceRoomVisited).toBe(true)
    expect(loaded.currentNpcName).toBe('Lucky')
    expect(loaded.usedBackupIds).toEqual(['morty'])
  })
})

describe('clear', () => {
  it('removes the saved session', () => {
    save(MINIMAL)
    clear()
    expect(load()).toBeNull()
  })
})
