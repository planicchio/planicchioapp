// Weekly rotation helpers — content auto-updates every Sunday at 00:00 local time.

export const MS_PER_DAY = 86400000;

/** Returns the timestamp (ms) of the next Sunday at 00:00 local time. */
export function nextSundayMs(from = new Date()): number {
  const d = new Date(from);
  const day = d.getDay(); // 0 = Sunday
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + daysUntilSunday, 0, 0, 0, 0);
  return next.getTime();
}

/**
 * Monotonically increasing integer that changes every Sunday at 00:00.
 * Use as a deterministic seed so all clients see the same weekly content.
 */
export function weekSeed(from = new Date()): number {
  // Count Sundays since a fixed epoch (Sun 2020-01-05)
  const epoch = new Date(2020, 0, 5).getTime();
  return Math.floor((from.getTime() - epoch) / (7 * MS_PER_DAY));
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export function countdownTo(targetMs: number, from = Date.now()): Countdown {
  const totalMs = Math.max(0, targetMs - from);
  const days = Math.floor(totalMs / MS_PER_DAY);
  const hours = Math.floor((totalMs % MS_PER_DAY) / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const seconds = Math.floor((totalMs % 60_000) / 1000);
  return { days, hours, minutes, seconds, totalMs };
}

/** Deterministic shuffle using the weekly seed (Fisher–Yates with seeded RNG). */
export function weeklyShuffle<T>(arr: T[], extraSeed = 0): T[] {
  const out = arr.slice();
  let s = weekSeed() * 9301 + 49297 + extraSeed * 233;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
