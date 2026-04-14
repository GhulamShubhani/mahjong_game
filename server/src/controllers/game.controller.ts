import { Request, Response } from "express";
import { successResponse } from "../middlewares/response";
import { getGameService, placeBetService, startGameService } from "../services/game.service";
import { asynchandler } from "../utils/asyncHandler";

export const startGameController = asynchandler(
  async (req: Request, res: Response) => {
    const result = await startGameService();
    return successResponse(res, result, "Game started", 201);
  },
);
export const placeBetController = asynchandler(
  async (req: Request, res: Response) => {
    const { gameId, betType } = req.body;
    const result = await placeBetService(gameId, betType);
    return successResponse(res, result, "Bet placed", 200);
  },
);

export const getGameController = asynchandler(
  async (req: Request, res: Response) => {
    const gameId = req.params.gameId;
  const game = await getGameService(gameId as string);
  res.json(game);
});
