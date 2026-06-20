"use client";

import { useState } from "react";
import type { Entry } from "../types";

type DayViewProps = {
  entries: Entry[];
};

export default function DayView({ entries }: DayViewProps) {
  const [selectedDate, setSelectedDate] = useState("");

  const match = entries.find((entry) => entry.date === selectedDate);

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-3xl mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        View a Specific Day
      </h2>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2"
      />

      {selectedDate && !match && (
        <p className="text-gray-500 text-sm mt-4">
          No entry found for {selectedDate}.
        </p>
      )}

      {match && (
        <div className="mt-4 space-y-2 text-sm text-gray-800">
          <p>
            <span className="font-medium">Date:</span> {match.date}
          </p>
          <p>
            <span className="font-medium">Sleep:</span> {match.sleepHours} hours
          </p>
          <p>
            <span className="font-medium">Calories:</span> {match.calorieLevel}
            {match.calorieAmount ? ` (${match.calorieAmount})` : ""}
          </p>
          <p>
            <span className="font-medium">Screen time:</span>{" "}
            {match.screenTimeMinutes} min
          </p>
          <p>
            <span className="font-medium">Produced something:</span>{" "}
            {match.producedSomething ? "Yes" : "No"}
            {match.producedDescription ? ` — ${match.producedDescription}` : ""}
          </p>
          <p>
            <span className="font-medium">Mood:</span> {match.mood}/5
          </p>
        </div>
      )}
    </div>
  );
}