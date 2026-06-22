"use client";

import { useState, useEffect } from "react";
import type { Entry } from "./types";
import EntryList from "./components/EntryList";
import DayView from "./components/DayView";
import Settings from "./components/Settings";
import type { UserSettings } from "./types";


function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export default function Home() {
  const [date, setDate] = useState(getToday());
  const [sleepHours, setSleepHours] = useState("");
  const [calorieLevel, setCalorieLevel] = useState<"under" | "at" | "over">("at");
  const [calorieAmount, setCalorieAmount] = useState("");
  const [screenTimeMinutes, setScreenTimeMinutes] = useState("");
  const [producedSomething, setProducedSomething] = useState(false);
  const [producedDescription, setProducedDescription] = useState("");
  const [mood, setMood] = useState(3);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [caloriesEaten, setCaloriesEaten] = useState("");
  const [steps, setSteps] = useState("");
  const [liftedToday, setLiftedToday] = useState(false);
  const [calculating, setCalculating] = useState(false);
const [calcResult, setCalcResult] = useState<{
  calorie_level: "under" | "at" | "over";
  estimated_deficit_or_surplus: number;
  insight: string;
} | null>(null);
const [calcError, setCalcError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("habit-entries");
    if (stored) {
      setEntries(JSON.parse(stored));
    }
  }, []);

useEffect(() => {
  const stored = localStorage.getItem("user-settings");
  if (stored) {
    setUserSettings(JSON.parse(stored));
  }
}, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newEntry: Entry = {
      date,
      sleepHours: Number(sleepHours),
      calorieLevel,
      calorieAmount:
        calorieLevel === "under" || calorieLevel === "over"
          ? Number(calorieAmount)
          : undefined,
      screenTimeMinutes: Number(screenTimeMinutes),
      producedSomething,
      producedDescription,
      mood,
      caloriesEaten: caloriesEaten ? Number(caloriesEaten) : undefined,
      steps: steps ? Number(steps) : undefined,
      liftedToday,
      insight: calcResult?.insight,
    };

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    localStorage.setItem("habit-entries", JSON.stringify(updatedEntries));

    setSleepHours("");
    setCalorieLevel("at");
    setCalorieAmount("");
    setScreenTimeMinutes("");
    setProducedSomething(false);
    setProducedDescription("");
    setMood(3);
    setDate(getToday());
    setCaloriesEaten("");
    setSteps("");
    setLiftedToday(false);
    setCalcResult(null);
  }
  async function handleCalculate() {
    if (!userSettings) {
      setCalcError("Please fill in your Settings first.");
      return;
    }
    if (!caloriesEaten || !steps) {
      setCalcError("Please enter calories eaten and steps before calculating.");
      return;
    }

    setCalculating(true);
    setCalcError("");
    setCalcResult(null);

    try {
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: userSettings,
          daily: {
            caloriesEaten: Number(caloriesEaten),
            steps: Number(steps),
            liftedToday,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCalcError("Something went wrong. Please try again.");
        return;
      }

      setCalcResult(data);
      setCalorieLevel(data.calorie_level);
      setCalorieAmount(String(Math.abs(data.estimated_deficit_or_surplus)));

    } catch {
      setCalcError("Network error. Please try again.");
    } finally {
      setCalculating(false);
    }
  }

  return (
      <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Habit Tracker
        </h1>
  
        <Settings onSave={(s) => setUserSettings(s)} />
  
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 w-full max-w-xl space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white w-full"
            />
          </div>
  
          {/* Sleep hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sleep hours
            </label>
            <input
              type="number"
              step="0.5"
              placeholder="e.g. 7.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white w-full"
            />
          </div>
  
            {/* Calories eaten */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calories eaten today
            </label>
            <input
              type="number"
              placeholder="e.g. 2100"
              value={caloriesEaten}
              onChange={(e) => setCaloriesEaten(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white w-full"
            />
          </div>
  
          {/* Steps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Steps today
            </label>
            <input
              type="number"
              placeholder="e.g. 8000"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white w-full"
            />
          </div>
  
          {/* Lifted today */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Did you lift today?
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setLiftedToday(true)}
                className={`px-4 py-2 rounded border ${
                  liftedToday
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setLiftedToday(false)}
                className={`px-4 py-2 rounded border ${
                  !liftedToday
                    ? "bg-gray-600 text-white border-gray-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Calculate button */}
          <div>
          <button
            type="button"
            onClick={handleCalculate}
            disabled={calculating}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {calculating ? "Calculating..." : "Calculate Deficit/Surplus"}
          </button>

          {calcError && (
            <p className="text-red-600 text-sm mt-2">{calcError}</p>
          )}

          {calcResult && (
            <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-200 space-y-1">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Estimated:</span>{" "}
                {calcResult.estimated_deficit_or_surplus < 0
                  ? `${Math.abs(calcResult.estimated_deficit_or_surplus)} calorie deficit`
                  : calcResult.estimated_deficit_or_surplus === 0
                  ? "At maintenance"
                  : `${calcResult.estimated_deficit_or_surplus} calorie surplus`}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Insight:</span>{" "}
                {calcResult.insight}
              </p>
            </div>
          )}
        </div>

          {/* Calorie level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calorie level
            </label>
            <select
              value={calorieLevel}
              onChange={(e) =>
                setCalorieLevel(e.target.value as "under" | "at" | "over")
              }
              className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white w-full"
            >
              <option value="under">Under maintenance</option>
              <option value="at">At maintenance</option>
              <option value="over">Over maintenance</option>
            </select>
  
            {(calorieLevel === "under" || calorieLevel === "over") && (
              <input
                type="number"
                placeholder="Calorie amount"
                value={calorieAmount}
                onChange={(e) => setCalorieAmount(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white w-full mt-2"
              />
            )}
          </div>
  
          {/* Screen time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Screen time (minutes, social media)
            </label>
            <input
              type="number"
              placeholder="e.g. 90"
              value={screenTimeMinutes}
              onChange={(e) => setScreenTimeMinutes(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white w-full"
            />
          </div>
  
          {/* Produced something */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Produced something today?
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setProducedSomething(true)}
                className={`px-4 py-2 rounded border ${
                  producedSomething
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setProducedSomething(false)}
                className={`px-4 py-2 rounded border ${
                  !producedSomething
                    ? "bg-gray-600 text-white border-gray-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                No
              </button>
            </div>
            <textarea
              placeholder="What did you produce? (optional)"
              value={producedDescription}
              onChange={(e) => setProducedDescription(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white w-full mt-2"
              rows={2}
            />
          </div>
  
          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mood: {mood}
            </label>
            <input
              type="range"
              min={1}
              max={5}
              value={mood}
              onChange={(e) => setMood(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>
  
          
  
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Entry
          </button>
        </form>
  
        <EntryList entries={entries} />
        <DayView entries={entries} />
      </main>
    );
  }