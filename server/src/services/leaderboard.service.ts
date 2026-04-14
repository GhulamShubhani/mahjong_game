import LeaderBoard from "../models/leaderboard.model";
import { AppError } from "../utils/AppError";

const TOP_DEFAULT = 5;
const TOP_MAX = 50;

export async function submitScore(name: string, score: number) {
  const entry = await LeaderBoard.create({ name: name.trim(), score });
  return entry;
}

export async function listTopScores(limit = TOP_DEFAULT) {
  const safeLimit = Math.min(Math.max(1, limit), TOP_MAX);
  return LeaderBoard.find()
    .sort({ score: -1 })
    .limit(safeLimit)
    .lean()
    .exec();
}

export async function getEntryById(id: string) {
  const entry = await LeaderBoard.findById(id).lean().exec();
  if (!entry) {
    throw new AppError("Leaderboard entry not found", 404);
  }
  return entry;
}

export async function updateEntry(id: string, name: string, score: number) {
  const entry = await LeaderBoard.findByIdAndUpdate(
    id,
    { name: name.trim(), score },
    { new: true, runValidators: true }
  )
    .lean()
    .exec();
  if (!entry) {
    throw new AppError("Leaderboard entry not found", 404);
  }
  return entry;
}

export async function removeEntry(id: string) {
  const entry = await LeaderBoard.findByIdAndDelete(id).lean().exec();
  if (!entry) {
    throw new AppError("Leaderboard entry not found", 404);
  }
  return entry;
}
