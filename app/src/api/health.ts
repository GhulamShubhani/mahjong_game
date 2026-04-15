import { apiClient } from "./client";

export async function getHealth(): Promise<{ message: string }> {
  const res = await apiClient.get<{ message: string }>("/health");
  return res.data;
}
