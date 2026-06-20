export type Entry = {
    date: string;
    sleepHours: number;
    calorieLevel: "under" | "at" | "over";
    calorieAmount?: number;
    screenTimeMinutes: number;
    producedSomething: boolean;
    producedDescription: string;
    mood: number;
  };