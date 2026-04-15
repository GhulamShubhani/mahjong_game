import type { Tile } from "@/api/types";

export function sumHand(hand: Tile[]) {
  return hand.reduce((n, t) => n + t.value, 0);
}

export function tileFace(tile: Tile) {
  if (tile.type === "NUMBER") return String(tile.value);
  if (tile.type === "DRAGON") return "D";
  return "W";
}
