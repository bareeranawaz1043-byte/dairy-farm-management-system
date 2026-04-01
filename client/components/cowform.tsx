"use client";

import { useState, useEffect, FormEvent } from "react";
import API from "../utils/api";
import toast from "react-hot-toast";
import { Cow } from "../types/cow";

type Props = {
  fetchCows: () => void;
  editCow?: Cow | null;
  clearEdit?: () => void;
};

export default function CowForm({ fetchCows, editCow, clearEdit }: Props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [breed, setBreed] = useState("");
  const [milkCapacity, setMilkCapacity] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (
      !name.trim() ||
      !age.trim() ||
      !breed.trim() ||
      !milkCapacity.trim() ||
      Number(age) <= 0 ||
      Number(milkCapacity) <= 0
    ) {
      toast.error("Please fill all fields correctly");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token"); // ✅ GET TOKEN

      const payload = {
        name: name.trim(),
        age: Number(age),
        breed: breed.trim(),
        milkCapacity: Number(milkCapacity),
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // ✅ SEND TOKEN
        },
      };

      if (editCow) {
        await API.put(`/cows/${editCow._id}`, payload, config);
        toast.success("Cow updated successfully!");
        clearEdit && clearEdit();
      } else {
        await API.post("/cows", payload, config); // ✅ FIXED
        toast.success("Cow added successfully!");
      }

      setName("");
      setAge("");
      setBreed("");
      setMilkCapacity("");
      fetchCows();
    } catch (error: any) {
      console.error("Error:", error);

      if (error.response?.status === 401) {
        toast.error("Unauthorized! Please login again");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
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
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[100px]"
        />

        <input
          type="text"
          placeholder="Breed"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[150px]"
        />

        <input
          type="number"
          placeholder="Milk Capacity"
          value={milkCapacity}
          onChange={(e) => setMilkCapacity(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[120px]"
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            editCow ? "bg-yellow-500" : "bg-blue-500"
          } ${loading ? "opacity-50" : ""}`}
        >
          {loading ? "Processing..." : editCow ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}