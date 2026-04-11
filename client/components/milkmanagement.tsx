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

    } catch (error) {
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

    } catch (error) {
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

      <h1 className="text-3xl font-bold text-center mb-6">
        🥛 Milk Dashboard
      </h1>

      <MilkForm fetchMilk={fetchMilk} />

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <MilkList milk={milk} />
      )}

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <div className="bg-blue-500 text-white p-5 rounded">
          <h3>Total Milk</h3>
          <p className="text-2xl">{totalMilk} L</p>
        </div>

        <div className="bg-green-500 text-white p-5 rounded">
          <h3>Today</h3>
          <p className="text-2xl">{dailyMilk} L</p>
        </div>

        <div className="bg-yellow-500 text-white p-5 rounded col-span-3">
          <h3>Milk Per Cow</h3>

          <div className="flex flex-wrap gap-2 mt-2">
            {milkPerCow.length === 0 ? (
              <p>No data</p>
            ) : (
              milkPerCow.map((cow) => (
                <span
                  key={cow.cowName}
                  className="bg-white text-black px-2 py-1 rounded"
                >
                  {cow.cowName}: {cow.totalMilk} L
                </span>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}