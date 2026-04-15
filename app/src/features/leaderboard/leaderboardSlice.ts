import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/api/client";
import { getLeaderboard, submitScoreFromGame } from "@/api/leaderboard";
import type { LeaderboardEntryDTO } from "@/api/types";

export const loadLeaderboard = createAsyncThunk(
  "leaderboard/loadLeaderboard",
  async (limit: number) => getLeaderboard(limit)
);

export const submitLeaderboardFromGame = createAsyncThunk(
  "leaderboard/submitFromGame",
  async (arg: { gameId: string; name: string }) => {
    await submitScoreFromGame(arg.gameId, arg.name);
    return getLeaderboard(5);
  }
);

type LeaderboardState = {
  entries: LeaderboardEntryDTO[];
  status: "idle" | "loading" | "failed";
  error: string | null;
};

const initialState: LeaderboardState = {
  entries: [],
  status: "idle",
  error: null,
};

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    clearLeaderboardError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadLeaderboard.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadLeaderboard.fulfilled, (state, action) => {
        state.status = "idle";
        state.entries = action.payload;
      })
      .addCase(loadLeaderboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error);
      })
      .addCase(submitLeaderboardFromGame.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitLeaderboardFromGame.fulfilled, (state, action) => {
        state.status = "idle";
        state.entries = action.payload;
      })
      .addCase(submitLeaderboardFromGame.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error);
      });
  },
});

export const { clearLeaderboardError } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
