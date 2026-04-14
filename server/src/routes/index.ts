import { Router } from "express";
import { leaderboardRouter } from "./leaderboard.routes";
import { gameRouter } from "./game.routes";

export const router = Router();

router.use("/leaderboard", leaderboardRouter);
router.use("/game", gameRouter);