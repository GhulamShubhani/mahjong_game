import { model, Schema } from "mongoose";
import { ILeaderBoard } from "../interfaces/leaderboard.interface";


const leaderboardSchema = new Schema<ILeaderBoard>({
    name: { type: String, required: true, index: true },
    score: { type: Number, required: true }
},{ timestamps: true });

const LeaderBoard = model<ILeaderBoard>('LeaderBoard', leaderboardSchema);

export default LeaderBoard;