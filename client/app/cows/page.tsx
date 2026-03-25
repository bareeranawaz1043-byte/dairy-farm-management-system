"use client";

import { useEffect, useState } from "react";
import API from "@/utils/api";
import CowForm from "@/components/cowform";

export default function CowPage() {
  const [cows, setCows] = useState([]);

  const fetchCows = async () => {
    const res = await API.get("/cows");
    setCows(res.data);
  };

  useEffect(() => {
    fetchCows();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Cow Management</h1>
      <CowForm fetchCows={fetchCows} />
    </div>
  );
}