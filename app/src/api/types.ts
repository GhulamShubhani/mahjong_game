export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiErrorBody = {
  success: false;
  message: string;
};

export type TileType = "NUMBER" | "DRAGON" | "WIND";

export type Tile = {
  id: string;
  type: TileType;
  value: number;
};

export type GameDTO = {
  _id: string;
  currentHand: Tile[];
  previousHands: Tile[][];
  drawPile: Tile[];
  discardPile: Tile[];
  tileValues: Record<string, number>;
  status: "waiting" | "in_progress" | "completed";
  score: number;
  reshuffleCount: number;
  leaderboardPosted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type PlaceBetResultDTO = {
  result: "WIN" | "LOSE";
  newHand: Tile[];
  newValue: number;
  prevValue: number;
  score: number;
  isGameOver: boolean;
  reshuffleCount: number;
  reason?: string;
};

export type LeaderboardEntryDTO = {
  _id: string;
  name: string;
  score: number;
  createdAt?: string;
  updatedAt?: string;
};
