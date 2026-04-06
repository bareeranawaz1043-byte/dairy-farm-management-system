"use client";

import { useEffect, useState } from "react";
import API from "../utils/api";
import toast, { Toaster } from "react-hot-toast";
import FeedingForm from "./feedingform";
import FeedingList from "./feedinglists";

type Cow = {
  _id: string;
  name: string;
};

type Feeding = {
  _id: string;
  feedType: string;
  quantity: number;
  date: string;
  cow: {
    name: string;
  };
};

export default function FeedingManagement() {
  const [feeding, setFeeding] = useState<Feeding[]>([]);
  const [cows, setCows] = useState<Cow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFeeding = async () => {
    try {
      setLoading(true);

      const res = await API.get("/feeding");
      const data = res.data?.data || res.data || [];

      setFeeding(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch feeding");
    } finally {
      setLoading(false);
    }
  };

  const fetchCows = async () => {
    try {
      const res = await API.get("/cows");
      const data = res.data?.data || res.data || [];

      setCows(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch cows");
    }
  };

  useEffect(() => {
    fetchFeeding();
    fetchCows();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold text-center mb-6">
        🥗 Feeding Management
      </h1>

      <FeedingForm cows={cows} fetchFeeding={fetchFeeding} />

      {loading ? (
        <p className="text-center text-gray-500">Loading feeding data...</p>
      ) : (
        <FeedingList feeding={feeding} />
      )}
    </div>
  );
}