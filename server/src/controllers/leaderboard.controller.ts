import { Request, Response } from "express";
import { asynchandler } from "../utils/asyncHandler";
import { successResponse } from "../middlewares/response";
import * as leaderboardService from "../services/leaderboard.service";

export const createLeaderBoard = asynchandler(
  async (req: Request, res: Response) => {
    const body = req.body as { name?: string; score: number };
    const name =
      body.name?.trim() && body.name.trim().length >= 2
        ? body.name.trim()
        : req.user!.name;
    const entry = await leaderboardService.submitScore(name, body.score);
    return successResponse(res, entry, "Score recorded", 201);
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

export const updateLeaderBoard = asynchandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const { name, score } = req.body as { name: string; score: number };
    const entry = await leaderboardService.updateEntry(id, name, score);
    return successResponse(res, entry, "Updated");
  }
);

export const deleteLeaderBoard = asynchandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const removed = await leaderboardService.removeEntry(id);
    return successResponse(res, removed, "Deleted");
  }
);