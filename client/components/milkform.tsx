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

  // ✅ Fetch cows (FIXED)
  const fetchCows = async () => {
    try {
      const res = await API.get("/cows");

      console.log("COWS API RESPONSE:", res.data); // ✅ DEBUG

      // ✅ Handle both cases (array OR object)
      if (Array.isArray(res.data.data)) {
        setCows(res.data.data);
      } else if (Array.isArray(res.data.cows)) {
        setCows(res.data.cows);
      } else {
        setCows([]); // fallback
      }
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
      toast.error("Enter valid data");
      return;
    }

    try {
      setLoading(true);

      await API.post("/milk", {
        cow,
        quantity: Number(quantity),
        date: date || new Date(),
      });

      toast.success("Milk added successfully!");

      setCow("");
      setQuantity("");
      setDate("");

      fetchMilk();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add milk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="bg-white shadow-md p-6 rounded-lg flex flex-col sm:flex-row gap-3 justify-center items-center max-w-3xl mx-auto mb-6"
      onSubmit={handleSubmit}
    >
      <select
        value={cow}
        onChange={(e) => setCow(e.target.value)}
        className="border p-2 rounded w-full sm:w-1/4"
      >
        <option value="">Select Cow</option>

        {/* ✅ SAFE MAP FIX */}
        {Array.isArray(cows) &&
          cows.map((c) => (
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
        className={`bg-blue-500 text-white px-4 py-2 rounded ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
      >
        {loading ? "Processing..." : "Add Milk"}
      </button>
    </form>
  );
}