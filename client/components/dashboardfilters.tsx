"use client";
import { useState } from "react";

type Props = {
  onFilter: (month: string, year: string) => void; // ensure type matches
};

export default function DashboardFilters({ onFilter }: Props) {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(month, year);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="month"
        value={month && year ? `${year}-${month}` : ""}
        onChange={(e) => {
          const [y, m] = e.target.value.split("-");
          setYear(y);
          setMonth(m);
        }}
        className="border p-1 rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-1 rounded">
        Filter
      </button>
    </form>
  );
}