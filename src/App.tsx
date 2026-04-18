import Countdown from "./components/Countdown";

export default function App() {
  return (
    <main className="relative bg-background min-h-screen py-10 px-4">
      <div className="mx-auto flex w-fit flex-col items-center gap-6">
        <section className={`theme-night rounded-3xl bg-background p-4`}>
          <Countdown
            targetDate="2026-04-18T19:19:00Z"
          />
        </section>
      </div>
    </main>
  );
}
