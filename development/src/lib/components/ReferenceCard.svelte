<script lang="ts">
  export let open: boolean = false
  export let onToggle: () => void

  const HANDS = [
    {
      name: 'High Card',
      rarity: 'Common',
      rarityClass: 'common',
      desc: 'No matches, no sequence, no shared suit. Highest card plays.',
      cards: [
        '/svg-cards/ace_of_spades.svg',
        '/svg-cards/jack_of_hearts.svg',
        '/svg-cards/8_of_diamonds.svg',
        '/svg-cards/5_of_clubs.svg',
        '/svg-cards/3_of_spades.svg',
      ],
    },
    {
      name: 'One Pair',
      rarity: 'Common',
      rarityClass: 'common',
      desc: 'Two cards with the same number or letter.',
      cards: [
        '/svg-cards/10_of_spades.svg',
        '/svg-cards/10_of_hearts.svg',
        '/svg-cards/7_of_diamonds.svg',
        '/svg-cards/4_of_clubs.svg',
        '/svg-cards/2_of_spades.svg',
      ],
    },
    {
      name: 'Two Pair',
      rarity: 'Common',
      rarityClass: 'common',
      desc: 'Two different pairs of matching cards.',
      cards: [
        '/svg-cards/jack_of_spades.svg',
        '/svg-cards/jack_of_hearts.svg',
        '/svg-cards/8_of_diamonds.svg',
        '/svg-cards/8_of_clubs.svg',
        '/svg-cards/ace_of_spades.svg',
      ],
    },
    {
      name: 'Three of a Kind',
      rarity: 'Uncommon',
      rarityClass: 'uncommon',
      desc: 'Three cards with the same number or letter.',
      cards: [
        '/svg-cards/queen_of_spades.svg',
        '/svg-cards/queen_of_hearts.svg',
        '/svg-cards/queen_of_diamonds.svg',
        '/svg-cards/3_of_clubs.svg',
        '/svg-cards/7_of_spades.svg',
      ],
    },
    {
      name: 'Straight',
      rarity: 'Uncommon',
      rarityClass: 'uncommon',
      desc: 'Five cards in order, any suits.',
      cards: [
        '/svg-cards/5_of_hearts.svg',
        '/svg-cards/6_of_spades.svg',
        '/svg-cards/7_of_diamonds.svg',
        '/svg-cards/8_of_clubs.svg',
        '/svg-cards/9_of_spades.svg',
      ],
    },
    {
      name: 'Flush',
      rarity: 'Rare',
      rarityClass: 'rare',
      desc: 'Five cards of the same suit, in any order.',
      cards: [
        '/svg-cards/2_of_spades.svg',
        '/svg-cards/6_of_spades.svg',
        '/svg-cards/9_of_spades.svg',
        '/svg-cards/jack_of_spades.svg',
        '/svg-cards/ace_of_spades.svg',
      ],
    },
    {
      name: 'Full House',
      rarity: 'Rare',
      rarityClass: 'rare',
      desc: 'Three matching cards plus two matching cards.',
      cards: [
        '/svg-cards/king_of_spades.svg',
        '/svg-cards/king_of_hearts.svg',
        '/svg-cards/king_of_diamonds.svg',
        '/svg-cards/jack_of_spades.svg',
        '/svg-cards/jack_of_hearts.svg',
      ],
    },
    {
      name: 'Four of a Kind',
      rarity: 'Very rare',
      rarityClass: 'very-rare',
      desc: 'Four cards with the same number or letter.',
      cards: [
        '/svg-cards/ace_of_spades.svg',
        '/svg-cards/ace_of_hearts.svg',
        '/svg-cards/ace_of_diamonds.svg',
        '/svg-cards/ace_of_clubs.svg',
        '/svg-cards/king_of_spades.svg',
      ],
    },
    {
      name: 'Straight Flush',
      rarity: 'Very rare',
      rarityClass: 'very-rare',
      desc: 'Five cards in order, all the same suit.',
      cards: [
        '/svg-cards/9_of_spades.svg',
        '/svg-cards/10_of_spades.svg',
        '/svg-cards/jack_of_spades.svg',
        '/svg-cards/queen_of_spades.svg',
        '/svg-cards/king_of_spades.svg',
      ],
    },
  ]

  const GLOSSARY = [
    { term: 'Ante',  def: 'Seeds every player puts in before the deal, to start the pot.' },
    { term: 'Pot',   def: 'The total seeds in the middle — what you\'re playing for.' },
    { term: 'Bet',   def: 'Putting seeds in to claim the pot or make your opponent pay to continue.' },
    { term: 'Check', def: 'Passing without betting — you stay in for free, the pot doesn\'t grow.' },
    { term: 'Call',  def: 'Matching your opponent\'s bet to stay in the hand.' },
    { term: 'Fold',  def: 'Giving up your hand — your opponent wins the pot.' },
    { term: 'Draw',  def: 'Trading cards from your hand for new ones from the deck.' },
    { term: 'Hand',  def: 'In poker, your \'hand\' means specifically the cards you\'re playing.' },
  ]
</script>

<div class="panel" class:open>
  <button
    class="tab"
    on:click={onToggle}
    aria-label={open ? 'Close reference card' : 'Open reference card'}
  >
    Ref<br>Card
  </button>

  <div class="content">
    <div class="panel-header">
      <span class="panel-title">Reference Card</span>
      <button class="close-btn" on:click={onToggle} aria-label="Close">←</button>
    </div>
    <p class="panel-subtitle">Table 1 · Five Card Draw · Listed weakest to strongest. Best hand wins.</p>

    <div class="hand-list">
      {#each HANDS as { name, rarity, rarityClass, desc, cards }, i}
        <div class="hand-block">
          <div class="hand-meta">
            <span class="hand-rank">{i + 1}.</span>
            <span class="hand-name">{name}</span>
            <span class="rarity {rarityClass}">{rarity}</span>
          </div>
          <div class="card-strip">
            {#each cards as src}
              <img {src} alt="" class="card-img" />
            {/each}
          </div>
          <p class="hand-desc">{desc}</p>
        </div>
      {/each}
    </div>

    <p class="note">Straight Flush is the best — and rarest — hand you can hold.</p>

    <div class="glossary-section">
      <div class="glossary-header">Terms</div>
      <dl class="glossary-list">
        {#each GLOSSARY as { term, def }}
          <dt>{term}</dt>
          <dd>{def}</dd>
        {/each}
      </dl>
      <a
        class="glossary-link"
        href="https://en.wikipedia.org/wiki/Glossary_of_poker_terms"
        target="_blank"
        rel="noopener noreferrer"
      >Full poker glossary (Wikipedia) ↗</a>
    </div>
  </div>
</div>

<style>
  .panel {
    position: fixed;
    right: 0;
    top: 0;
    height: 100vh;
    width: 280px;
    background: #0d1a0d;
    border-left: 1px solid #1e3a1e;
    transform: translateX(100%);
    transition: transform 0.25s ease;
    z-index: 100;
    display: flex;
  }

  .panel.open {
    transform: translateX(0);
  }

  .tab {
    position: absolute;
    left: -30px;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    padding: 14px 0;
    background: #1e4a1e;
    border: 1px solid #3a7a3a;
    border-right: none;
    border-radius: 6px 0 0 6px;
    color: #a0d080;
    font-size: 0.6rem;
    font-family: inherit;
    cursor: pointer;
    text-align: center;
    line-height: 1.5;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    transition: background 0.12s;
  }

  .tab:hover {
    background: #285a28;
    color: #c0e8a0;
  }

  .content {
    flex: 1;
    overflow-y: auto;
    padding: 16px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .panel-title {
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #c8a84a;
  }

  .close-btn {
    background: none;
    border: none;
    color: #6a9a6a;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 2px 6px;
    font-family: inherit;
    transition: color 0.12s;
  }
  .close-btn:hover { color: #c8a84a; }

  .panel-subtitle {
    font-size: 0.68rem;
    color: #5a7a5a;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    margin-top: -4px;
    flex-shrink: 0;
  }

  /* ── Hand blocks ── */
  .hand-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .hand-block {
    padding: 8px 4px;
    border-bottom: 1px solid #121e12;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    transition: background 0.15s;
    cursor: default;
  }

  .hand-block:first-child {
    border-top: 1px solid #1e3a1e;
  }

  .hand-block:hover {
    background: rgba(255, 210, 60, 0.18);
  }

  .hand-meta {
    display: flex;
    align-items: baseline;
    gap: 5px;
  }

  .hand-rank {
    font-size: 0.65rem;
    color: #5a7a5a;
    min-width: 16px;
    flex-shrink: 0;
  }

  .hand-name {
    font-size: 0.84rem;
    color: #d4c89a;
    flex: 1;
  }

  .rarity {
    font-size: 0.7rem;
    flex-shrink: 0;
  }
  .very-rare { color: #c87a7a; }
  .rare      { color: #c8a84a; }
  .uncommon  { color: #7a9a7a; }
  .common    { color: #6a9a6a; }

  .card-strip {
    display: flex;
    gap: 4px;
  }

  .card-img {
    width: 44px;
    height: auto;
    border-radius: 3px;
    display: block;
  }

  .hand-desc {
    font-size: 0.75rem;
    color: #7a9a7a;
    line-height: 1.45;
    font-style: italic;
  }

  .note {
    font-size: 0.7rem;
    color: #5a7a5a;
    font-style: italic;
    line-height: 1.5;
    flex-shrink: 0;
  }

  /* ── Glossary ── */
  .glossary-section {
    border-top: 1px solid #1e3a1e;
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex-shrink: 0;
  }

  .glossary-header {
    font-size: 0.68rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #5a7a5a;
  }

  .glossary-list {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 5px 12px;
    margin: 0;
    padding: 0;
  }

  .glossary-list dt {
    font-size: 0.75rem;
    color: #c8a84a;
    font-weight: bold;
    padding-top: 1px;
  }

  .glossary-list dd {
    font-size: 0.75rem;
    color: #7a9a7a;
    margin: 0;
    line-height: 1.4;
  }

  .glossary-link {
    font-size: 0.68rem;
    color: #4a6a8a;
    text-decoration: none;
    padding-top: 2px;
  }

  .glossary-link:hover {
    color: #7a9abc;
    text-decoration: underline;
  }
</style>
