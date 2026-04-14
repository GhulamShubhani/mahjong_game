import Game from "../models/game.model";
import {
  calculateHandValue,
  drawTiles,
  generateDeck,
  shuffle,
} from "../utils/game.util";

export const startGameService = async () => {
  const deck = generateDeck();
  console.log("deck", deck);
  const hand = drawTiles(deck, 3);
  console.log("hand", hand);
  const game = await Game.create({
    currentHand: hand,
    previousHands: [],
    drawPile: deck,
    discardPile: [],
    tileValues: {},
    reshuffleCount: 0,
    score: 0,
    status: "in_progress",
  });

  return game;
};

export const placeBetService = async (gameId: string, betType: string) => {
  const game = await Game.findById(gameId);
  if (!game) {
    throw new Error("Game not found");
  }

  if (game.status !== "in_progress") {
    throw new Error("Game is not in progress");
  }

  const prevValue = calculateHandValue(game.currentHand);

  game.previousHands.push(game.currentHand);

  game.discardPile.push(...game.currentHand);

  if(game.drawPile.length < 3){
    const newDeck = generateDeck();

    game.drawPile = shuffle([...game.discardPile, ...newDeck]);
game.discardPile = [];
    game.reshuffleCount += 1;
  }

  const newHand = drawTiles(game.drawPile, 3);
  console.log("newHand1", newHand);
  

newHand.forEach(tile => {
  if (tile.type !== "NUMBER") {
    // const currentValue = game.tileValues?.[tile.id] ?? 5;
    const currentValue = game.tileValues?.[tile.id] ?? tile.value;
    console.log(game.tileValues?.[tile.id], "tile.valuegame.tileValues[tile.id]");
    console.log(currentValue, "tile.value");
    tile.value = currentValue;
  }
});

    console.log("newHand2", newHand);


  const newValue = calculateHandValue(newHand);

  let isWin = false;

  if (betType === "HIGHER" && newValue > prevValue) isWin = true;
  if (betType === "LOWER" && newValue < prevValue) isWin = true;

  newHand.forEach(tile => {
    if (tile.type !== "NUMBER") {
      let current = game.tileValues?.[tile.id] ?? tile.value;

      current = isWin ? current + 1 : current - 1;

      current = Math.max(0, Math.min(10, current));

      game.tileValues[tile.id] = current;
      tile.value = current;
    }
  });


  game.currentHand = newHand;

  game.score += isWin ? 10 : -5;

  const values = Object.values(game.tileValues);

  let isGameOver = false;

  if (values.some(v => v === 0 || v === 10)) {
    isGameOver = true;
  }

  if (game.reshuffleCount >= 3) {
    isGameOver = true;
  }

  if (isGameOver) {
    game.status = "completed";
  }

  await game.save();

  return { result: isWin ? "WIN" : "LOSE",
    newHand,
    newValue,
    prevValue,
    score: game.score,
    isGameOver,
    reshuffleCount: game.reshuffleCount
 };
};

export const getGameService = async (gameId: string) => {
  return await Game.findById(gameId);
};
