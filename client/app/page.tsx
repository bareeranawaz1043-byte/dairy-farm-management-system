"use client";

import { useEffect, useState } from "react";
import API from "../utils/api";
import toast, { Toaster } from "react-hot-toast";
import CowForm from "../components/cowform";
import CowList from "../components/cowlists";
import { Cow } from "../types/cow";

export default function Home() {
  const [cows, setCows] = useState<Cow[]>([]);
  const [editingCow, setEditingCow] = useState<Cow | null>(null);


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


  const editCowHandler = (cow: Cow) => {
    setEditingCow(cow);
  };

  
  const clearEdit = () => {
    setEditingCow(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          🐄 Cow Management System
        </h1>

        
        <CowForm fetchCows={fetchCows} editCow={editingCow} clearEdit={clearEdit} />

      
        <CowList cows={cows} deleteCow={deleteCow} editCow={editCowHandler} />
      </div>
    </div>
  );
}