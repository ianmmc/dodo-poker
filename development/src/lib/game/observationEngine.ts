export interface HandSummary {
  handNumber: number
  drawCount: number   // -1 = folded before draw; 0 = stood pat; 1–5 = cards drawn
  outcome: 'win' | 'loss' | 'tie' | 'fold'
}

interface ObservationRule {
  id: string
  minHands: number
  check: (log: HandSummary[]) => boolean
  dialogNodeId: string
}

const RULES: ObservationRule[] = [
  {
    id: 'fold-streak',
    minHands: 3,
    check: log => {
      const last3 = log.slice(-3)
      return last3.length === 3 && last3.every(h => h.outcome === 'fold')
    },
    dialogNodeId: 't1a-obs-fold-streak',
  },
  {
    id: 'loss-streak',
    minHands: 3,
    check: log => {
      const last3 = log.slice(-3)
      return last3.length === 3 && last3.every(h => h.outcome === 'loss')
    },
    dialogNodeId: 't1a-obs-loss-streak',
  },
  {
    id: 'max-draw',
    minHands: 3,
    check: log => {
      const drawHands = log.filter(h => h.drawCount >= 0)
      const last3 = drawHands.slice(-3)
      return last3.length === 3 && last3.every(h => h.drawCount >= 4)
    },
    dialogNodeId: 't1a-obs-max-draw',
  },
]

const firedRules = new Set<string>()

// Returns dialog node IDs whose coaching should be enqueued (each fires at most once)
export function checkObservationRules(log: HandSummary[]): string[] {
  return RULES
    .filter(rule => !firedRules.has(rule.id) && log.length >= rule.minHands && rule.check(log))
    .map(rule => {
      firedRules.add(rule.id)
      return rule.dialogNodeId
    })
}

export function restoreFiredRules(ids: string[]): void {
  ids.forEach(id => firedRules.add(id))
}

export function getFiredRules(): string[] {
  return [...firedRules]
}

export function clearFiredRules(): void {
  firedRules.clear()
}
