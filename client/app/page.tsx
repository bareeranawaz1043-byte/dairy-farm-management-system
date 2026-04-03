"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../utils/api";
import toast, { Toaster } from "react-hot-toast";
import CowForm from "../components/cowform";
import CowList from "../components/cowlists";
import { Cow } from "../types/cow";

export default function Home() {
  const router = useRouter();

  const [cows, setCows] = useState<Cow[]>([]);
  const [editingCow, setEditingCow] = useState<Cow | null>(null);
  const [authorized, setAuthorized] = useState(false);

  // ✅ Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      setAuthorized(true);
      fetchCows();
    }
  }, []);

  const fetchCows = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await API.get("/cows", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setCows(res.data);
  } catch (error) {
    console.log("Error fetching cows:", error);
    toast.error("Failed to fetch cows");
  }
};

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

  // ✅ Prevent flicker
  if (!authorized) {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">
          🐄 Cow Management System
        </h1>

        <CowForm
          fetchCows={fetchCows}
          editCow={editingCow}
          clearEdit={clearEdit}
        />

        <CowList
          cows={cows}
          deleteCow={deleteCow}
          editCow={editCowHandler}
        />
      </div>
    </div>
  );
}