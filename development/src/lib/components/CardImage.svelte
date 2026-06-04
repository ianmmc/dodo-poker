<script lang="ts">
  import { cardToSvgPath, CARD_BACK_PATH, cardAltText } from '../game/card'
  import type { Card } from '../game/card'

  export let card: Card | null = null
  export let faceDown = false
  export let selected = false
  export let clickable = false
  // Animation state for NPC discard phase.
  // 'idle'      — normal display
  // 'slide-out' — card back slides upward and disappears
  // 'empty'     — invisible placeholder holding the layout slot open
  // 'deal-in'   — replacement card pops in from above
  export let animState: 'idle' | 'slide-out' | 'empty' | 'deal-in' = 'idle'
</script>

{#if clickable}
  <button
    class="card"
    class:selected
    class:clickable
    on:click
    aria-pressed={selected}
  >
    {#if faceDown || !card}
      <img src={CARD_BACK_PATH} alt="Card (face down)" />
    {:else}
      <img src={cardToSvgPath(card)} alt={cardAltText(card)} />
    {/if}
  </button>
{:else}
  <div
    class="card"
    class:face-down={faceDown || !card}
    class:anim-slide-out={animState === 'slide-out'}
    class:anim-empty={animState === 'empty'}
    class:anim-deal-in={animState === 'deal-in'}
    role="img"
    aria-label={faceDown || !card ? 'Card (face down)' : card ? cardAltText(card) : 'Card'}
  >
    {#if faceDown || !card}
      <img src={CARD_BACK_PATH} alt="" aria-hidden="true" />
    {:else}
      <img src={cardToSvgPath(card)} alt="" aria-hidden="true" />
    {/if}
  </div>
{/if}

<style>
  .card {
    background: none;
    border: 3px solid transparent;
    border-radius: 6px;
    cursor: default;
    padding: 0;
    transition: transform 0.1s, border-color 0.1s;
  }
  .card img {
    display: block;
    width: 80px;
    height: auto;
    border-radius: 4px;
  }
  .clickable {
    cursor: pointer;
  }
  .clickable:hover {
    transform: translateY(-6px);
  }
  .selected {
    border-color: #e04a2f;
    transform: translateY(-10px);
  }

  /* ── NPC discard animation states ───────────────────────────────────── */

  .anim-slide-out {
    animation: npc-slide-out var(--npc-slide-ms, 300ms) ease-in forwards;
    pointer-events: none;
  }

  /* Invisible but keeps the slot in the layout so remaining cards don't reflow */
  .anim-empty {
    opacity: 0;
    pointer-events: none;
  }

  .anim-deal-in {
    animation: npc-deal-in 150ms ease-out both;
    pointer-events: none;
  }

  @keyframes npc-slide-out {
    from { transform: translateY(0);      opacity: 1; }
    to   { transform: translateY(-100px); opacity: 0; }
  }

  @keyframes npc-deal-in {
    from { transform: translateY(-28px) scale(0.85); opacity: 0; }
    to   { transform: translateY(0)     scale(1);    opacity: 1; }
  }
</style>
