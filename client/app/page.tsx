"use client";

import { useEffect, useState } from "react";
import API from "@/utils/api";
import CowForm from "@/components/cowform";
import CowList from "@/components/cowlists";

type Cow = {
  _id: string;
  name: string;
  age: number;
};

export default function Home() {
  const [cows, setCows] = useState<Cow[]>([]);
  const fetchCows = async () => {
    try {
      const res = await API.get("/cows");
      setCows(res.data);
    } catch (error) {
      console.log("Error fetching cows:", error);
    }
  };
  const deleteCow = async (id: string) => {
    try {
      await API.delete(`/cows/${id}`);
      fetchCows();
    } catch (error) {
      console.log("Error deleting cow:", error);
    }
  };

  useEffect(() => {
    fetchCows();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          🐄 Cow Management System
        </h1>
        <CowForm fetchCows={fetchCows} />
        <CowList cows={cows} deleteCow={deleteCow} />
      </div>
    </div>
  );
}