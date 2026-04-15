import { apiClient } from "./client";

/** Root health route (not under `/api/v1`). */
export async function getHealth(): Promise<{ message: string }> {
  const res = await apiClient.get<{ message: string }>("/health");
  return res.data;
}
