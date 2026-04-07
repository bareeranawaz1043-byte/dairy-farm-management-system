"use client";

type Sale = {
  _id: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
  cow?: {
    name: string;
  };
};

type Props = {
  sales: Sale[];
};

export default function SalesList({ sales }: Props) {
  return (
    <div className="mt-6 w-full max-w-3xl mx-auto">
      {sales.length === 0 ? (
        <p className="text-gray-500 text-center">No sales recorded.</p>
      ) : (
        sales.map((sale) => (
          <div
            key={sale._id}
            className="flex justify-between items-center bg-gray-100 p-4 mb-2 rounded"
          >
            <div>
              <p className="font-medium">
                {sale.cow?.name || "Unknown Cow"} {/* ✅ FIX */}
              </p>

              <p className="text-sm text-gray-600">
                Quantity: {sale.quantity} | Price: {sale.price} | Total:{" "}
                {sale.total}
              </p>
            </div>

            <div className="text-sm text-gray-500">
              {new Date(sale.date).toLocaleDateString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}