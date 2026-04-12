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
  if (!milk.length) {
    return <p className="text-center text-gray-500 mt-6">No milk records 🥛</p>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-6 bg-white shadow-xl rounded-2xl overflow-hidden">
      
      <div className="px-4 py-3 border-b font-semibold text-gray-700">
        Milk Records
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-600">
          <tr>
            <th className="p-3 text-left">Cow</th>
            <th className="p-3 text-center">Quantity</th>
            <th className="p-3 text-center">Date</th>
          </tr>
        </thead>

        <tbody>
          {milk.map((item) => (
            <tr key={item._id} className="border-b hover:bg-gray-50 transition">
              
              <td className="p-3 font-medium flex items-center gap-2">
                🐄 {item.cow?.name}
              </td>

              <td className="p-3 text-center font-semibold text-blue-600">
                {item.quantity} L
              </td>

              <td className="p-3 text-center text-gray-500">
                {new Date(item.date).toLocaleDateString()}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}