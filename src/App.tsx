import Countdown from "./components/Countdown";

export default function App() {
  return (
    <main className="relative bg-background min-h-screen flex items-center justify-center">
      <Countdown targetDate="2026-12-31T00:00:00Z"/>
    </main>
  );
}
