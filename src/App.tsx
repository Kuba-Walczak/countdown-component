import Countdown from "./components/Countdown";

const themes = ["theme-aurora", "theme-sunset", "theme-forest", "theme-night", "theme-ocean"];

export default function App() {
  return (
    <main className="relative bg-background min-h-screen py-10 px-4">
      <div className="mx-auto flex w-fit flex-col items-center gap-6">
        {themes.map((themeName, index) => (
          <section key={themeName} className={`${themeName} rounded-3xl border border-border/40 bg-background p-4 shadow-xl`}>
            <Countdown
              targetDate="2026-05-15T20:00:00Z"
              slideIntensity={index * 0.5}
              slideDuration={index * 0.5}
              flashIntensity={index * 0.5}
              showText={index !== 0}
            />
          </section>
        ))}
      </div>
    </main>
  );
}
