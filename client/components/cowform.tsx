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
  const [form, setForm] = useState({
    name: "",
    age: "",
    breed: "",
    milkCapacity: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Fill form in edit mode
  useEffect(() => {
    if (editCow) {
      setForm({
        name: editCow.name,
        age: String(editCow.age),
        breed: editCow.breed,
        milkCapacity: String(editCow.milkCapacity),
      });
    } else {
      setForm({
        name: "",
        age: "",
        breed: "",
        milkCapacity: "",
      });
    }
  }, [editCow]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, age, breed, milkCapacity } = form;

    if (
      !name.trim() ||
      !age ||
      !breed.trim() ||
      !milkCapacity ||
      Number(age) <= 0 ||
      Number(milkCapacity) <= 0
    ) {
      toast.error("Please enter valid data in all fields");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const payload = {
        name: name.trim(),
        age: Number(age),
        breed: breed.trim(),
        milkCapacity: Number(milkCapacity),
      };

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (editCow) {
        await API.put(`/cows/${editCow._id}`, payload, config);
        toast.success("Cow updated successfully!");
        clearEdit && clearEdit();
      } else {
        await API.post("/cows", payload, config);
        toast.success("Cow added successfully!");
      }

      // ✅ Reset form
      setForm({
        name: "",
        age: "",
        breed: "",
        milkCapacity: "",
      });

      fetchCows();
    } catch (error: any) {
      console.error("Error:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
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
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto mb-6">
      {/* Header */}
      <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
        {editCow ? "✏️ Update Cow Details" : "➕ Add New Cow"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Name */}
        <div>
          <label className="text-sm text-gray-600">Cow Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter cow name"
            className="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Age */}
        <div>
          <label className="text-sm text-gray-600">Age</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="Enter age"
            className="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Breed */}
        <div>
          <label className="text-sm text-gray-600">Breed</label>
          <input
            type="text"
            name="breed"
            value={form.breed}
            onChange={handleChange}
            placeholder="Enter breed"
            className="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Milk Capacity */}
        <div>
          <label className="text-sm text-gray-600">Milk Capacity (liters)</label>
          <input
            type="number"
            name="milkCapacity"
            value={form.milkCapacity}
            onChange={handleChange}
            placeholder="e.g. 10"
            className="border p-2 rounded w-full mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="col-span-1 sm:col-span-2 flex justify-center gap-4 mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded text-white font-medium transition ${
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

          {editCow && (
            <button
              type="button"
              onClick={clearEdit}
              className="px-6 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}