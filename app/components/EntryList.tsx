import type { Entry } from "../types";

type EntryListProps = {
  entries: Entry[];
};

export default function EntryList({ entries }: EntryListProps) {
  const sorted = [...entries].sort((a, b) => (a.date < b.date ? 1 : -1));
  const last30 = sorted.slice(0, 30);

  if (last30.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-3xl mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Last 30 Entries
        </h2>
        <p className="text-gray-500 text-sm">
          No entries yet. Fill out the form above to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-3xl mt-6 overflow-x-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Last 30 Entries
      </h2>
      <table className="w-full text-sm text-left text-gray-900">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2 pr-4">Date</th>
            <th className="py-2 pr-4">Sleep</th>
            <th className="py-2 pr-4">Calories</th>
            <th className="py-2 pr-4">Screen Time</th>
            <th className="py-2 pr-4">Produced</th>
            <th className="py-2 pr-4">Mood</th>
            <th className="py-2 pr-4">Insight</th>
          </tr>
        </thead>
        <tbody>
          {last30.map((entry) => (
            <tr key={entry.date} className="border-b border-gray-100">
              <td className="py-2 pr-4">{entry.date}</td>
              <td className="py-2 pr-4">{entry.sleepHours}h</td>
              <td className="py-2 pr-4">
                {entry.calorieLevel}
                {entry.calorieAmount ? ` (${entry.calorieAmount})` : ""}
              </td>
              <td className="py-2 pr-4">{entry.screenTimeMinutes} min</td>
              <td className="py-2 pr-4">
                {entry.producedSomething ? "Yes" : "No"}
              </td>
              <td className="py-2 pr-4">{entry.mood}/5</td>
              <td className="py-2 pr-4">{entry.insight ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}