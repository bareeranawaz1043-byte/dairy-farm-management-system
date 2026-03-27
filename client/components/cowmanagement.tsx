"use client";

import { useState, useEffect, FormEvent } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";

type Cow = {
  _id: string;
  name: string;
  age: number;
  breed: string;
  milkCapacity: number;
  health?: "healthy" | "sick";
  vaccination?: string;
};

type Props = {
  fetchCows: () => void;
  editCow?: Cow | null;
  clearEdit?: () => void;
};

export default function CowForm({ fetchCows, editCow, clearEdit }: Props) {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [breed, setBreed] = useState<string>("");
  const [milkCapacity, setMilkCapacity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (editCow) {
      setName(editCow.name);
      setAge(String(editCow.age));
      setBreed(editCow.breed);
      setMilkCapacity(String(editCow.milkCapacity));
    } else {
      setName("");
      setAge("");
      setBreed("");
      setMilkCapacity("");
    }
  }, [editCow]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !age || !breed || !milkCapacity) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: name.trim(),
        age: Number(age),
        breed: breed.trim(),
        milkCapacity: Number(milkCapacity),
      };

      if (editCow) {
        await API.put(`/cows/${editCow._id}`, payload);
        toast.success("Cow updated successfully!");
        clearEdit && clearEdit();
      } else {
        await API.post("/cows", payload);
        toast.success("Cow added successfully!");
      }

      setName("");
      setAge("");
      setBreed("");
      setMilkCapacity("");
      fetchCows();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl mx-auto mb-6"
    >
      <div className="flex flex-wrap gap-4 items-center justify-center">
        <input
          type="text"
          placeholder="Cow Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[150px]"
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[100px]"
          required
        />
        <input
          type="text"
          placeholder="Breed"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[150px]"
          required
        />
        <input
          type="number"
          placeholder="Milk Capacity"
          value={milkCapacity}
          onChange={(e) => setMilkCapacity(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[120px]"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white font-semibold ${
            editCow ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Processing..." : editCow ? "Update Cow" : "Add Cow"}
        </button>
      </div>
    </form>
  );
}