import { Router } from "express";
import {
  createLeaderBoardFromGame,
  getLeaderBoard,
} from "../controllers/leaderboard.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  getLeaderBoardValidation,
  postLeaderboardFromGameValidation,
} from "../validators/leaderboard.validation";

export const leaderboardRouter = Router();

leaderboardRouter.post(
  "/from-game",
  validate(postLeaderboardFromGameValidation),
  createLeaderBoardFromGame
);

leaderboardRouter.get(
  "/",
  validate(getLeaderBoardValidation, "query"),
  getLeaderBoard
);
// leaderboardRouter.put(
//   "/:id",
//   validate(idParamValidation, "params"),
//   validate(putLeaderBoardValidation),
//   updateLeaderBoard
// );
// leaderboardRouter.delete(
//   "/:id",
//   validate(idParamValidation, "params"),
//   deleteLeaderBoard
// );