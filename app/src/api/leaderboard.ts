import { apiClient, unwrapData } from "./client";
import type { LeaderboardEntryDTO } from "./types";

const prefix = "/api/v1/leaderboard";

export async function getLeaderboard(
  limit = 5
): Promise<LeaderboardEntryDTO[]> {
  const res = await apiClient.get<unknown>(prefix, { params: { limit } });
  return unwrapData<LeaderboardEntryDTO[]>(res.data);
}

export async function submitScoreFromGame(
  gameId: string,
  name: string
): Promise<LeaderboardEntryDTO> {
  const res = await apiClient.post<unknown>(`${prefix}/from-game`, {
    gameId,
    name,
  });
  return unwrapData<LeaderboardEntryDTO>(res.data);
}
