import { useMemo } from "react";
import Countdown from "./components/Countdown";

export default function App() {
  const targetDate = useMemo(() => {
    const date = new Date();
    date.setSeconds(date.getSeconds() + 20);
    return date.toISOString();
  }, []);

  return (
    <main className="relative bg-background min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">
        <section className={`theme-night rounded-3xl bg-background p-4`}>
          <Countdown
            targetDate={targetDate}
          />
        </section>
      </div>
    </main>
  );
}
