"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import API from "../utils/api";
import SalesForm from "./salesform";
import SalesList from "./saleslists";

type Sale = {
  _id: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
  cow: {
    name: string;
  };
};

export default function SalesManagement() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const res = await API.get("/sales");
      setSales(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch sales");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <SalesForm fetchSales={fetchSales} />
      {loading ? (
        <p className="text-center text-gray-500 mt-4">Loading sales...</p>
      ) : (
        <SalesList sales={sales} />
      )}
    </div>
  );
}