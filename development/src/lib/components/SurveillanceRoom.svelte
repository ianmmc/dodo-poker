<script lang="ts">
  import { onDestroy } from 'svelte'
  import { runCardDrawSim } from '../game/simulationEngine'
  import type { CardDrawSim } from '../game/simulationEngine'

  export let onReturn: () => void

  // ── Sim state ────────────────────────────────────────────────────────────

  type SimStatus = 'idle' | 'running' | 'complete'

  let status: SimStatus = 'idle'
  let simResult: CardDrawSim | null = null
  let selectedN = 0

  // ── Animation state ──────────────────────────────────────────────────────

  let animatedCount = 0         // hand counter displayed during animation
  let animatedPoints: number[] = []   // progressive graph points
  let animRafId: number | null = null
  let animStart: number | null = null
  const ANIM_DURATION_MS = 2400

  const CHART_W = 500
  const CHART_H = 180

  function svgPath(pts: number[]): string {
    if (pts.length < 2) return ''
    return pts.map((y, i) => {
      const px = (i / (pts.length - 1)) * CHART_W
      const py = (1 - y) * CHART_H
      return `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`
    }).join(' ')
  }

  function easeOut(t: number): number {
    return 1 - Math.pow(1 - t, 2)
  }

  function animateFrame(timestamp: number): void {
    if (!simResult) return
    if (animStart === null) animStart = timestamp

    const elapsed = timestamp - animStart
    const t = Math.min(elapsed / ANIM_DURATION_MS, 1)
    const progress = easeOut(t)

    animatedCount = Math.round(progress * simResult.totalDraws)
    const ptCount = Math.round(progress * simResult.sampledPoints.length)
    animatedPoints = simResult.sampledPoints.slice(0, Math.max(1, ptCount))

    if (t < 1) {
      animRafId = requestAnimationFrame(animateFrame)
    } else {
      animatedCount = simResult.totalDraws
      animatedPoints = simResult.sampledPoints
      status = 'complete'
      animRafId = null
    }
  }

  function startSim(n: number): void {
    if (animRafId !== null) cancelAnimationFrame(animRafId)
    animStart = null
    animatedCount = 0
    animatedPoints = []
    selectedN = n
    status = 'running'
    simResult = runCardDrawSim(n)
    animRafId = requestAnimationFrame(animateFrame)
  }

  onDestroy(() => {
    if (animRafId !== null) cancelAnimationFrame(animRafId)
  })

  // ── Reactive display values ──────────────────────────────────────────────

  $: path = svgPath(animatedPoints)

  $: finalFreq = simResult && status === 'complete'
    ? (simResult.finalFreq * 100).toFixed(1)
    : null

  $: cdComment = (() => {
    if (status !== 'complete' || !simResult) return null
    if (simResult.totalDraws >= 10000)
      return 'Right there. The line found its home. That\'s what the math predicts — 50%. The Law of Large Numbers.'
    if (simResult.totalDraws >= 1000)
      return 'Getting closer. The line is stabilizing. Run 10,000 to see it lock in.'
    return 'Still noisy. A hundred draws isn\'t enough to see the pattern. Run more.'
  })()

  // Cards for streaming animation — 18 cards with staggered delays
  const CARD_COUNT = 18
  const cards = Array.from({ length: CARD_COUNT }, (_, i) => ({
    delay: (i / CARD_COUNT) * 1.4,   // stagger 0s–1.4s
    duration: 0.9 + Math.random() * 0.4,
    top: 52 + Math.floor(Math.random() * 28),   // 52–80% of strip height
  }))
</script>

<div class="surv-screen">
  <div class="surv-header">
    <div class="surv-title">The Surveillance Room</div>
    <button class="back-btn" on:click={onReturn}>← Return to Table 1B</button>
  </div>

  <div class="surv-body">
    <div class="surv-intro">
      <p class="intro-text">
        The Nest's surveillance system can replay draws at any speed.
        Each simulation draws one card at a time from a standard 52-card deck, notes the suit color,
        then puts it back and reshuffles before the next draw.
      </p>
      <p class="intro-text">
        The graph shows the <strong>running frequency of red cards</strong> — how often red has appeared
        so far, as a fraction of total draws. There are 26 red cards in a 52-card deck,
        so the theoretical probability is <strong>26/52 = 50%</strong>.
        Watch what happens to that line over thousands of draws.
      </p>
    </div>

    <div class="sim-controls">
      <button
        class="sim-btn"
        disabled={status === 'running'}
        on:click={() => startSim(100)}
      >Draw 100 cards</button>
      <button
        class="sim-btn"
        disabled={status === 'running'}
        on:click={() => startSim(1000)}
      >Draw 1,000 cards</button>
      <button
        class="sim-btn primary"
        disabled={status === 'running'}
        on:click={() => startSim(10000)}
      >Draw 10,000 cards</button>
    </div>

    <!-- Animation stage: Chief Dodo + card stream -->
    {#if status === 'running' || status === 'complete'}
      <div class="stage">
        <!-- Card stream (behind Chief Dodo) -->
        {#if status === 'running'}
          <div class="card-stream" aria-hidden="true">
            {#each cards as card}
              <div
                class="flying-card"
                style="
                  animation-delay: {card.delay}s;
                  animation-duration: {card.duration}s;
                  top: {card.top}%;
                "
              ></div>
            {/each}
          </div>
        {/if}

        <!-- Chief Dodo portrait -->
        <div class="cd-portrait" class:cd-visible={status === 'running' || status === 'complete'}>
          <img src="/chief-dodo.png" alt="Chief Dodo" />
        </div>

        <!-- Hand counter -->
        <div class="counter-area">
          <span class="counter-label">Draws</span>
          <span class="counter-value">{animatedCount.toLocaleString()}</span>
          {#if status === 'complete' && finalFreq !== null}
            <span class="counter-freq">Running freq: <strong>{finalFreq}%</strong></span>
          {/if}
        </div>
      </div>
    {/if}

    <!-- Progressive chart -->
    {#if animatedPoints.length > 0}
      <div class="chart-area">
        <div class="y-label-wrap">
          <span class="y-label">Freq of red</span>
        </div>
        <svg
          class="chart-svg"
          viewBox="0 0 {CHART_W} {CHART_H}"
          preserveAspectRatio="none"
          aria-label="Running frequency of red cards"
        >
          <line x1="0" y1={CHART_H * 0.25} x2={CHART_W} y2={CHART_H * 0.25} class="grid-line" />
          <line x1="0" y1={CHART_H * 0.5}  x2={CHART_W} y2={CHART_H * 0.5}  class="grid-line ref-line" />
          <line x1="0" y1={CHART_H * 0.75} x2={CHART_W} y2={CHART_H * 0.75} class="grid-line" />
          <path d={path} class="data-line" />
        </svg>
        <div class="y-labels">
          <span>100%</span>
          <span>75%</span>
          <span class="ref-label">50% ← 26/52</span>
          <span>25%</span>
          <span>0%</span>
        </div>
      </div>

      {#if status === 'complete' && simResult}
        <div class="sim-stats">
          <span class="stat">Draws: <strong>{simResult.totalDraws.toLocaleString()}</strong></span>
          <span class="stat stat-red">Red: <strong>{simResult.redCount.toLocaleString()}</strong></span>
          <span class="stat stat-black">Black: <strong>{simResult.blackCount.toLocaleString()}</strong></span>
          <span class="stat">Running frequency: <strong class="freq-val">{finalFreq}%</strong></span>
        </div>

        <!-- Chief Dodo commentary -->
        {#if cdComment}
          <div class="cd-commentary">
            <div class="cd-comment-portrait">
              <img src="/chief-dodo.png" alt="Chief Dodo" />
            </div>
            <div class="cd-comment-bubble">
              <span class="cd-comment-speaker">Chief Dodo</span>
              <p class="cd-comment-text">"{cdComment}"</p>
            </div>
          </div>
        {/if}

        <div class="observation-box">
          <p class="obs-text">
            {#if simResult.totalDraws >= 10000}
              After {simResult.totalDraws.toLocaleString()} draws, the running frequency settled near <strong>50%</strong> — just as the deck's composition predicts.
              The Law of Large Numbers: over enough trials, relative frequency converges toward the theoretical probability.
              Any single draw is still 26 out of 52. The deck doesn't remember what just came up.
            {:else if simResult.totalDraws >= 1000}
              After {simResult.totalDraws.toLocaleString()} draws, the line is getting closer to 50%.
              Draw 10,000 cards to see the full convergence.
            {:else}
              After {simResult.totalDraws} draws, the frequency is still moving around a lot.
              Run more to see what happens over the long run.
            {/if}
          </p>
        </div>
      {/if}
    {:else if status === 'idle'}
      <div class="empty-state">
        <p>Run a simulation to see the convergence graph.</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .surv-screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #111a11;
    color: #f0ead6;
  }

  .surv-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #0a120a;
    padding: 14px 28px;
    border-bottom: 1px solid #1e3a1e;
  }

  .surv-title {
    font-size: 1.1rem;
    color: #c8a84a;
    letter-spacing: 0.06em;
  }

  .back-btn {
    background: #1e2e1e;
    border: 1px solid #3a5a3a;
    border-radius: 6px;
    color: #f0ead6;
    font-family: inherit;
    font-size: 0.88rem;
    padding: 8px 16px;
    cursor: pointer;
    transition: background 0.12s;
  }
  .back-btn:hover { background: #263626; }

  .surv-body {
    flex: 1;
    padding: 28px 40px;
    display: flex;
    flex-direction: column;
    gap: 22px;
    max-width: 780px;
    margin: 0 auto;
    width: 100%;
  }

  .intro-text {
    font-size: 0.95rem;
    line-height: 1.65;
    color: #d4c89a;
    margin-bottom: 4px;
  }
  .intro-text strong { color: #c8a84a; }

  .sim-controls {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .sim-btn {
    background: #1e2e1e;
    border: 1px solid #3a5a3a;
    border-radius: 6px;
    color: #f0ead6;
    font-family: inherit;
    font-size: 0.92rem;
    padding: 10px 20px;
    cursor: pointer;
    transition: background 0.12s, border-color 0.12s;
  }
  .sim-btn:hover:not(:disabled) { background: #263626; border-color: #4a7a4a; }
  .sim-btn.primary { border-color: #c8a84a; color: #c8a84a; }
  .sim-btn.primary:hover:not(:disabled) { background: #1e2a12; }
  .sim-btn:disabled { opacity: 0.45; cursor: not-allowed; }

  /* ── Animation stage ─────────────────────────────────────────────────── */

  .stage {
    position: relative;
    height: 110px;
    background: #0d160d;
    border: 1px solid #1e3a1e;
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    gap: 0;
  }

  /* Card stream — behind the portrait */
  .card-stream {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
  }

  .flying-card {
    position: absolute;
    width: 28px;
    height: 38px;
    left: -36px;
    border-radius: 3px;
    background: linear-gradient(135deg, #2a3a2a 0%, #1a2a1a 100%);
    border: 1px solid #3a5a3a;
    /* Inner pip pattern on the card back */
    box-shadow: inset 0 0 0 3px #1a2a1a, inset 0 0 0 4px #2a3a2a;
    animation: fly-card linear infinite;
    transform: rotate(-4deg);
  }

  @keyframes fly-card {
    0%   { left: -36px; opacity: 0; }
    8%   { opacity: 1; }
    92%  { opacity: 1; }
    100% { left: calc(100% + 36px); opacity: 0; }
  }

  /* Chief Dodo portrait — foreground */
  .cd-portrait {
    position: relative;
    z-index: 2;
    height: 100%;
    display: flex;
    align-items: flex-end;
    padding-left: 16px;
    opacity: 0;
    transition: opacity 0.4s ease;
    flex-shrink: 0;
  }
  .cd-portrait.cd-visible { opacity: 1; }
  .cd-portrait img {
    height: 96px;
    width: auto;
    object-fit: contain;
    display: block;
    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.6));
  }

  /* Counter — right side of stage */
  .counter-area {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    text-align: right;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .counter-label {
    font-size: 0.68rem;
    color: #4a6a4a;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .counter-value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #c8a84a;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }
  .counter-freq {
    font-size: 0.78rem;
    color: #7a8a6a;
    margin-top: 4px;
  }
  .counter-freq strong { color: #c87a7a; }

  /* ── Chart ───────────────────────────────────────────────────────────── */

  .chart-area {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .y-label-wrap {
    display: flex;
    align-items: center;
    height: 180px;
  }

  .y-label {
    font-size: 0.62rem;
    color: #5a8a5a;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .chart-svg {
    flex: 1;
    height: 180px;
    background: #0a120a;
    border: 1px solid #1e3a1e;
    border-radius: 4px;
    display: block;
  }

  .y-labels {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 180px;
    font-size: 0.62rem;
    color: #5a8a5a;
    padding: 2px 0;
    white-space: nowrap;
  }
  .y-labels .ref-label { color: #6a9a6a; font-weight: bold; }

  .grid-line {
    stroke: #1e3a1e;
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }
  .ref-line {
    stroke: #2a5a2a;
    stroke-dasharray: 4 3;
    stroke-width: 1.5;
  }
  .data-line {
    fill: none;
    stroke: #c87a7a;
    stroke-width: 1.5;
    vector-effect: non-scaling-stroke;
  }

  /* ── Stats & commentary ─────────────────────────────────────────────── */

  .sim-stats {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
    font-size: 0.88rem;
  }
  .stat { color: #7a8a6a; }
  .stat strong { color: #f0ead6; }
  .stat-red strong  { color: #c87a7a; }
  .stat-black strong { color: #a0a0b0; }
  .freq-val { color: #c8a84a; }

  /* Chief Dodo commentary after completion */
  .cd-commentary {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    background: rgba(200, 168, 74, 0.06);
    border: 1px solid rgba(200, 168, 74, 0.2);
    border-radius: 8px;
    padding: 14px 16px;
    animation: fade-in 0.5s ease;
  }

  @keyframes fade-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .cd-comment-portrait img {
    height: 56px;
    width: auto;
    object-fit: contain;
    display: block;
    flex-shrink: 0;
  }

  .cd-comment-bubble {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .cd-comment-speaker {
    font-size: 0.72rem;
    color: #c8a84a;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .cd-comment-text {
    font-size: 0.95rem;
    color: #d4c89a;
    line-height: 1.55;
    font-style: italic;
    margin: 0;
  }

  .observation-box {
    background: rgba(200, 168, 74, 0.07);
    border: 1px solid rgba(200, 168, 74, 0.25);
    border-radius: 6px;
    padding: 14px 18px;
  }
  .obs-text {
    font-style: italic;
    color: #d4c89a;
    line-height: 1.6;
    font-size: 0.95rem;
  }
  .obs-text strong { color: #c8a84a; font-style: normal; }

  .empty-state {
    padding: 32px;
    text-align: center;
    color: #4a6a4a;
    font-style: italic;
    font-size: 0.92rem;
  }
</style>
