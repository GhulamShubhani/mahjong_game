export const generateDeck = () => {
  const deck = [];

  for (let i = 1; i <= 9; i++) {
    for (let j = 0; j < 4; j++) {
      deck.push({ id: `N-${i}-${j}`, type: "NUMBER", value: i });
    }
  }

  ["DRAGON", "WIND"].forEach(type => {
    for (let i = 0; i < 4; i++) {
      deck.push({ id: `${type}-${i}`, type, value: 5 });
    }
  });

  return shuffle(deck);
};

export const shuffle = (arr: any[]) => {
  return arr.sort(() => Math.random() - 0.5);
};

export const drawTiles = (deck: any[], count: number) => {
  return deck.splice(0, count);
};

export const calculateHandValue = (hand: any[]) => {
  return hand.reduce((sum, t) => sum + t.value, 0);
};