import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { resetGame } from "@/features/game/gameSlice";
import { Landing } from "@/screens/Landing";
import { GameTable } from "@/screens/GameTable";
import { Summary } from "@/screens/Summary";

export default function App() {
  const [menu, setMenu] = useState(true);
  const dispatch = useAppDispatch();
  const game = useAppSelector((s) => s.game.lastGame);

  if (menu || !game) {
    return (
      <div className="min-h-screen bg-muted/25">
        <Landing
          onStarted={() => {
            setMenu(false);
          }}
        />
      </div>
    );
  }

  if (game.status === "completed") {
    return (
      <div className="min-h-screen bg-muted/25">
        <Summary
          onDone={() => {
            dispatch(resetGame());
            setMenu(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/25">
      <GameTable
        onLeave={() => {
          dispatch(resetGame());
          setMenu(true);
        }}
      />
    </div>
  );
}
