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

export default function MilkManagement() {
  const [milk, setMilk] = useState<Milk[]>([]);

  const fetchMilk = async () => {
    try {
      const res = await API.get("/milk");
      setMilk(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch milk");
    }
  };

  useEffect(() => {
    fetchMilk();
  }, []);

  return (
    <div className="p-6">
      <Toaster position="top-right" />

      <MilkForm fetchMilk={fetchMilk} />

      <MilkList milk={milk} />
    </div>
  );
}