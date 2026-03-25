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

  const fetchFeeding = async () => {
    try {
      const res = await API.get("/feeding");
      setFeeding(res.data);
    } catch (error) {
      toast.error("Failed to fetch feeding");
    }
  };

  const fetchCows = async () => {
    try {
      const res = await API.get("/cows");
      setCows(res.data);
    } catch (error) {
      toast.error("Failed to fetch cows");
    }
  };

  useEffect(() => {
    fetchFeeding();
    fetchCows();
  }, []);

  return (
    <div className="p-6">
      <Toaster />

      <FeedingForm cows={cows} fetchFeeding={fetchFeeding} />

      <FeedingList feeding={feeding} />
    </div>
  );
}