import { Request, Response } from "express";
import { asynchandler } from "../utils/asyncHandler";
import { successResponse } from "../middlewares/response";
import { AppError } from "../utils/AppError";
import * as leaderboardService from "../services/leaderboard.service";



export const createLeaderBoardFromGame = asynchandler(
  async (req: Request, res: Response) => {
    const { gameId, name } = req.body as { gameId: string; name: string };
    const entry = await leaderboardService.submitScoreFromGame(gameId, name);
    return successResponse(res, entry, "Score recorded from game", 201);
  }
);

export const getLeaderBoard = asynchandler(
  async (req: Request, res: Response) => {
    const q = req.query as { limit?: number | string };
    const limit =
      typeof q.limit === "number"
        ? q.limit
        : Number(q.limit) || 5;
    const rows = await leaderboardService.listTopScores(limit);
    return successResponse(res, rows, "OK");
  }
);

