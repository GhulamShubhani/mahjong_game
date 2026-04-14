import { TileType } from "../types/game";

export interface ITile extends Document {
    id: string;
    type : TileType;
    value: number;
}