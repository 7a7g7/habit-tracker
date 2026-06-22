export type Entry = {
  date: string;
  sleepHours: number;
  calorieLevel: "under" | "at" | "over";
  calorieAmount?: number;
  screenTimeMinutes: number;
  producedSomething: boolean;
  producedDescription: string;
  mood: number;
  caloriesEaten?: number;
  steps?: number;
  liftedToday?: boolean;
  insight?: string;
};

export type UserSettings = {
  heightInches: number;
  weightLbs: number;
  age: number;
  sex: "male" | "female";
};