import type { Card } from './card'

export interface ScriptedDeal {
  playerCards: Card[]
  npcCards: Card[]
}

// Scripts are indexed by ID; referenced via followUp.dealScriptedHand in dialog nodes
const SCRIPTS: Record<string, ScriptedDeal> = {
  't1a-script-strong': {
    playerCards: ['Ah', 'Ad', 'Ac', 'As', 'Kh'],
    npcCards:    ['2c', '5d', '7h', '9s', 'Jc'],
  },
}

export function getScriptedDeal(id: string): ScriptedDeal | null {
  return SCRIPTS[id] ?? null
}
