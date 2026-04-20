import Countdown from "./components/Countdown";

export default function App() {
  return (
    <main className="relative bg-background min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-6">
        <section className={`theme-night rounded-3xl bg-background p-4`}>
          <Countdown
            targetDate={"2027-04-20T15:00:00Z"}
          />
        </section>
      </div>
    </main>
  );
}
