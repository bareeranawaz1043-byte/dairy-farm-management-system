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
};

export default function CowManagement() {
  const [cows, setCows] = useState<Cow[]>([]);
  const [editingCow, setEditingCow] = useState<Cow | null>(null);

  // Fetch cows from backend
  const fetchCows = async () => {
    try {
      const res = await API.get("/cows");
      setCows(res.data);
    } catch (error) {
      console.log("Error fetching cows:", error);
      toast.error("Failed to fetch cows");
    }
  };

  useEffect(() => {
    fetchCows();
  }, []);

  const deleteCow = async (id: string) => {
    try {
      await API.delete(`/cows/${id}`);
      toast.success("Cow deleted successfully!");
      fetchCows();
    } catch (error) {
      console.log("Error deleting cow:", error);
      toast.error("Failed to delete cow");
    }
  };

  const editCow = (cow: Cow) => {
    setEditingCow(cow); 
  };

  const clearEdit = () => {
    setEditingCow(null);
  };

  return (
    <div className="p-6">
    
      <Toaster position="top-right" />

      <CowForm fetchCows={fetchCows} editCow={editingCow} clearEdit={clearEdit} />

      <CowList cows={cows} deleteCow={deleteCow} editCow={editCow} />
    </div>
  );
}