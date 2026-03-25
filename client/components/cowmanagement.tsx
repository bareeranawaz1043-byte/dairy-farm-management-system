"use client";

import { useState, useEffect } from "react";
import API from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";
import CowForm from "./cowform";
import CowList from "./cowlists";

type Cow = {
  _id: string;
  name: string;
  age: number;
  health?: string;
};

export default function CowManagement() {
  const [cows, setCows] = useState<Cow[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]); 
  const [editingCow, setEditingCow] = useState<Cow | null>(null);

  const fetchCows = async () => {
    try {
      const res = await API.get("/cows");
      setCows(res.data.data);
    } catch {
      toast.error("Failed to fetch cows");
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await API.get("/cows/alerts");
      setAlerts(res.data);
    } catch {
      toast.error("Failed to fetch alerts");
    }
  };

  useEffect(() => {
    fetchCows();
    fetchAlerts();
  }, []);

  const deleteCow = async (id: string) => {
    await API.delete(`/cows/${id}`);
    fetchCows();
  };

  return (
    <div className="p-6">
      <Toaster />

      
      <div className="max-w-2xl mx-auto mb-4">
        {alerts.map((alert, i) => (
          <div key={i} className="bg-red-500 text-white p-2 mb-2 rounded">
            🚨 {alert.message}
          </div>
        ))}
      </div>

      <CowForm fetchCows={fetchCows} editCow={editingCow} />

      <CowList cows={cows} deleteCow={deleteCow} />
    </div>
  );
}