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

const nodes = new Map<string, DialogNode>()
const firedOnce = new Set<string>()

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
  if (firedOnce.has('t1a-pattern-001') || handsPlayed < 3) return []
  firedOnce.add('t1a-pattern-001')
  return chain('t1a-pattern-001')
}

export function getGamblersReveal(handsPlayed: number): DialogNode[] {
  if (firedOnce.has('t1a-fallacy-001') || handsPlayed < 8) return []
  firedOnce.add('t1a-fallacy-001')
  return chain('t1a-fallacy-001')
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

export function getTable1bPostHandNode(outcome: 'win' | 'loss' | 'fold'): DialogNode | null {
  const pool = outcome === 'win' ? 't1b-post-win'
    : outcome === 'fold' ? 't1b-post-fold'
    : 't1b-post-loss'
  return fromPool(pool)
}

export function getTable1bHankActionNode(action: 'call' | 'bet'): DialogNode | null {
  return nodes.get(`t1b-hank-${action}`) ?? null
}

export function getTable1bHankDrawNode(count: number): DialogNode | null {
  const id = count === 0 ? 't1b-hank-draw-0' : `t1b-hank-draw-${Math.min(count, 3)}`
  return nodes.get(id) ?? null
}

export function getLuckyDue(consecutiveLosses: number): DialogNode[] {
  if (firedOnce.has('t1b-lucky-due') || consecutiveLosses < 3) return []
  firedOnce.add('t1b-lucky-due')
  return chain('t1b-lucky-due')
}

export function getSurveillanceRoomIntro(handsAt1B: number): DialogNode[] {
  if (firedOnce.has('t1b-surv-intro-001') || handsAt1B < 10) return []
  firedOnce.add('t1b-surv-intro-001')
  return chain('t1b-surv-intro-001')
}

export function getSurveillanceRoomReturn(): DialogNode[] {
  if (firedOnce.has('t1b-surv-return-001')) return []
  firedOnce.add('t1b-surv-return-001')
  return chain('t1b-surv-return-001')
}

export function getTable1bAssessment(handsAt1B: number, surveillanceRoomVisited: boolean): DialogNode[] {
  if (firedOnce.has('t1b-assess-intro') || handsAt1B < 18 || !surveillanceRoomVisited) return []
  firedOnce.add('t1b-assess-intro')
  return chain('t1b-assess-intro')
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
