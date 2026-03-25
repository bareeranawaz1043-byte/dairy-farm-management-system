"use client";

import { useEffect, useState } from "react";
import API from "@/utils/api";
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
  const [loading, setLoading] = useState<boolean>(false);


  const fetchFeeding = async () => {
    try {
      setLoading(true);
      const res = await API.get("/feeding");
      setFeeding(res.data);
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
      setCows(res.data);
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
    <div className="p-6">
      <Toaster position="top-right" />

      <FeedingForm cows={cows} fetchFeeding={fetchFeeding} />

    
      {loading ? (
        <p className="text-center text-gray-500 mt-4">
          Loading feeding data...
        </p>
      ) : (
        <FeedingList feeding={feeding} />
      )}
    </div>
  );
}