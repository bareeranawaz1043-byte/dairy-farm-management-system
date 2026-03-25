"use client";

type Feeding = {
  _id: string;
  feedType: string;
  quantity: number;
  date: string;
  cow: {
    name: string;
  };
};

export default function FeedingList({ feeding }: { feeding: Feeding[] }) {
  return (
    <div className="mt-6">
      {feeding.length === 0 ? (
        <p>No feeding records</p>
      ) : (
        feeding.map((item) => (
          <div key={item._id} className="bg-gray-100 p-3 mb-2 rounded flex justify-between">
            <span>
              {item.cow.name} - {item.feedType} ({item.quantity}kg)
            </span>
            <span>{new Date(item.date).toLocaleDateString()}</span>
          </div>
        ))
      )}
    </div>
  );
}