"use client";

import { useEffect, useState } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [data, setData] = useState({
    cows: 0,
    milk: 0,
    sales: 0,
    alerts: 0,
  });

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
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return <div className="p-6">Loading Dashboard...</div>;
}