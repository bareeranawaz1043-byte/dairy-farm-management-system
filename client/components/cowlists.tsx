"use client";

type Cow = {
  _id: string;
  name: string;
  age: number;
};

type Props = {
  cows?: any;
  deleteCow: (id: string) => void;
  editCow?: (cow: Cow) => void;
};

export default function CowList({ cows, deleteCow, editCow }: Props) {
  const cowArray: Cow[] = Array.isArray(cows) ? cows : [];

  return (
    <div className="mt-6 w-full max-w-2xl mx-auto">
      {cowArray.length === 0 ? (
        <p className="text-gray-500 text-center">No cows available.</p>
      ) : (
        cowArray.map((cow) => (
          <div
            key={cow._id}
            className="flex justify-between items-center bg-gray-100 p-4 mb-2 rounded hover:bg-gray-200 transition"
          >
            <span className="text-gray-700 font-medium">
              {cow.name} - {cow.age} years
            </span>

            <div className="flex gap-2">
              <button
                onClick={() => editCow && editCow(cow)}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteCow(cow._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}