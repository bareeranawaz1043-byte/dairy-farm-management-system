"use client";

import { useState, FormEvent } from "react";
import API from "../utils/api";
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!cow || !feedType || !quantity || Number(quantity) <= 0) {
      return toast.error("Please enter valid data");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await API.post(
        "/feeding",
        {
          cow,
          feedType: feedType.trim(),
          quantity: Number(quantity),
          date: date || new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Feeding record added!");

      setCow("");
      setFeedType("");
      setQuantity("");
      setDate("");

      fetchFeeding();

    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 401) {
        toast.error("Unauthorized! Please login again");
      } else {
        toast.error(error.response?.data?.message || "Failed to add feeding");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg p-6 rounded-xl flex flex-col sm:flex-row gap-3 items-center justify-center max-w-4xl mx-auto mb-6"
    >
      <select
        value={cow}
        onChange={(e) => setCow(e.target.value)}
        className="border p-2 rounded w-full sm:w-1/4"
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
        placeholder="Feed Type (e.g. Grass, Grain)"
        value={feedType}
        onChange={(e) => setFeedType(e.target.value)}
        className="border p-2 rounded w-full sm:w-1/4"
      />

      <input
        type="number"
        placeholder="Quantity (kg)"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="border p-2 rounded w-full sm:w-1/4"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 rounded w-full sm:w-1/4"
      />

      <button
  type="submit"
  disabled={loading}
  className={`
    w-full py-3 rounded-xl text-white font-semibold text-lg
    transition-all duration-300
    bg-linear-to-r from-blue-500 to-indigo-600
    hover:from-blue-600 hover:to-indigo-700
    active:scale-95
    shadow-md hover:shadow-lg
    ${loading ? "opacity-50 cursor-not-allowed" : ""}
  `}
>
  {loading ? "Processing..." : "Add Feeding"}
</button>
    </form>
  );
}