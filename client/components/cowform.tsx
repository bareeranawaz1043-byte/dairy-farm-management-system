"use client";

import { useState, useEffect, FormEvent } from "react";
import API from "@/utils/api";
import toast from "react-hot-toast";

type Props = {
  fetchCows: () => void;
  editCow?: { _id: string; name: string; age: number } | null;
  clearEdit?: () => void;
};

export default function CowForm({ fetchCows, editCow, clearEdit }: Props) {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (editCow) {
      setName(editCow.name);
      setAge(String(editCow.age));
    }
  }, [editCow]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (!name || !age || Number(age) <= 0) {
      toast.error("Enter valid name and age");
      return;
    }

    try {
      setLoading(true);

      if (editCow) {
        await API.put(`/cows/${editCow._id}`, {
          name,
          age: Number(age),
        });
        toast.success("Cow updated successfully!");
        clearEdit && clearEdit();
      } else {
        await API.post("/cows", {
          name,
          age: Number(age),
        });
        toast.success("Cow added successfully!");
      }

      // Reset form
      setName("");
      setAge("");
      fetchCows();
    } catch (error) {
      console.error("Error adding/updating cow:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 flex flex-col sm:flex-row gap-3 items-center justify-center w-full max-w-2xl mx-auto mb-6"
    >
      <input
        type="text"
        placeholder="Cow Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full sm:w-1/3 focus:outline-blue-400"
      />

      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="border p-2 rounded w-full sm:w-1/3 focus:outline-blue-400"
      />

      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded w-full sm:w-auto text-white font-semibold ${
          editCow
            ? "bg-yellow-500 hover:bg-yellow-600"
            : "bg-blue-500 hover:bg-blue-600"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading
          ? "Processing..."
          : editCow
          ? "Update Cow"
          : "Add Cow"}
      </button>
    </form>
  );
}