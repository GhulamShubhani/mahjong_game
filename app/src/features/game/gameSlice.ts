import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/api/client";
import { getGame, placeBet, startGame } from "@/api/game";
import type { GameDTO, PlaceBetResultDTO } from "@/api/types";

type LoadStatus = "idle" | "loading" | "failed";

export const startNewGame = createAsyncThunk("game/startNewGame", async () =>
  startGame()
);

export const submitBet = createAsyncThunk(
  "game/submitBet",
  async (arg: { gameId: string; betType: "HIGHER" | "LOWER" }) => {
    const bet = await placeBet(arg.gameId, arg.betType);
    const game = await getGame(arg.gameId);
    return { bet, game };
  }
);

export const loadGame = createAsyncThunk("game/loadGame", async (gameId: string) =>
  getGame(gameId)
);

type GameState = {
  lastGame: GameDTO | null;
  lastBet: PlaceBetResultDTO | null;
  status: LoadStatus;
  error: string | null;
};

const initialState: GameState = {
  lastGame: null,
  lastBet: null,
  status: "idle",
  error: null,
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    clearGameError(state) {
      state.error = null;
    },
    resetGame(state) {
      state.lastGame = null;
      state.lastBet = null;
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startNewGame.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(startNewGame.fulfilled, (state, action) => {
        state.status = "idle";
        state.lastGame = action.payload;
        state.lastBet = null;
      })
      .addCase(startNewGame.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error);
      })
      .addCase(submitBet.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitBet.fulfilled, (state, action) => {
        state.status = "idle";
        state.lastBet = action.payload.bet;
        state.lastGame = action.payload.game;
      })
      .addCase(submitBet.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error);
      })
      .addCase(loadGame.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadGame.fulfilled, (state, action) => {
        state.status = "idle";
        state.lastGame = action.payload;
      })
      .addCase(loadGame.rejected, (state, action) => {
        state.status = "failed";
        state.error = getErrorMessage(action.error);
      });
  },
});

export const { clearGameError, resetGame } = gameSlice.actions;
export default gameSlice.reducer;
