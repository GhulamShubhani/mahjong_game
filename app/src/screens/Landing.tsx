import { useEffect } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  clearLeaderboardError,
  loadLeaderboard,
} from "@/features/leaderboard/leaderboardSlice";
import { clearGameError } from "@/features/game/gameSlice";
import { startNewGame } from "@/features/game/gameSlice";

type Props = { onStarted: () => void };

const steps = [
  "You’re dealt 3 tiles. The total value of that hand is shown.",
  "Guess if the next hand’s total will be higher or lower, then press the matching button.",
  "Number tiles count as their face value. Wind and dragon tiles start at 5; after each hand they go up 1 on a win or down 1 on a loss (never below 0 or above 10).",
  "Watch the draw pile and discard pile counts. If the draw pile can’t deal a full hand, it’s reshuffled with a fresh deck mixed in. The game ends if any wind/dragon hits 0 or 10, or the pile runs out a third time.",
  "When the round ends, you can save your score to the leaderboard from the summary screen.",
];

export function Landing({ onStarted }: Props) {
  const dispatch = useAppDispatch();
  const rows = useAppSelector((s) => s.leaderboard.entries);
  const busy = useAppSelector(
    (s) =>
      s.game.status === "loading" || s.leaderboard.status === "loading"
  );
  const err = useAppSelector((s) => s.game.error ?? s.leaderboard.error);

  useEffect(() => {
    dispatch(clearGameError());
    dispatch(clearLeaderboardError());
    void dispatch(loadLeaderboard(5));
  }, [dispatch]);

  async function handleStart() {
    try {
      await dispatch(startNewGame()).unwrap();
      onStarted();
    } catch {
      void 0;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/80 via-background to-background pb-16">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10 sm:py-14">
        <header className="landing-rise text-center sm:text-left">
          <div className="mb-6 flex justify-center gap-2 sm:justify-start">
            {[
              { label: "7", sub: "#" },
              { label: "D", sub: "5" },
              { label: "W", sub: "5" },
            ].map((t, i) => (
              <div
                key={i}
                className="landing-tile flex h-16 w-12 flex-col items-center justify-center rounded-lg border-2 border-foreground/15 bg-card text-sm font-semibold shadow-sm sm:h-[4.5rem] sm:w-14"
              >
                <span className="text-[10px] text-muted-foreground">{t.sub}</span>
                <span className="text-xl tabular-nums">{t.label}</span>
              </div>
            ))}
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Hand betting
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground sm:mx-0">
            Three Mahjong tiles per hand — call the next total before the cards
            flip.
          </p>
        </header>

        <section
          className="landing-rise landing-rise-delay-1 rounded-xl border bg-card/90 p-5 shadow-sm backdrop-blur-sm sm:p-6"
        >
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            How to play
          </h2>
          <ol className="mt-4 list-decimal space-y-3 pl-4 text-sm leading-relaxed text-foreground/90 marker:text-muted-foreground">
            {steps.map((text, i) => (
              <li key={i}>{text}</li>
            ))}
          </ol>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 rounded-lg border border-dashed border-border/80 bg-muted/30 px-3 py-3 text-xs text-muted-foreground sm:justify-start">
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <TrendingUp className="size-3.5 text-emerald-600" aria-hidden />
              Higher
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
              <TrendingDown className="size-3.5 text-red-600" aria-hidden />
              Lower
            </span>
            <span className="hidden sm:inline">— your two bets each round.</span>
          </div>
        </section>

        <div className="landing-rise landing-rise-delay-2">
          <Button
            type="button"
            size="lg"
            className="w-full transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm"
            disabled={busy}
            onClick={() => void handleStart()}
          >
            {busy ? "Starting…" : "New game"}
          </Button>
        </div>

        {err ? (
          <p className="text-sm text-destructive" role="alert">
            {err}
          </p>
        ) : null}

        <section className="landing-rise landing-rise-delay-3 rounded-xl border bg-card p-4 shadow-sm sm:p-5">
          <h2 className="text-sm font-medium text-muted-foreground">
            Top scores
          </h2>
          <ol className="mt-3 space-y-2">
            {rows.length === 0 ? (
              <li className="text-sm text-muted-foreground">No scores yet.</li>
            ) : (
              rows.slice(0, 5).map((r, idx) => (
                <li
                  key={r._id}
                  className="flex items-center justify-between rounded-md px-1 py-1.5 text-sm transition-colors hover:bg-muted/60"
                >
                  <span className="text-muted-foreground">{idx + 1}.</span>
                  <span className="flex-1 px-2 font-medium">{r.name}</span>
                  <span className="tabular-nums">{r.score}</span>
                </li>
              ))
            )}
          </ol>
        </section>
      </div>
    </div>
  );
}
