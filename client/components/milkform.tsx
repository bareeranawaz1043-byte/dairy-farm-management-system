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

  const fetchCows = async () => {
    try {
      const res = await API.get("/cows");
      const cowsData = res.data?.data || res.data || [];
      setCows(Array.isArray(cowsData) ? cowsData : []);
    } catch {
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Milk record added!");

      setCow("");
      setQuantity("");
      setDate("");

      fetchMilk();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add milk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 mb-6 max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
        🥛 Add Milk Record
      </h2>

      <form className="grid grid-cols-1 md:grid-cols-4 gap-4" onSubmit={handleSubmit}>
        
        <select
          value={cow}
          onChange={(e) => setCow(e.target.value)}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
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
          className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-linear-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:scale-105 transition"
        >
          {loading ? "Saving..." : "Add Milk"}
        </button>
      </form>
    </div>
  );
}