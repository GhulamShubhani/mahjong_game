import { Router } from "express";
import {
  getGameController,
  placeBetController,
  startGameController
} from "../controllers/game.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  gameIdParamValidation,
  placeBetValidation,
  startGameValidation
} from "../validators/game.validation";

export const gameRouter = Router();

gameRouter.post("/start", validate(startGameValidation), startGameController);
gameRouter.post("/bet", validate(placeBetValidation), placeBetController);
gameRouter.get(
  "/:gameId",
  validate(gameIdParamValidation, "params"),
  getGameController
);
