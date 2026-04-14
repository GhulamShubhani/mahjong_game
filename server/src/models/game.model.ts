import { model, Schema } from "mongoose";

const gameSchema = new Schema(
  {
    currentHand: Array,
    previousHands: Array,
    drawPile: Array,
    discardPile: Array,
    tileValues: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      enum: ["waiting", "in_progress", "completed"],
      default: "waiting",
    },
    score: {
      type: Number,
      default: 0,
    },
    reshuffleCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Game = model("Game", gameSchema);

export default Game;
