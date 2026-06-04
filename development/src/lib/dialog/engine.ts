import startOfGameJson from '../../../dialog/start-of-game.json'
import table1aJson from '../../../dialog/table-1a.json'
import table1bJson from '../../../dialog/table-1b.json'

export interface DialogNode {
  id: string
  speaker: string | null
  text: string | null
  responseType: 'none' | 'action' | 'checklist' | 'numeric' | 'single-select' | 'estimate' | 'prediction'
  silent?: boolean
  pool?: string
  weight?: number
  trigger?: {
    handNumber?: number
    minHandsPlayed?: number
    playerDiscards?: number | number[]
    once?: boolean
  }
  options?: Array<{ id: string; text: string; description?: string; correct?: boolean }>
  feedback?: {
    correct?: string
    attempt1Wrong?: string
    attempt2Wrong?: string
    attempt3Wrong?: string
    tooHigh?: string
    tooLow?: string
  }
  correctAnswer?: number
  tolerance?: number
  followUp: {
    default?: string
    returnToGame?: boolean
    openReferenceCard?: boolean
    advanceTable?: boolean
    dealScriptedHand?: string
    openSurveillanceRoom?: boolean
  }
}

// ── Table 1B hand thresholds — single source of truth ───────────────────────
// Use these in both the engine guards below and in App.svelte's devJumpToHand
// so threshold changes propagate everywhere automatically.
export const TABLE_1B_SURV_THRESHOLD     = 10  // when surveillance room intro fires
export const TABLE_1B_HANK_RETRO_THRESHOLD = 14  // when Hank retrospective assessment fires
export const TABLE_1B_GATE_THRESHOLD     = 18  // when gate assessment fires

const nodes = new Map<string, DialogNode>()
const firedOnce = new Set<string>()

;(startOfGameJson as { nodes: DialogNode[] }).nodes.forEach(n => nodes.set(n.id, n))
;(table1aJson as { nodes: DialogNode[] }).nodes.forEach(n => nodes.set(n.id, n))
;(table1bJson as { nodes: DialogNode[] }).nodes.forEach(n => nodes.set(n.id, n))

export function restoreFiredOnce(ids: string[]): void {
  ids.forEach(id => firedOnce.add(id))
}

export function getFiredOnce(): string[] {
  return [...firedOnce]
}

// Weighted random selection from a named pool; returns null if silent node selected
function fromPool(poolName: string): DialogNode | null {
  const pool = [...nodes.values()].filter(n => n.pool === poolName)
  if (!pool.length) return null
  const total = pool.reduce((s, n) => s + (n.weight ?? 1), 0)
  let r = Math.random() * total
  for (const n of pool) {
    r -= n.weight ?? 1
    if (r <= 0) return n.silent ? null : n
  }
  const last = pool[pool.length - 1]
  return last.silent ? null : last
}

// Follow a chain of `none` nodes until a stop condition or a response node
function chain(startId: string): DialogNode[] {
  const seq: DialogNode[] = []
  let id: string | undefined = startId
  while (id) {
    const n = nodes.get(id)
    if (!n) break
    if (!n.silent) seq.push(n)
    if (
      n.followUp.returnToGame ||
      n.followUp.advanceTable ||
      n.followUp.openSurveillanceRoom ||
      n.responseType !== 'none'
    ) break
    id = n.followUp.default
  }
  return seq
}

// Shared guard: fire a chain exactly once. condition=false prevents firing
// regardless of firedOnce state.
function firedOnceChain(id: string, condition: boolean): DialogNode[] {
  if (firedOnce.has(id) || !condition) return []
  firedOnce.add(id)
  return chain(id)
}

// ── Start of game ───────────────────────────────────────────────────────────

// Returns [sog-001] — chain stops at sog-002 (responseType: 'action')
export function getStartOfGameChain(): DialogNode[] {
  return chain('sog-001')
}

// Returns [sog-avatar-{id}, sog-003, sog-004] — avatar-specific response + orientation
export function getAvatarResponse(avatarId: string): DialogNode[] {
  return chain(`sog-avatar-${avatarId}`)
}

// ── Table 1A ────────────────────────────────────────────────────────────────

export function getApproachNodes(): DialogNode[] {
  return chain('t1a-approach-001')
}

export function getPreHandNode(handNumber: number): DialogNode | null {
  if (handNumber === 1) {
    const n = nodes.get('t1a-hand-1-pre')
    return n && !n.silent ? n : null
  }
  return fromPool('t1a-pre-hand')
}

export function getDrawComment(discardCount: number): DialogNode | null {
  if (discardCount === 0) {
    const n = nodes.get('t1a-draw-keep-all')
    return n && !n.silent ? n : null
  }
  if (discardCount >= 4) {
    const n = nodes.get('t1a-draw-many')
    return n && !n.silent ? n : null
  }
  return null
}

export function getPostHandNode(outcome: 'win' | 'loss' | 'fold'): DialogNode | null {
  const pool = outcome === 'win' ? 't1a-post-win'
    : outcome === 'fold' ? 't1a-post-fold'
    : 't1a-post-loss'
  return fromPool(pool)
}

export function getPatternReveal(handsPlayed: number): DialogNode[] {
  return firedOnceChain('t1a-pattern-001', handsPlayed >= 3)
}

export function getGamblersReveal(handsPlayed: number): DialogNode[] {
  return firedOnceChain('t1a-fallacy-001', handsPlayed >= 8)
}

export function getHankActionNode(action: 'call' | 'bet' | 'raise'): DialogNode | null {
  return nodes.get(`t1a-hank-${action}`) ?? null
}

export function getHankDrawNode(count: number): DialogNode | null {
  const id = count === 0 ? 't1a-hank-draw-0' : `t1a-hank-draw-${Math.min(count, 3)}`
  return nodes.get(id) ?? null
}

// ── Table 1B ────────────────────────────────────────────────────────────────

export function getTable1bApproachNodes(): DialogNode[] {
  return chain('t1b-approach-001')
}

export function getTable1bPreHandNode(): DialogNode | null {
  return fromPool('t1b-pre-hand')
}

export function getTable1bDrawComment(discardCount: number): DialogNode | null {
  if (discardCount === 0) return nodes.get('t1b-draw-keep-all') ?? null
  if (discardCount >= 4) return nodes.get('t1b-draw-many') ?? null
  return null
}

// First tie fires the full 3-node "look at your frequency table" chain (once).
// Subsequent ties draw from the brief t1b-tie-sub pool.
export function getTie1BNodes(): DialogNode[] {
  const first = firedOnceChain('t1b-tie-first-001', true)
  if (first.length > 0) return first
  return [fromPool('t1b-tie-sub')].filter((n): n is DialogNode => n !== null)
}

// Table 1A has no frequency table; brief pool acknowledgment (often silent).
export function getTie1ANode(): DialogNode | null {
  return fromPool('t1a-tie')
}

export function getTable1bPostHandNode(outcome: 'win' | 'loss' | 'fold'): DialogNode | null {
  const pool = outcome === 'win' ? 't1b-post-win'
    : outcome === 'fold' ? 't1b-post-fold'
    : 't1b-post-loss'
  return fromPool(pool)
}

export function getTable1bNpcActionNode(action: 'call' | 'bet' | 'check'): DialogNode | null {
  return nodes.get(`t1b-npc-${action}`) ?? null
}

export function getTable1bNpcDrawNode(count: number): DialogNode | null {
  const id = count === 0 ? 't1b-npc-draw-0' : `t1b-npc-draw-${Math.min(count, 3)}`
  return nodes.get(id) ?? null
}

export function getLuckyDue(consecutiveLosses: number): DialogNode[] {
  return firedOnceChain('t1b-lucky-due', consecutiveLosses >= 3)
}

export function getSurveillanceRoomIntro(handsAt1B: number): DialogNode[] {
  return firedOnceChain('t1b-surv-intro-001', handsAt1B >= TABLE_1B_SURV_THRESHOLD)
}

export function getSurveillanceRoomReturn(): DialogNode[] {
  return firedOnceChain('t1b-surv-return-001', true)
}

// Fires at hand TABLE_1B_HANK_RETRO_THRESHOLD+, after the Surveillance Room
// visit, to let the student apply their frequency data to explain Hank's
// Table 1A behaviour.
export function getHankRetroAssessment(handsAt1B: number, surveillanceRoomVisited: boolean): DialogNode[] {
  return firedOnceChain('t1b-hank-retro-001', handsAt1B >= TABLE_1B_HANK_RETRO_THRESHOLD && surveillanceRoomVisited)
}

export function getTable1bAssessment(handsAt1B: number, surveillanceRoomVisited: boolean): DialogNode[] {
  return firedOnceChain('t1b-assess-intro', handsAt1B >= TABLE_1B_GATE_THRESHOLD && surveillanceRoomVisited)
}

// ── Shared ──────────────────────────────────────────────────────────────────

export function getChain(startId: string): DialogNode[] {
  return chain(startId)
}

export function getNode(id: string): DialogNode | null {
  return nodes.get(id) ?? null
}

export function markFiredOnce(id: string): void {
  firedOnce.add(id)
}

export function unmarkFiredOnce(id: string): void {
  firedOnce.delete(id)
}

export function clearFiredOnce(): void {
  firedOnce.clear()
}
