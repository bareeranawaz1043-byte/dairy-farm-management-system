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
  const [loading, setLoading] = useState(false); // ✅ NEW

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!cow || !feedType || !quantity) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true); 

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
      toast.error("Failed to add feeding");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <form className="bg-white shadow-md rounded-lg p-6 mb-6 flex flex-col gap-3" onSubmit={handleSubmit}>
      
      <select
        value={cow}
        onChange={(e) => setCow(e.target.value)}
        className="border p-2 rounded focus:outline-blue-400"
      >
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
        className="border p-2 rounded focus:outline-blue-400"
      />

      <input
        type="number"
        placeholder="Quantity (kg)"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="border p-2 rounded focus:outline-blue-400"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 rounded focus:outline-blue-400"
      />

      <button
        disabled={loading}
        className={`text-white p-2 rounded font-semibold ${
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Adding..." : "Add Feeding"}
      </button>
    </form>
  );
}