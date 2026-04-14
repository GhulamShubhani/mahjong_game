import type { Tile, TileType } from "../types/game";

export const HAND_SIZE = 3;

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateDeck(): Tile[] {
  const deck: Tile[] = [];

  for (let rank = 1; rank <= 9; rank++) {
    for (let copy = 0; copy < 4; copy++) {
      deck.push({
        id: `N-${rank}-${copy}`,
        type: "NUMBER",
        value: rank
      });
    }
  }

  (["DRAGON", "WIND"] as TileType[]).forEach(type => {
    for (let i = 0; i < 4; i++) {
      deck.push({ id: `${type}-${i}`, type, value: 5 });
    }
  });

  return shuffle(deck);
}

export function drawTiles(pile: Tile[], count: number): Tile[] {
  return pile.splice(0, count);
}

export function calculateHandValue(hand: Tile[]): number {
  return hand.reduce((sum, t) => sum + t.value, 0);
}
