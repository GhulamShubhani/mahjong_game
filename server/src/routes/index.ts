import { Router } from "express";
import { leaderboardRouter } from "./leaderboard.routes";

export const router = Router();

router.use("/leaderboard", leaderboardRouter);