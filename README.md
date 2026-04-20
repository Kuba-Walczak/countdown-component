# Countdown Component

`Countdown` props:

- `targetDate` (`Date | string`, required, no default) - UTC time for countdown.
- `slideIntensity` (`number`, optional, `default: 1`) - animation intensity, range `0-2`.
- `slideDuration` (`number`, optional, `default: 1`) - animation speed factor, range `0-1`.
- `flashIntensity` (`number`, optional, `default: 1`) - flash effect strength, range `0-1`.
- `showLabels` (`boolean`, optional, `default: true`) - shows unit labels under digits.
- `unitLabels` (`Partial<Record<"days" | "hours" | "minutes" | "seconds", string>>`, optional, `default: { days: "dni", hours: "godziny", minutes: "minuty", seconds: "sekundy" }`) - custom labels per unit.
- `endText` (`string`, optional, `default: "KONIEC CZASU"`) - text shown when countdown expired at mount.
- `onFinish` (`() => void`, optional, `default: undefined`) - callback fired when countdown reaches zero.

