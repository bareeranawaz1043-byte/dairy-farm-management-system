"use client";

type Cow = {
  _id: string;
  name: string;
  age: number;
};

type Props = {
  cows: Cow[];
  deleteCow: (id: string) => void;
};

export default function CowList({ cows, deleteCow }: Props) {
  return (
    <div className="mt-6">
      {cows.map((cow) => (
        <div
          key={cow._id}
          className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded"
        >
          <span>
            {cow.name} - {cow.age} years
          </span>

          <button
            onClick={() => deleteCow(cow._id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}