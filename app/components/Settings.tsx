"use client";

import { useState, useEffect } from "react";
import type { UserSettings } from "../types";

type SettingsProps = {
  onSave: (settings: UserSettings) => void;
};

export default function Settings({ onSave }: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [heightInches, setHeightInches] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<"male" | "female">("male");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user-settings");
    if (stored) {
      const s: UserSettings = JSON.parse(stored);
      setHeightInches(String(s.heightInches));
      setWeightLbs(String(s.weightLbs));
      setAge(String(s.age));
      setSex(s.sex);
    }
  }, []);

  function handleSave() {
    const settings: UserSettings = {
      heightInches: Number(heightInches),
      weightLbs: Number(weightLbs),
      age: Number(age),
      sex,
    };
    localStorage.setItem("user-settings", JSON.stringify(settings));
    onSave(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 w-full max-w-xl mb-6">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <span className="font-semibold text-gray-900">Settings</span>
        <span className="text-gray-500 text-sm">{isOpen ? "▲ Hide" : "▼ Show"}</span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height (inches)
            </label>
            <input
              type="number"
              placeholder="e.g. 70"
              value={heightInches}
              onChange={(e) => setHeightInches(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (lbs)
            </label>
            <input
              type="number"
              placeholder="e.g. 185"
              value={weightLbs}
              onChange={(e) => setWeightLbs(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              placeholder="e.g. 28"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sex
            </label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value as "male" | "female")}
              className="border border-gray-300 rounded px-3 py-2 text-gray-900 bg-white w-full"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {saved ? "Saved ✓" : "Save Settings"}
          </button>
        </div>
      )}
    </div>
  );
}