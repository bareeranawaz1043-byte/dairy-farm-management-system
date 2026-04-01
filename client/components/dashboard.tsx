"use client";

import { useEffect, useState } from "react";
import API from "../utils/api";
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

  const [milkEntries, setMilkEntries] = useState<any[]>([]); // NEW
  const [totalQuantity, setTotalQuantity] = useState(0); // NEW

  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const [cows, milk, sales, alerts] = await Promise.all([
        API.get("/dashboard/total-cows"),
        API.get("/dashboard/total-milk"),
        API.get("/dashboard/total-sales"),
        API.get("/dashboard/alerts"),
      ]);

      setData({
        cows: cows.data.totalCows,
        milk: milk.data.totalMilk,
        sales: sales.data.totalSales,
        alerts: alerts.data.alerts.length,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // NEW: fetch monthly report
  const handleFilter = async (month: string, year: string) => {
    try {
      const res = await API.get(`/dashboard/monthly?month=${month}&year=${year}`);
      setTotalQuantity(res.data.totalQuantity);
      setMilkEntries(res.data.entries);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load monthly report");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">
        Loading Dashboard...
      </p>
    );
  }

  return (
    <div className="p-6 space-y-6">
      
      {/* Filter */}
      <DashboardFilters onFilter={handleFilter} />

      {/* Total Milk for selected month */}
      {totalQuantity > 0 && (
        <p className="text-center font-bold mt-2 text-lg">
          Total Milk for selected month: {totalQuantity} L
        </p>
      )}

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

      {/* NEW: Monthly milk cards */}
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
    </div>
  );
}