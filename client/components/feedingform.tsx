"use client";

import { useState, FormEvent } from "react";
import API from "@/utils/api";
import toast from "react-hot-toast";

type Cow = {
  _id: string;
  name: string;
};

type Props = {
  cows: Cow[];
  fetchFeeding: () => void;
};

export default function FeedingForm({ cows, fetchFeeding }: Props) {
  const [cow, setCow] = useState("");
  const [feedType, setFeedType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!cow || !feedType || !quantity) {
      return toast.error("All fields are required");
    }

    try {
      await API.post("/feeding", {
        cow,
        feedType,
        quantity: Number(quantity),
        date,
      });

      toast.success("Feeding added!");
      setCow("");
      setFeedType("");
      setQuantity("");
      setDate("");

      fetchFeeding();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add feeding");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 flex flex-col gap-3">
      
      <select value={cow} onChange={(e) => setCow(e.target.value)} className="border p-2 rounded">
        <option value="">Select Cow</option>
        {cows.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Feed Type"
        value={feedType}
        onChange={(e) => setFeedType(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="number"
        placeholder="Quantity (kg)"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="border p-2 rounded"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 rounded"
      />

      <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
        Add Feeding
      </button>
    </form>
  );
}