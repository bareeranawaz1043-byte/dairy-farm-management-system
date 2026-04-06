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
  if (!feeding.length) {
    return <p className="text-center text-gray-500 mt-6">No feeding records 🥗</p>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-6 bg-white shadow-lg rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Cow</th>
            <th className="p-3 text-center">Feed</th>
            <th className="p-3 text-center">Quantity</th>
            <th className="p-3 text-center">Date</th>
          </tr>
        </thead>

        <tbody>
          {feeding.map((item) => (
            <tr key={item._id} className="border-b hover:bg-gray-50">
              <td className="p-3 font-medium">🐄 {item.cow?.name}</td>

              <td className="p-3 text-center">
                {item.feedType}
              </td>

              <td className="p-3 text-center">
                {item.quantity} kg
              </td>

              <td className="p-3 text-center text-gray-600">
                {new Date(item.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}