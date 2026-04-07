"use client";

import { useState } from "react";

type Props = {
  onFilter: (month: string, year: string) => void;
};

export default function DashboardFilters({ onFilter }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!value) return;

    const [year, month] = value.split("-");
    onFilter(month, year);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 justify-center">
      <input
        type="month"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border p-2 rounded"
      />

      <button className="bg-blue-500 text-white px-4 rounded">
        Filter
      </button>
    </form>
  );
}