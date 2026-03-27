"use client";

import { useState, FormEvent, useEffect } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";

type Props = {
  fetchSales: () => void;
};

type Cow = {
  _id: string;
  name: string;
};

export default function SalesForm({ fetchSales }: Props) {
  const [cows, setCows] = useState<Cow[]>([]);
  const [cowId, setCowId] = useState<string>("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [price, setPrice] = useState<number | "">("");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);

  // Fetch cows for dropdown
  const fetchCows = async () => {
    try {
      const res = await API.get("/cows");
      setCows(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch cows");
    }
  };

  useEffect(() => {
    fetchCows();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!cowId || quantity === "" || price === "") {
      toast.error("Please fill all fields");
      return;
    }

    if (quantity < 0 || price < 0) {
      toast.error("Values cannot be negative");
      return;
    }

    setLoading(true);
    try {
      await API.post("/sales", { cow: cowId, quantity, price, date });
      toast.success("Sale added successfully!");
      setCowId("");
      setQuantity("");
      setPrice("");
      setDate(new Date().toISOString().slice(0, 10));
      fetchSales();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add sale");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 flex flex-col sm:flex-row gap-3 items-center justify-center w-full max-w-2xl mx-auto mb-6"
    >
      <select
        value={cowId}
        onChange={(e) => setCowId(e.target.value)}
        className="border p-2 rounded w-full sm:w-1/4 focus:outline-blue-400"
      >
        <option value="">Select Cow</option>
        {cows.map((cow) => (
          <option key={cow._id} value={cow._id}>
            {cow.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="border p-2 rounded w-full sm:w-1/5 focus:outline-blue-400"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="border p-2 rounded w-full sm:w-1/5 focus:outline-blue-400"
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 rounded w-full sm:w-1/5 focus:outline-blue-400"
      />

      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded w-full sm:w-auto text-white font-semibold ${
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Saving..." : "Add Sale"}
      </button>
    </form>
  );
}