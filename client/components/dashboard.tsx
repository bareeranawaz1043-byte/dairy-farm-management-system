"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCrow, FaMoneyBill, FaExclamationTriangle } from "react-icons/fa";
import { GiMilkCarton } from "react-icons/gi";
import DashboardFilters from "./dashboardfilters";

type DashboardData = {
  cows: number;
  milk: number;
  sales: number;
  alerts: number;
};

type MilkEntry = {
  _id: string;
  quantity: number;
  date: string;
  cow?: {
    name: string;
  };
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    cows: 0,
    milk: 0,
    sales: 0,
    alerts: 0,
  });

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [milkEntries, setMilkEntries] = useState<MilkEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [cowsRes, milkRes, salesRes, alertsRes] = await Promise.all([
        fetch("/api/dashboard/total-cows"),
        fetch("/api/dashboard/total-milk"),
        fetch("/api/dashboard/total-sales"),
        fetch("/api/dashboard/alerts"),
      ]);

      const cows = await cowsRes.json();
      const milk = await milkRes.json();
      const sales = await salesRes.json();
      const alerts = await alertsRes.json();

      setData({
        cows: cows.totalCows || 0,
        milk: milk.totalMilk || 0,
        sales: sales.totalSales || 0,
        alerts: alerts.alerts?.length || 0,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (month: string, year: string) => {
    try {
      if (!month || !year) {
        toast.error("Please select a valid month");
        return;
      }

      const res = await fetch(
        `/api/dashboard/monthly?month=${month}&year=${year}`
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setTotalQuantity(data.totalQuantity || 0);
      setMilkEntries(data.entries || []);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error fetching data");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 animate-pulse">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      <DashboardFilters onFilter={handleFilter} />

      {totalQuantity > 0 && (
        <p className="text-center font-bold text-lg">
          Total Milk: {totalQuantity} L
        </p>
      )}

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card title="Total Cows" value={data.cows} icon={<FaCrow />} color="bg-blue-500" />

        <Card title="Total Milk" value={`${data.milk} L`} icon={<GiMilkCarton />} color="bg-green-500" />

        <Card title="Total Sales" value={`Rs ${data.sales}`} icon={<FaMoneyBill />} color="bg-purple-500" />

        <Card title="Alerts" value={data.alerts} icon={<FaExclamationTriangle />} color="bg-red-500" />

      </div>

      
      {milkEntries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {milkEntries.map((entry) => (
            <div key={entry._id} className="p-4 border rounded-xl bg-white shadow-sm">
              <h3 className="font-semibold">
                {entry.cow?.name || "Unknown Cow"}
              </h3>
              <p>Quantity: {entry.quantity} L</p>
              <p>{new Date(entry.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Card({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className={`${color} text-white p-6 rounded-xl flex justify-between items-center`}>
      <div>
        <h2>{title}</h2>
        <p className="text-xl font-bold">{value}</p>
      </div>
      <div className="text-2xl">{icon}</div>
    </div>
  );
}