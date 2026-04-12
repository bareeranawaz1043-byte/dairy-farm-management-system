"use client";

import { useEffect, useState } from "react";
import API from "../utils/api";
import toast, { Toaster } from "react-hot-toast";
import MilkForm from "./milkform";
import MilkList from "./milklists";

type Milk = {
  _id: string;
  quantity: number;
  date: string;
  cow: { name: string };
};

type MilkPerCow = {
  cowName: string;
  totalMilk: number;
};

export default function MilkManagement() {
  const [milk, setMilk] = useState<Milk[]>([]);
  const [totalMilk, setTotalMilk] = useState(0);
  const [dailyMilk, setDailyMilk] = useState(0);
  const [milkPerCow, setMilkPerCow] = useState<MilkPerCow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMilk = async () => {
    try {
      setLoading(true);
      const res = await API.get("/milk");
      const data = res.data?.data || res.data || [];
      setMilk(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch milk");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [totalRes, dailyRes, perCowRes] = await Promise.all([
        API.get("/milk/total"),
        API.get("/milk/daily"),
        API.get("/milk/per-cow"),
      ]);

      setTotalMilk(totalRes.data?.totalMilk || 0);
      setDailyMilk(dailyRes.data?.dailyMilk || 0);

      const perCow = perCowRes.data?.data || perCowRes.data;
      setMilkPerCow(Array.isArray(perCow) ? perCow : []);
    } catch {
      toast.error("Failed to fetch stats");
    }
  };

  useEffect(() => {
    fetchMilk();
    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster />

      <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">
        🥛 Milk Dashboard
      </h1>

      <MilkForm fetchMilk={fetchMilk} />

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <MilkList milk={milk} />
      )}

      {/* STATS */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

        <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <h3>Total Milk</h3>
          <p className="text-3xl font-bold mt-2">{totalMilk} L</p>
        </div>

        <div className="bg-linear-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <h3>Today's Milk</h3>
          <p className="text-3xl font-bold mt-2">{dailyMilk} L</p>
        </div>

        <div className="bg-linear-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-xl shadow-lg col-span-1 sm:col-span-2 lg:col-span-3">
          <h3 className="mb-3">Milk Per Cow</h3>

          <div className="flex flex-wrap gap-3">
            {milkPerCow.length === 0 ? (
              <p>No data</p>
            ) : (
              milkPerCow.map((cow) => (
                <span
                  key={cow.cowName}
                  className="bg-white text-gray-800 px-4 py-2 rounded-full text-sm font-medium shadow"
                >
                  🐄 {cow.cowName}: {cow.totalMilk} L
                </span>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}