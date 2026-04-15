import { apiClient, unwrapData } from "./client";
import type { GameDTO, PlaceBetResultDTO } from "./types";

const prefix = "/api/v1/game";

export async function startGame(): Promise<GameDTO> {
  const res = await apiClient.post<unknown>(`${prefix}/start`, {});
  return unwrapData<GameDTO>(res.data);
}

export async function placeBet(
  gameId: string,
  betType: "HIGHER" | "LOWER"
): Promise<PlaceBetResultDTO> {
  const res = await apiClient.post<unknown>(`${prefix}/bet`, {
    gameId,
    betType,
  });
  return unwrapData<PlaceBetResultDTO>(res.data);
}

export async function getGame(gameId: string): Promise<GameDTO> {
  const res = await apiClient.get<unknown>(`${prefix}/${gameId}`);
  return unwrapData<GameDTO>(res.data);
}
