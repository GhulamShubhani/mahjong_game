import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { resetGame, submitBet } from "@/features/game/gameSlice";
import { sumHand, tileFace } from "@/lib/hand";

type Props = { onLeave: () => void };

export function GameTable({ onLeave }: Props) {
  const dispatch = useAppDispatch();
  const game = useAppSelector((s) => s.game.lastGame);
  const lastBet = useAppSelector((s) => s.game.lastBet);
  const loading = useAppSelector((s) => s.game.status === "loading");
  const err = useAppSelector((s) => s.game.error);

  if (!game) return null;

  const gameId = game._id;
  const hand = game.currentHand ?? [];
  const total = sumHand(hand);
  const done = game.status === "completed";

  function leave() {
    dispatch(resetGame());
    onLeave();
  }

  async function bet(side: "HIGHER" | "LOWER") {
    try {
      await dispatch(submitBet({ gameId, betType: side })).unwrap();
    } catch {
      void 0;
    }
  }

  const history = [...game.previousHands].reverse().slice(0, 8);

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 px-3 py-6 sm:px-4">
      <div className="flex items-center justify-between gap-2">
        <Button type="button" variant="outline" size="sm" onClick={leave}>
          Exit
        </Button>
        <div className="text-right text-xs text-muted-foreground sm:text-sm">
          <div>
            Draw pile:{" "}
            <span className="font-mono text-foreground">
              {game.drawPile.length}
            </span>
          </div>
          <div>
            Discard:{" "}
            <span className="font-mono text-foreground">
              {game.discardPile.length}
            </span>
          </div>
          <div>
            Reshuffles:{" "}
            <span className="font-mono text-foreground">
              {game.reshuffleCount}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <p className="text-xs text-muted-foreground">Current hand</p>
        <p className="mt-1 text-3xl font-semibold tabular-nums">{total}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {hand.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tiles left.</p>
          ) : null}
          {hand.map((t) => (
            <div
              key={t.id}
              className="flex h-24 w-16 flex-col items-center justify-center rounded-lg border-2 border-foreground/20 bg-background text-lg font-medium shadow-sm sm:h-28 sm:w-[4.5rem]"
            >
              <span className="text-xs uppercase text-muted-foreground">
                {t.type === "NUMBER" ? "#" : tileFace(t)}
              </span>
              <span className="text-2xl">{t.value}</span>
            </div>
          ))}
        </div>
      </div>

      {lastBet ? (
        <p className="text-center text-sm">
          <span
            className={
              lastBet.result === "WIN" ? "text-emerald-600" : "text-red-600"
            }
          >
            {lastBet.result}
          </span>
          <span className="text-muted-foreground">
            {" "}
            — was {lastBet.prevValue}, now {lastBet.newValue}
          </span>
        </p>
      ) : null}

      {err ? (
        <p className="text-center text-sm text-destructive">{err}</p>
      ) : null}

      <div className="mt-auto flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          size="lg"
          className="flex-1"
          disabled={loading || done}
          onClick={() => void bet("HIGHER")}
        >
          Bet higher
        </Button>
        <Button
          type="button"
          size="lg"
          variant="secondary"
          className="flex-1"
          disabled={loading || done}
          onClick={() => void bet("LOWER")}
        >
          Bet lower
        </Button>
      </div>

      <section className="rounded-lg border bg-muted/40 p-3">
        <h3 className="text-xs font-medium uppercase text-muted-foreground">
          History
        </h3>
        <ul className="mt-2 max-h-40 space-y-2 overflow-y-auto pr-1">
          {history.length === 0 ? (
            <li className="text-xs text-muted-foreground">No past hands.</li>
          ) : (
            history.map((hand, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 border-b border-border/60 pb-2 last:border-0"
              >
                <span className="text-xs tabular-nums text-muted-foreground">
                  {sumHand(hand)}
                </span>
                <div className="flex flex-1 flex-wrap gap-1">
                  {hand.map((t) => (
                    <span
                      key={t.id}
                      className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded border bg-background px-1 text-[10px] font-medium"
                    >
                      {tileFace(t)}
                      {t.type === "NUMBER" ? "" : t.value}
                    </span>
                  ))}
                </div>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
