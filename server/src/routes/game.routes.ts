
import { Router } from "express";
import { getGameController, placeBetController, startGameController } from "../controllers/game.controller";

export const gameRouter = Router();

gameRouter.post("/start",startGameController);
gameRouter.post("/bet",placeBetController);
gameRouter.get("/:gameId", getGameController);