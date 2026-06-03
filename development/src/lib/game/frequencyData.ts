export interface FrequencyData {
  highCard: number
  onePair: number
  twoPair: number
  threeOfAKind: number
  straight: number
  flush: number
  fullHouse: number
  fourOfAKind: number
  straightFlush: number
  wins: number
  losses: number
  ties: number
  folds: number
  total: number
}

export function createFrequencyData(): FrequencyData {
  return {
    highCard: 0, onePair: 0, twoPair: 0, threeOfAKind: 0,
    straight: 0, flush: 0, fullHouse: 0, fourOfAKind: 0, straightFlush: 0,
    wins: 0, losses: 0, ties: 0, folds: 0, total: 0,
  }
}

const HAND_NAME_MAP: Record<string, keyof FrequencyData> = {
  'High Card':        'highCard',
  'Pair':             'onePair',
  'Two Pair':         'twoPair',
  'Three of a Kind':  'threeOfAKind',
  'Straight':         'straight',
  'Flush':            'flush',
  'Full House':       'fullHouse',
  'Four of a Kind':   'fourOfAKind',
  'Straight Flush':   'straightFlush',
}

export function updateFrequencyData(
  data: FrequencyData,
  handName: string,
  outcome: 'win' | 'loss' | 'tie' | 'fold'
): FrequencyData {
  const next = { ...data }
  if (outcome === 'fold') {
    next.folds++
  } else {
    const key = HAND_NAME_MAP[handName]
    if (key) (next[key] as number)++
    if (outcome === 'win') next.wins++
    else if (outcome === 'loss') next.losses++
    else next.ties++
  }
  next.total++
  return next
}

export function freqPct(count: number, total: number): string {
  if (total === 0) return '—'
  return (count / total * 100).toFixed(1) + '%'
}
