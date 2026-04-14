import { Document } from "mongoose";


export interface ILeaderBoard extends Document {
    name: string;
    score: number;
}