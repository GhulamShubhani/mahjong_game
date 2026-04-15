import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  loadLeaderboard,
  submitLeaderboardFromGame,
} from "@/features/leaderboard/leaderboardSlice";
import { resetGame } from "@/features/game/gameSlice";

type Props = { onDone: () => void };

export function Summary({ onDone }: Props) {
  const dispatch = useAppDispatch();
  const game = useAppSelector((s) => s.game.lastGame);
  const lastBet = useAppSelector((s) => s.game.lastBet);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const lbErr = useAppSelector((s) => s.leaderboard.error);

  if (!game) return null;

  const gameId = game._id;
  const already = game.leaderboardPosted === true;

  async function saveScore() {
    if (!name.trim() || name.trim().length < 2) return;
    setSaving(true);
    try {
      await dispatch(
        submitLeaderboardFromGame({
          gameId,
          name: name.trim(),
        })
      ).unwrap();
      dispatch(resetGame());
      onDone();
    } catch {
      void 0;
    } finally {
      setSaving(false);
    }
  }

  function skip() {
    dispatch(resetGame());
    void dispatch(loadLeaderboard(5));
    onDone();
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-4 py-12">
      <h1 className="text-xl font-semibold">Game over</h1>
      <p className="text-4xl font-bold tabular-nums">{game.score}</p>
      <p className="text-sm text-muted-foreground">Final score</p>

      {lastBet?.reason === "DRAW_PILE_EXHAUSTED_3RD_TIME" ? (
        <p className="text-sm text-amber-700 dark:text-amber-400">
          Draw pile ran out for the third time.
        </p>
      ) : null}

      {already ? (
        <p className="text-sm text-muted-foreground">
          Score already saved for this game.
        </p>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="pname">
            Name for leaderboard
          </label>
          <input
            id="pname"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Player"
            autoComplete="off"
          />
        </div>
      )}

      {lbErr ? (
        <p className="text-sm text-destructive" role="alert">
          {lbErr}
        </p>
      ) : null}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {!already ? (
          <Button
            type="button"
            className="flex-1"
            disabled={saving || name.trim().length < 2}
            onClick={() => void saveScore()}
          >
            {saving ? "Saving…" : "Save score"}
          </Button>
        ) : null}
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={skip}
        >
          Back to menu
        </Button>
      </div>
    </div>
  );
}
