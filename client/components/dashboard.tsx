"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCrow, FaMoneyBill, FaExclamationTriangle } from "react-icons/fa";
import { GiMilkCarton } from "react-icons/gi";
import DashboardFilters from "./dashboardfilters";

export default function Dashboard() {
  const [data, setData] = useState({
    cows: 0,
    milk: 0,
    sales: 0,
    alerts: 0,
  });

  const [totalQuantity, setTotalQuantity] = useState(0);
  const [milkEntries, setMilkEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard totals
  const fetchDashboard = async () => {
    try {
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

  // ✅ Improved Error Handling (Branch 2)
  const handleFilter = async (month: string, year: string) => {
    try {
      if (!month || !year) {
        toast.error("Please select a valid month");
        return;
      }

      const res = await fetch(`/api/dashboard/monthly?month=${month}&year=${year}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error fetching data");
      }

      setTotalQuantity(data.totalQuantity);
      setMilkEntries(data.entries);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ✅ Improved Loading UI (Branch 1)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Filter */}
      <DashboardFilters onFilter={handleFilter} />

      {/* Total Milk */}
      {totalQuantity > 0 && (
        <p className="text-center font-bold mt-2 text-lg">
          Total Milk for selected month: {totalQuantity} L
        </p>
      )}

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {/* Total Cows */}
        <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg flex items-center justify-between hover:scale-105 transition duration-300">
          <div>
            <h2 className="text-lg">Total Cows</h2>
            <p className="text-2xl font-bold">{data.cows}</p>
          </div>
          <FaCrow size={30} />
        </div>

        {/* Total Milk */}
        <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg flex items-center justify-between hover:scale-105 transition duration-300">
          <div>
            <h2 className="text-lg">Total Milk</h2>
            <p className="text-2xl font-bold">{data.milk} L</p>
          </div>
          <GiMilkCarton size={30} />
        </div>

        {/* Total Sales */}
        <div className="bg-purple-500 text-white p-6 rounded-xl shadow-lg flex items-center justify-between hover:scale-105 transition duration-300">
          <div>
            <h2 className="text-lg">Total Sales</h2>
            <p className="text-2xl font-bold">Rs {data.sales}</p>
          </div>
          <FaMoneyBill size={30} />
        </div>

        {/* Alerts */}
        <div className="bg-red-500 text-white p-6 rounded-xl shadow-lg flex items-center justify-between hover:scale-105 transition duration-300">
          <div>
            <h2 className="text-lg">Alerts</h2>
            <p className="text-2xl font-bold">{data.alerts}</p>
          </div>
          <FaExclamationTriangle size={30} />
        </div>
      </div>

      {/* Monthly Milk Cards */}
      {milkEntries.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {milkEntries.map((entry) => (
            <div key={entry._id} className="p-4 border rounded shadow-sm bg-white">
              <h3 className="font-semibold">{entry.cow.name}</h3>
              <p>Quantity: {entry.quantity} L</p>
              <p>Date: {new Date(entry.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Empty State (Branch 1) */}
      {milkEntries.length === 0 && totalQuantity > 0 && (
        <p className="text-center text-gray-500 mt-4">
          No milk records found for selected month
        </p>
      )}
    </div>
  );
}