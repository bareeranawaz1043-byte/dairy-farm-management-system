"use client";

import { useEffect, useState } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";
import CowForm from "./cowform";
import CowList from "./cowlists";

type Cow = {
  _id: string; 
  name: string;
  age: number;
  breed: string;
  milkCapacity: number;
  health?: "healthy" | "sick";
  vaccination?: string;
};

export default function CowManagement() {
  const [cows, setCows] = useState<Cow[]>([]);
  const [editingCow, setEditingCow] = useState<Cow | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchCows = async () => {
    try {
      setLoading(true);
      const res = await API.get<{ success: boolean; count: number; data: Cow[] }>("/cows");
      setCows(res.data.data);
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to fetch cows");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCows();
  }, []);

  const deleteCow = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/cows/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Cow deleted successfully!");
      setCows(prev => prev.filter(cow => cow._id !== id)); // update locally
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };
  const editCowHandler = (cow: Cow) => setEditingCow(cow);
  const clearEdit = () => setEditingCow(null);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🐄 Cow Management</h1>

        <CowForm fetchCows={fetchCows} editCow={editingCow} clearEdit={clearEdit} />

        {loading ? (
          <p className="text-center text-gray-500">Loading cows...</p>
        ) : (
          <CowList cows={cows} deleteCow={deleteCow} editCow={editCowHandler} />
        )}
      </div>
    </div>
  );
}