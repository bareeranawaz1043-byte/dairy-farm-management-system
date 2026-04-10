"use client";

import { useState } from "react";
import { Cow } from "../types/cow";

type Props = {
  cows: Cow[]; // ✅ FIXED (not optional)
  deleteCow: (id: string) => void;
  editCow?: (cow: Cow) => void;
};

export default function CowList({ cows, deleteCow, editCow }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCow, setSelectedCow] = useState<Cow | null>(null);

  const itemsPerPage = 5;

  // ✅ Safety (important)
  const safeCows = Array.isArray(cows) ? cows : [];

  // 🔍 Search + Filter
  const filteredCows = safeCows.filter((cow) => {
    const matchSearch = cow.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchFilter =
      filter === "all" ||
      (filter === "healthy" && cow.health !== "sick") ||
      (filter === "sick" && cow.health === "sick");

    return matchSearch && matchFilter;
  });

  // 📄 Pagination
  const totalPages = Math.ceil(filteredCows.length / itemsPerPage);

  const paginatedCows = filteredCows.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!safeCows.length) {
    return <p className="text-center text-gray-500 mt-6">No cows found 🐄</p>;
  }

  return (
    <div className="mt-6 max-w-6xl mx-auto">
      
      {/* 🔍 Search + Filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded w-full sm:w-1/3"
        />

        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded w-full sm:w-1/4"
        >
          <option value="all">All</option>
          <option value="healthy">Healthy</option>
          <option value="sick">Sick</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3">Age</th>
              <th className="p-3">Breed</th>
              <th className="p-3">Milk</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedCows.map((cow) => (
              <tr key={cow._id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{cow.name}</td>
                <td className="p-3 text-center">{cow.age}</td>
                <td className="p-3 text-center">{cow.breed}</td>
                <td className="p-3 text-center">{cow.milkCapacity} L</td>

                <td className="p-3 text-center">
                  {cow.health === "sick" ? (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">
                      Sick
                    </span>
                  ) : (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                      Healthy
                    </span>
                  )}
                </td>

                <td className="p-3 flex justify-center gap-2">
                  {editCow && (
                    <button
                      onClick={() => editCow(cow)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedCow(cow)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Delete Modal */}
      {selectedCow && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <p className="mb-4">
              Are you sure you want to delete{" "}
              <strong>{selectedCow.name}</strong>?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  deleteCow(selectedCow._id);
                  setSelectedCow(null);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Yes, Delete
              </button>

              <button
                onClick={() => setSelectedCow(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}