import axios, { type AxiosInstance, isAxiosError } from "axios";
import type { ApiErrorBody, ApiSuccess } from "./types";

function getBaseUrl() {
  return import.meta.env.VITE_API_URL ?? "";
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export function unwrapData<T>(body: unknown): T {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid response body");
  }
  const envelope = body as Partial<ApiSuccess<T>> & Partial<ApiErrorBody>;
  if (envelope.success === false) {
    throw new Error(envelope.message ?? "Request failed");
  }
  if (envelope.success !== true || envelope.data === undefined) {
    throw new Error("Unexpected response shape");
  }
  return envelope.data;
}

export function getErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as ApiErrorBody | undefined;
    if (data?.message) return data.message;
    return err.message;
  }
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string" && m.length > 0) return m;
  }
  if (err instanceof Error) return err.message;
  return "Unknown error";
}
