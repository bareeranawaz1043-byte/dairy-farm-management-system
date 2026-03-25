"use client";

import { useEffect, useState } from "react";
import API from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";
import MilkForm from "./milkform";
import MilkList from "./milklists";

type Milk = {
  _id: string;
  quantity: number;
  date: string;
  cow: {
    name: string;
  };
};

type MilkPerCow = {
  cowName: string;
  totalMilk: number;
};

export default function MilkManagement() {
  const [milk, setMilk] = useState<Milk[]>([]);
  const [totalMilk, setTotalMilk] = useState<number>(0);
  const [dailyMilk, setDailyMilk] = useState<number>(0);
  const [milkPerCow, setMilkPerCow] = useState<MilkPerCow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch all milk entries
  const fetchMilk = async () => {
    try {
      setLoading(true);
      const res = await API.get("/milk");
      setMilk(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error("Failed to fetch milk");
    }
  };

  // Fetch stats for Day 7
  const fetchStats = async () => {
    try {
      const [totalRes, dailyRes, perCowRes] = await Promise.all([
        API.get("/milk/total"),
        API.get("/milk/daily"),
        API.get("/milk/per-cow"),
      ]);

      setTotalMilk(totalRes.data.totalMilk);
      setDailyMilk(dailyRes.data.dailyMilk);
      setMilkPerCow(perCowRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch stats");
    }
  };

  useEffect(() => {
    fetchMilk();
    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <Toaster position="top-right" />

      <MilkForm fetchMilk={fetchMilk} />

      <MilkList milk={milk} />

      {/* Stats Section */}
      <div className="mt-8 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Total Milk</h3>
          <p className="text-2xl font-bold">{totalMilk} L</p>
        </div>

        <div className="bg-green-500 text-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">Today's Milk</h3>
          <p className="text-2xl font-bold">{dailyMilk} L</p>
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded shadow col-span-1 sm:col-span-2 lg:col-span-3">
          <h3 className="text-lg font-semibold mb-2">Milk Per Cow</h3>
          <div className="flex flex-wrap gap-2">
            {milkPerCow.length === 0 && <p>No cow stats available</p>}
            {milkPerCow.map((cow) => (
              <span
                key={cow.cowName}
                className="bg-white text-gray-800 px-3 py-1 rounded shadow"
              >
                {cow.cowName}: {cow.totalMilk} L
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}