import Countdown from "./components/Countdown";

// const themes = ["theme-aurora", "theme-sunset", "theme-forest", "theme-night", "theme-ocean"];
const themes = ["theme-night"];

export default function App() {
  return (
    <main className="relative bg-background min-h-screen py-10 px-4">
      <div className="mx-auto flex w-fit flex-col items-center gap-6">
        {themes.map((themeName, index) => (
          <section key={themeName} className={`${themeName} rounded-3xl bg-background p-4`}>
            <Countdown
              targetDate="2026-04-18T19:15:20Z"
              slideIntensity={index * 0.5}
              slideDuration={index * 0.25}
              flashIntensity={index * 0.5}
              showText={index !== 1}
            />
          </section>
        ))}
      </div>
    </main>
  );
}
