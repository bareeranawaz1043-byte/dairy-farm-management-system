"use client";

import { Cow } from "../types/cow";

type Props = {
  cows?: Cow[];
  deleteCow: (id: string) => void;
  editCow?: (cow: Cow) => void;
};

export default function CowList({ cows = [], deleteCow, editCow }: Props) {
  // ✅ Empty state
  if (!Array.isArray(cows) || cows.length === 0) {
    return (
      <div className="text-center mt-6 text-gray-500">
        <p>No cows available 🐄</p>
      </div>
    );
  }

  return (
    <div className="mt-6 w-full max-w-5xl mx-auto">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-100 px-6 py-3 font-semibold text-gray-700">
          Cow List
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Age</th>
                <th className="px-4 py-3">Breed</th>
                <th className="px-4 py-3">Milk Capacity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {cows.map((cow) => (
                <tr
                  key={cow._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium text-gray-700">
                    {cow.name}
                  </td>

                  <td className="px-4 py-3">{cow.age} yrs</td>

                  <td className="px-4 py-3">{cow.breed}</td>

                  <td className="px-4 py-3">
                    {cow.milkCapacity} L
                  </td>

                  {/* ✅ Status Badge */}
                  <td className="px-4 py-3">
                    {cow.health === "sick" ? (
                      <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                        Sick
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-semibold">
                        Healthy
                      </span>
                    )}
                  </td>

                  {/* ✅ Actions */}
                  <td className="px-4 py-3 flex justify-center gap-2">
                    {editCow && (
                      <button
                        onClick={() => editCow(cow)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() => deleteCow(cow._id)}
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
      </div>
    </div>
  );
}