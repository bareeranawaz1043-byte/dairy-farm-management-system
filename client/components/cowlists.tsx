"use client";

type Cow = {
  _id: string;
  name: string;
  age: number;
  health?: string; 
};

type Props = {
  cows?: Cow[]; // optional, defaults to []
  deleteCow: (id: string) => void;
  editCow?: (cow: Cow) => void;
};

export default function CowList({ cows = [], deleteCow, editCow }: Props) {
  if (!Array.isArray(cows) || cows.length === 0) {
    return <p className="text-gray-500 text-center">No cows available.</p>;
  }

  return (
    <div className="mt-6 w-full max-w-2xl mx-auto">
      {cows.map((cow) => (
        <div
          key={cow._id}
          className={`flex justify-between items-center p-4 mb-2 rounded ${
            cow.health === "sick"
              ? "bg-red-100 border border-red-400"
              : "bg-gray-100"
          }`}
        >
          <span>
            {cow.name} - {cow.age} years
            {cow.health === "sick" && (
              <span className="text-red-500 ml-2 font-semibold">(Sick)</span>
            )}
          </span>

          <div className="flex gap-2">
            {editCow && (
              <button
                onClick={() => editCow(cow)}
                className="bg-yellow-400 px-3 py-1 rounded text-white"
              >
                Edit
              </button>
            )}

            <button
              onClick={() => deleteCow(cow._id)}
              className="bg-red-500 px-3 py-1 rounded text-white"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}