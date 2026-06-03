<script lang="ts">
  import type { GameState } from '../game/fiveCardDraw'
  import type { AssessmentRecord } from '../game/assessment'

  export let open: boolean = false
  export let game: GameState
  export let screen: string
  export let gatePassedAt1A: boolean
  export let gatePassedAt1B: boolean = false
  export let assessmentLog: AssessmentRecord[] = []

  export let onClose: () => void = () => {}
  export let onJumpToHand: (n: number) => void = () => {}
  export let onJumpToTable: (table: string) => void = () => {}
  export let onPassAssessment: (nodeId: string, firedOnceId: string | null) => void = () => {}
  export let onPassGate: () => void = () => {}
  export let onPassAllAssessments: () => void = () => {}
  export let onDumpState: () => void = () => {}
  export let onClearSave: () => void = () => {}
  export let onForceNode: (id: string) => void = () => {}

  let jumpHandInput = ''
  let forceNodeInput = ''

  $: hankPassed = assessmentLog.some(r => r.nodeId === 't1a-assess-hank-001')
  $: gamblersPassed = assessmentLog.some(r => r.nodeId === 't1a-assess-gamblers-001')
  $: transferPassed = assessmentLog.some(r => r.nodeId === 't1a-assess-transfer-001')
  $: procPassed = assessmentLog.some(r => r.nodeId === 't1b-assess-proc')
  $: conceptualPassed = assessmentLog.some(r => r.nodeId === 't1b-assess-conceptual')
  $: lnnPassed = assessmentLog.some(r => r.nodeId === 't1b-assess-transfer')
  $: at1B = screen === 'table1b'

  function handleJumpToHand() {
    const n = parseInt(jumpHandInput, 10)
    if (isNaN(n) || n < 0) return
    onJumpToHand(n)
    jumpHandInput = ''
  }

  function handleForceNode() {
    const id = forceNodeInput.trim()
    if (!id) return
    onForceNode(id)
    forceNodeInput = ''
  }
</script>

{#if open}
  <!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
  <div class="dev-backdrop" on:click|self={onClose}>
    <div class="dev-panel">

      <div class="dev-header">
        <span class="dev-title">⚙ Dev Tools</span>
        <span class="dev-state-info">{screen} · played:{game.handsPlayed} · hand:{game.handNumber} · seeds:{game.playerSeeds}</span>
        <button class="dev-close" on:click={onClose}>✕</button>
      </div>

      <div class="dev-body">

        <!-- Jump to Hand -->
        <section class="dev-section">
          <h3 class="dev-section-title">Jump to Hand</h3>
          <p class="dev-hint">Sets handsPlayed and deals a new hand. Triggers fire if not already fired.</p>
          <div class="dev-row">
            <input
              class="dev-input"
              type="number"
              min="0"
              placeholder="handsPlayed value"
              bind:value={jumpHandInput}
              on:keydown={e => e.key === 'Enter' && handleJumpToHand()}
            />
            <button class="dev-btn" on:click={handleJumpToHand}>Apply</button>
          </div>
          {#if at1B}
          <div class="dev-row wrap">
            <button class="dev-btn preset" on:click={() => onJumpToHand(10)} title="handsAt1B=10 — triggers Surveillance Room intro if not fired">
              handsAt1B=10 (Surv. Room)
            </button>
            <button class="dev-btn preset" on:click={() => onJumpToHand(18)} title="handsAt1B=18 — triggers assessment gate (sets surveillanceRoomVisited=true)">
              handsAt1B=18 (Assessment)
            </button>
          </div>
          {:else}
          <div class="dev-row wrap">
            <button class="dev-btn preset" on:click={() => onJumpToHand(3)} title="handsPlayed=3 — triggers Hank pattern if not fired">
              handsPlayed=3 (Hank pattern)
            </button>
            <button class="dev-btn preset" on:click={() => onJumpToHand(8)} title="handsPlayed=8 — triggers gambler's fallacy if not fired">
              handsPlayed=8 (Gambler's fallacy)
            </button>
          </div>
          {/if}
        </section>

        <!-- Jump to Table -->
        <section class="dev-section">
          <h3 class="dev-section-title">Jump to Table / Screen</h3>
          <div class="dev-row wrap">
            <button class="dev-btn" class:active={screen === 'title'}    on:click={() => onJumpToTable('title')}>Title</button>
            <button class="dev-btn" class:active={screen === 'avatar'}   on:click={() => onJumpToTable('avatar')}>Avatar</button>
            <button class="dev-btn" class:active={screen === 'intro'}    on:click={() => onJumpToTable('intro')}>Intro</button>
            <button class="dev-btn" class:active={screen === 'table'}    on:click={() => onJumpToTable('table')}>Table 1A</button>
            <button class="dev-btn" class:active={screen === 'table1b'}  on:click={() => onJumpToTable('table1b')}>Table 1B</button>
          </div>
        </section>

        <!-- Assessment State -->
        <section class="dev-section">
          <h3 class="dev-section-title">Assessment State</h3>
          {#if at1B}
          <div class="dev-assessment-list">
            <div class="dev-assessment-row">
              <span class="dev-status" class:passed={procPassed}>{procPassed ? '✓' : '○'}</span>
              <span class="dev-assess-label">Procedural numeric (rel. frequency)</span>
              <code class="dev-nodeid">t1b-assess-proc</code>
              {#if !procPassed}
                <button class="dev-btn small" on:click={() => onPassAssessment('t1b-assess-proc', 't1b-assess-intro')}>Pass</button>
              {/if}
            </div>
            <div class="dev-assessment-row">
              <span class="dev-status" class:passed={conceptualPassed}>{conceptualPassed ? '✓' : '○'}</span>
              <span class="dev-assess-label">Conceptual checklist (Lucky rebuttal)</span>
              <code class="dev-nodeid">t1b-assess-conceptual</code>
              {#if !conceptualPassed}
                <button class="dev-btn small" on:click={() => onPassAssessment('t1b-assess-conceptual', null)}>Pass</button>
              {/if}
            </div>
            <div class="dev-assessment-row">
              <span class="dev-status" class:passed={lnnPassed}>{lnnPassed ? '✓' : '○'}</span>
              <span class="dev-assess-label">Transfer checklist (LLN)</span>
              <code class="dev-nodeid">t1b-assess-transfer</code>
              {#if !lnnPassed}
                <button class="dev-btn small" on:click={() => { onPassAssessment('t1b-assess-transfer', null); onPassGate(); }}>Pass</button>
              {/if}
            </div>
            <div class="dev-assessment-row gate-row">
              <span class="dev-status" class:passed={gatePassedAt1B}>{gatePassedAt1B ? '✓' : '○'}</span>
              <span class="dev-assess-label">Gate (Table 1B → 2A CTA)</span>
              <code class="dev-nodeid">gatePassedAt1B</code>
              {#if !gatePassedAt1B}
                <button class="dev-btn small" on:click={onPassGate}>Set</button>
              {/if}
            </div>
          </div>
          {:else}
          <div class="dev-assessment-list">
            <div class="dev-assessment-row">
              <span class="dev-status" class:passed={hankPassed}>{hankPassed ? '✓' : '○'}</span>
              <span class="dev-assess-label">Hank pattern checklist</span>
              <code class="dev-nodeid">t1a-assess-hank-001</code>
              {#if !hankPassed}
                <button class="dev-btn small" on:click={() => onPassAssessment('t1a-assess-hank-001', 't1a-pattern-001')}>Pass</button>
              {/if}
            </div>
            <div class="dev-assessment-row">
              <span class="dev-status" class:passed={gamblersPassed}>{gamblersPassed ? '✓' : '○'}</span>
              <span class="dev-assess-label">Gambler's fallacy checklist</span>
              <code class="dev-nodeid">t1a-assess-gamblers-001</code>
              {#if !gamblersPassed}
                <button class="dev-btn small" on:click={() => onPassAssessment('t1a-assess-gamblers-001', 't1a-fallacy-001')}>Pass</button>
              {/if}
            </div>
            <div class="dev-assessment-row">
              <span class="dev-status" class:passed={transferPassed}>{transferPassed ? '✓' : '○'}</span>
              <span class="dev-assess-label">Transfer checklist</span>
              <code class="dev-nodeid">t1a-assess-transfer-001</code>
              {#if !transferPassed}
                <button class="dev-btn small" on:click={() => { onPassAssessment('t1a-assess-transfer-001', null); onPassGate(); }}>Pass</button>
              {/if}
            </div>
            <div class="dev-assessment-row gate-row">
              <span class="dev-status" class:passed={gatePassedAt1A}>{gatePassedAt1A ? '✓' : '○'}</span>
              <span class="dev-assess-label">Gate (Table 1A → 1B CTA)</span>
              <code class="dev-nodeid">gatePassedAt1A</code>
              {#if !gatePassedAt1A}
                <button class="dev-btn small" on:click={onPassGate}>Set</button>
              {/if}
            </div>
          </div>
          {/if}
          <div class="dev-row" style="margin-top: 8px">
            <button class="dev-btn accent" on:click={onPassAllAssessments}>Pass all + set gate</button>
          </div>
        </section>

        <!-- State Tools -->
        <section class="dev-section">
          <h3 class="dev-section-title">State Tools</h3>
          <div class="dev-row wrap">
            <button class="dev-btn" on:click={onDumpState}>Dump state → console</button>
            <button class="dev-btn danger" on:click={onClearSave}>Clear localStorage save</button>
          </div>
        </section>

        <!-- Force Dialog Node -->
        <section class="dev-section">
          <h3 class="dev-section-title">Force Dialog Node</h3>
          <p class="dev-hint">Enter a node ID to enqueue it immediately. Follows the chain from that node.</p>
          <div class="dev-row">
            <input
              class="dev-input wide"
              type="text"
              placeholder="e.g. t1a-fallacy-001"
              bind:value={forceNodeInput}
              on:keydown={e => e.key === 'Enter' && handleForceNode()}
            />
            <button class="dev-btn" on:click={handleForceNode}>Enqueue</button>
          </div>
        </section>

      </div>
    </div>
  </div>
{/if}

<style>
  .dev-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.72);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9000;
  }

  .dev-panel {
    background: #14141e;
    border: 1px solid #ff8c42;
    border-radius: 10px;
    width: min(640px, calc(100vw - 32px));
    max-height: calc(100vh - 64px);
    display: flex;
    flex-direction: column;
    box-shadow: 0 16px 60px rgba(0, 0, 0, 0.8);
    overflow: hidden;
  }

  .dev-header {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: #1e1e2e;
    border-bottom: 1px solid #2a2a3e;
    flex-shrink: 0;
  }

  .dev-title {
    font-size: 0.85rem;
    font-weight: bold;
    color: #ff8c42;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .dev-state-info {
    flex: 1;
    font-size: 0.72rem;
    color: #6a6a8a;
    font-family: monospace;
  }

  .dev-close {
    background: none;
    border: none;
    color: #6a6a8a;
    cursor: pointer;
    font-size: 1rem;
    padding: 2px 6px;
    border-radius: 4px;
    transition: color 0.1s;
  }
  .dev-close:hover { color: #f0ead6; }

  .dev-body {
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .dev-section {
    border: 1px solid #2a2a3e;
    border-radius: 6px;
    padding: 12px 14px;
  }

  .dev-section-title {
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #ff8c42;
    font-weight: normal;
    margin-bottom: 8px;
  }

  .dev-hint {
    font-size: 0.75rem;
    color: #4a4a6a;
    margin-bottom: 8px;
    font-style: italic;
  }

  .dev-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .dev-row.wrap { flex-wrap: wrap; }

  .dev-input {
    background: #0e0e1a;
    border: 1px solid #3a3a5a;
    color: #d4c89a;
    border-radius: 4px;
    padding: 6px 10px;
    font-size: 0.82rem;
    font-family: monospace;
    width: 160px;
  }
  .dev-input.wide { flex: 1; width: auto; }
  .dev-input:focus { outline: none; border-color: #ff8c42; }

  .dev-btn {
    background: #1e1e2e;
    border: 1px solid #3a3a5a;
    color: #c8c8e8;
    border-radius: 4px;
    padding: 6px 12px;
    font-size: 0.8rem;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.1s, border-color 0.1s;
    white-space: nowrap;
  }
  .dev-btn:hover { background: #26263a; border-color: #5a5a7a; }
  .dev-btn.preset { font-size: 0.76rem; color: #9a9ab8; }
  .dev-btn.small { padding: 4px 8px; font-size: 0.74rem; }
  .dev-btn.accent { border-color: #ff8c42; color: #ff8c42; }
  .dev-btn.accent:hover { background: #1e1a10; }
  .dev-btn.danger { border-color: #c84a4a; color: #c84a4a; }
  .dev-btn.danger:hover { background: #1e1010; }
  .dev-btn.active { border-color: #7a7aaa; background: #26263a; }

  .dev-assessment-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .dev-assessment-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    background: #0e0e1a;
    border-radius: 4px;
    border: 1px solid #1e1e2e;
  }
  .dev-assessment-row.gate-row {
    border-color: #2a2a3e;
    background: #10101c;
  }

  .dev-status {
    font-size: 0.85rem;
    color: #4a4a6a;
    flex-shrink: 0;
    width: 16px;
    text-align: center;
  }
  .dev-status.passed { color: #4ac84a; }

  .dev-assess-label {
    font-size: 0.78rem;
    color: #9a9ab8;
    flex: 1;
  }

  .dev-nodeid {
    font-size: 0.68rem;
    color: #4a4a6a;
    font-family: monospace;
    flex-shrink: 0;
  }
</style>
