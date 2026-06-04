<script lang="ts">
  import { cardToSvgPath, CARD_BACK_PATH, cardAltText } from '../game/card'
  import type { Card } from '../game/card'

  export let card: Card | null = null
  export let faceDown = false
  export let selected = false
  export let clickable = false
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
</style>
