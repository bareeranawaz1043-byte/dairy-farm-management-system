"use client";

type Milk = {
  _id: string;
  quantity: number;
  date: string;
  cow: {
    name: string;
  };
};

type Props = {
  milk: Milk[];
};

export default function MilkList({ milk }: Props) {
  return (
    <div className="max-w-3xl mx-auto">
      {milk.length === 0 ? (
        <p className="text-center text-gray-500">No milk records</p>
      ) : (
        milk.map((item) => (
          <div
            key={item._id}
            className="bg-gray-100 p-4 mb-2 rounded flex justify-between"
          >
            <span>
              🐄 {item.cow?.name} - {item.quantity}L
            </span>
            <span className="text-gray-600">
              {new Date(item.date).toLocaleDateString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
}