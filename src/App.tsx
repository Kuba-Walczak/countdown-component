import Countdown from "./components/Countdown";

export default function App() {
  return (
    <main className="relative bg-background min-h-screen flex items-center justify-center">
      <Countdown targetDate="2026-05-15T20:00:00Z" slideIntensity={100} slideDuration={0.5} flashIntensity={0.5} showText={true}/>
    </main>
  );
}
