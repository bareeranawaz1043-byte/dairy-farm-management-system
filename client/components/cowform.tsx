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

  useEffect(() => {
    if (editCow) {
      setName(editCow.name);
      setAge(String(editCow.age));
    }
  }, [editCow]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !age) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      if (editCow) {
        await API.put(`/cows/${editCow._id}`, { name, age: Number(age) });
        toast.success("Cow updated successfully!");
        clearEdit && clearEdit();
      } else {
        await API.post("/cows", { name, age: Number(age) });
        toast.success("Cow added successfully!");
      }

      setName("");
      setAge("");
      fetchCows();
    } catch (error) {
      console.log("Error adding/updating cow:", error);
      toast.error("Operation failed!");
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
        className={`px-4 py-2 rounded w-full sm:w-auto text-white font-semibold ${
          editCow ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {editCow ? "Update Cow" : "Add Cow"}
      </button>
    </form>
  );
}