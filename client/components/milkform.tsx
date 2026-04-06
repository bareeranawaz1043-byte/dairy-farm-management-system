"use client";

import { useEffect, useState, FormEvent } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";

type Cow = {
  _id: string;
  name: string;
};

type Props = {
  fetchMilk: () => void;
};

export default function MilkForm({ fetchMilk }: Props) {
  const [cows, setCows] = useState<Cow[]>([]);
  const [cow, setCow] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch cows
  const fetchCows = async () => {
    try {
      const res = await API.get("/cows");

      const cowsData = res.data?.data || res.data || [];
      setCows(Array.isArray(cowsData) ? cowsData : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load cows");
    }
  };

  useEffect(() => {
    fetchCows();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!cow || !quantity || Number(quantity) <= 0) {
      toast.error("Please enter valid data");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await API.post(
        "/milk",
        {
          cow,
          quantity: Number(quantity),
          date: date || new Date(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Milk record added!");

      setCow("");
      setQuantity("");
      setDate("");

      fetchMilk();
    } catch (error: any) {
      console.error(error);

      if (error.response?.status === 401) {
        toast.error("Unauthorized! Please login again");
      } else {
        toast.error(error.response?.data?.message || "Failed to add milk");
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
        type="number"
        placeholder="Milk (liters)"
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
        className={`bg-blue-500 text-white px-4 py-2 rounded transition ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
      >
        {loading ? "Saving..." : "Add Milk"}
      </button>
    </form>
  );
}