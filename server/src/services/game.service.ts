import Game from "../models/game.model";
import type { Tile } from "../types/game";
import { AppError } from "../utils/AppError";
import {
  calculateHandValue,
  drawTiles,
  generateDeck,
  HAND_SIZE,
  shuffle
} from "../utils/game.util";

function syncNonNumberValuesFromStore(
  hand: Tile[],
  tileValues: Record<string, number>
) {
  for (const tile of hand) {
    if (tile.type !== "NUMBER" && tileValues[tile.id] != null) {
      tile.value = tileValues[tile.id]!;
    }
  }
}

export async function startGameService() {
  const deck = generateDeck();
  const drawPile = [...deck];
  const currentHand = drawTiles(drawPile, HAND_SIZE);

  const game = await Game.create({
    currentHand,
    previousHands: [],
    drawPile,
    discardPile: [],
    tileValues: {},
    reshuffleCount: 0,
    score: 0,
    status: "in_progress"
  });

  return game;
}

export async function placeBetService(
  gameId: string,
  betType: "HIGHER" | "LOWER"
) {
  const game = await Game.findById(gameId);
  if (!game) {
    throw new AppError("Game not found", 404);
  }
  if (game.status !== "in_progress") {
    throw new AppError("Game is not in progress", 400);
  }

  const tileValues = { ...((game.tileValues || {}) as Record<string, number>) };
  const prevHand = [...(game.currentHand as Tile[])];
  const prevValue = calculateHandValue(prevHand);

  let drawPile = [...(game.drawPile as Tile[])];
  let discardPile = [...(game.discardPile || []), ...prevHand];
  let reshuffleCount = game.reshuffleCount;
  let exhaustedThirdTime = false;

  while (drawPile.length < HAND_SIZE) {
    if (reshuffleCount >= 2) {
      exhaustedThirdTime = true;
      break;
    }
    drawPile = shuffle([...discardPile, ...generateDeck()]);
    discardPile = [];
    reshuffleCount += 1;
  }

  if (exhaustedThirdTime || drawPile.length < HAND_SIZE) {
    game.status = "completed";
    game.markModified("status");
    await game.save();
    return {
      result: "completed" as const,
      newHand: [] as Tile[],
      newValue: 0,
      prevValue,
      score: game.score,
      isGameOver: true,
      reshuffleCount: game.reshuffleCount,
      reason: "DRAW PILE EXHAUSTED 3RD TIME"
    };
  }

  const newHand = drawTiles(drawPile, HAND_SIZE);

  game.previousHands = [...(game.previousHands || []), prevHand];
  game.discardPile = discardPile;
  game.drawPile = drawPile;
  game.reshuffleCount = reshuffleCount;

  syncNonNumberValuesFromStore(newHand, tileValues);

  const newValue = calculateHandValue(newHand);
  const isWin =
    (betType === "HIGHER" && newValue > prevValue) ||
    (betType === "LOWER" && newValue < prevValue);

  for (const tile of newHand) {
    if (tile.type === "NUMBER") continue;
    let v = tileValues[tile.id] ?? tile.value;
    v = isWin ? v + 1 : v - 1;
    v = Math.max(0, Math.min(10, v));
    tileValues[tile.id] = v;
    tile.value = v;
  }

  game.tileValues = tileValues;
  game.currentHand = newHand;
  game.score += isWin ? 10 : -5;

  const vals = Object.values(tileValues);
  const tileBoundaryEnd = vals.some(v => v === 0 || v === 10);
  const isGameOver = tileBoundaryEnd;

  if (isGameOver) {
    game.status = "completed";
  }

  game.markModified("tileValues");
  game.markModified("drawPile");
  game.markModified("discardPile");
  game.markModified("previousHands");
  game.markModified("currentHand");
  game.markModified("status");

  await game.save();

  return {
    result: isWin ? ("WIN" as const) : ("LOSE" as const),
    newHand,
    newValue,
    prevValue,
    score: game.score,
    isGameOver,
    reshuffleCount: game.reshuffleCount
  };
}

export async function getGameService(gameId: string) {
  const game = await Game.findById(gameId).lean();
  if (!game) {
    throw new AppError("Game not found", 404);
  }
  return game;
}
