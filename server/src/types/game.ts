export type TileType = "NUMBER" | "DRAGON" | "WIND";

export type Tile = {
  id: string;
  type: TileType;
  value: number;
};
