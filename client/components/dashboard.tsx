"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCrow, FaMoneyBill, FaExclamationTriangle } from "react-icons/fa";
import { GiMilkCarton } from "react-icons/gi";
import DashboardFilters from "./dashboardfilters";
import API from "../utils/api";

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
        API.get("/dashboard/total-cows"),
        API.get("/dashboard/total-milk"),
        API.get("/dashboard/total-sales"),
        API.get("/dashboard/alerts"),
      ]);

      setData({
        cows: cowsRes.data?.totalCows || 0,
        milk: milkRes.data?.totalMilk || 0,
        sales: salesRes.data?.totalSales || 0,
        alerts: alertsRes.data?.alerts?.length || 0,
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
        toast.error("Select month & year");
        return;
      }

      const res = await API.get(
        `/dashboard/monthly?month=${month}&year=${year}`
      );

      setTotalQuantity(res.data?.totalQuantity || 0);
      setMilkEntries(res.data?.entries || []);

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
      <p className="text-center mt-10 text-gray-500">Loading Dashboard...</p>
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
              <h3>{entry.cow?.name || "Unknown"}</h3>
              <p>{entry.quantity} L</p>
              <p>{new Date(entry.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Card({ title, value, icon, color }: any) {
  return (
    <div className={`${color} text-white p-6 rounded-xl flex justify-between`}>
      <div>
        <h2>{title}</h2>
        <p className="text-xl font-bold">{value}</p>
      </div>
      <div className="text-2xl">{icon}</div>
    </div>
  );
}