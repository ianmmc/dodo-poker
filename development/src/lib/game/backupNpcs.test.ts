import { describe, it, expect } from 'vitest'
import { BACKUP_NPCS, getNextBackup } from './backupNpcs'

describe('BACKUP_NPCS', () => {
  it('contains exactly 10 entries', () => {
    expect(BACKUP_NPCS).toHaveLength(10)
  })

  it('all IDs are unique', () => {
    const ids = BACKUP_NPCS.map(n => n.id)
    expect(new Set(ids).size).toBe(10)
  })

  it('every entry has a non-empty name, species, and intro', () => {
    for (const npc of BACKUP_NPCS) {
      expect(npc.name.length).toBeGreaterThan(0)
      expect(npc.species.length).toBeGreaterThan(0)
      expect(npc.intro.length).toBeGreaterThan(0)
    }
  })
})

describe('getNextBackup', () => {
  it('returns the first NPC when no IDs are used', () => {
    const npc = getNextBackup([])
    expect(npc).not.toBeNull()
    expect(npc?.id).toBe(BACKUP_NPCS[0].id)
  })

  it('skips already-used IDs', () => {
    const first = BACKUP_NPCS[0].id
    const npc = getNextBackup([first])
    expect(npc?.id).toBe(BACKUP_NPCS[1].id)
  })

  it('returns null when all NPCs have been used', () => {
    const allIds = BACKUP_NPCS.map(n => n.id)
    expect(getNextBackup(allIds)).toBeNull()
  })

  it('skips multiple used IDs in sequence', () => {
    const usedIds = BACKUP_NPCS.slice(0, 5).map(n => n.id)
    const npc = getNextBackup(usedIds)
    expect(npc?.id).toBe(BACKUP_NPCS[5].id)
  })
})
