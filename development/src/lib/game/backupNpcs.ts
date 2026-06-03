export interface BackupNpc {
  id: string
  name: string
  species: string
  intro: string
}

export const BACKUP_NPCS: BackupNpc[] = [
  {
    id: 'morty',
    name: 'Morty',
    species: 'Monk Parakeet',
    intro: "Morty's been at this table longer than the felt. I once watched him bluff a golden eagle off a full house with nothing but a straight face.",
  },
  {
    id: 'blanche',
    name: 'Blanche',
    species: 'Great Blue Heron',
    intro: "Blanche doesn't rush for anyone. Word is she won a car in a gin rummy game, drove it straight to the coast, and pushed it into the ocean. Never confirmed. She never denied it.",
  },
  {
    id: 'dex',
    name: 'Dex',
    species: 'Hoopoe',
    intro: "Dex tells everyone he's a professor of something. Never clear on what. He narrates every hand like he's giving a lecture to an invisible classroom.",
  },
  {
    id: 'ines',
    name: 'Ines',
    species: 'Secretary Bird',
    intro: "Ines walked out of a hedge fund one morning, left her badge on the desk, came straight here. That was four years ago. We haven't asked and she hasn't offered.",
  },
  {
    id: 'clyde',
    name: 'Clyde',
    species: 'Atlantic Puffin',
    intro: "Clyde flies in every winter from up north. Happiest loser I've ever seen. I think he just likes being somewhere warm. Doesn't matter what the cards say — he's good.",
  },
  {
    id: 'margot',
    name: 'Margot',
    species: 'Roseate Spoonbill',
    intro: "Margot was here before there were card tables. She's the one who talked the owner into adding them. She brings it up every time she sits down, and honestly, she earned it.",
  },
  {
    id: 'theo',
    name: 'Theo',
    species: 'Shoebill Stork',
    intro: "Theo doesn't say much. There's something about the way he sits that makes the table go quiet. I asked him once what he was thinking. He said 'enough.' I left it at that.",
  },
  {
    id: 'pearl',
    name: 'Pearl',
    species: 'Sulphur-Crested Cockatoo',
    intro: "Pearl performed at a resort in the Cayman Islands for three years. She still plays like she's got an audience — because in her head she always does.",
  },
  {
    id: 'benny',
    name: 'Benny',
    species: 'European Roller',
    intro: "Benny claims he's played in casinos on six continents. Nobody fact-checks that around here. What we know is he showed up with a rolling suitcase one night and it's still in the coat check.",
  },
  {
    id: 'ruthie',
    name: 'Ruthie',
    species: 'Southern Cassowary',
    intro: "Ruthie never raises her voice. She doesn't need to. I've never seen her threaten anybody directly. She's just got a look. Once you understand the look, you understand Ruthie.",
  },
]

export function getNextBackup(usedIds: string[]): BackupNpc | null {
  return BACKUP_NPCS.find(n => !usedIds.includes(n.id)) ?? null
}
