import { Router } from "express";
import {
  createLeaderBoard,
  deleteLeaderBoard,
  getLeaderBoard,
  updateLeaderBoard
} from "../controllers/leaderboard.controller";
import { validate } from "../middlewares/validate.middleware";
import {
  getLeaderBoardValidation,
  idParamValidation,
  postLeaderBoardValidation,
  putLeaderBoardValidation
} from "../validators/leaderboard.validation";

export const leaderboardRouter = Router();

leaderboardRouter.post(
  "/",
  validate(postLeaderBoardValidation),
  createLeaderBoard
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