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
        name: editCow.name || "",
        age: String(editCow.age || ""),
        breed: editCow.breed || "",
        milkCapacity: String(editCow.milkCapacity || ""),
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

  // ✅ handle change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { name, age, breed, milkCapacity } = form;

    // validation
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

      // ⚠️ check token (optional but helpful)
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login first");
        return;
      }

      const payload = {
        name: name.trim(),
        age: Number(age),
        breed: breed.trim(),
        milkCapacity: Number(milkCapacity),
      };

      // ✅ EDIT
      if (editCow) {
        await API.put(`/cows/${editCow._id}`, payload);
        toast.success("Cow updated successfully!");
        clearEdit?.();
      } 
      // ✅ CREATE
      else {
        await API.post("/cows", payload);
        toast.success("Cow added successfully!");
      }

      // reset form
      setForm({
        name: "",
        age: "",
        breed: "",
        milkCapacity: "",
      });

      fetchCows();

    } catch (error: any) {
      console.error("FULL ERROR:", error);

      if (error.response?.status === 401) {
        toast.error("Unauthorized! Please login again");
      } else {
        toast.error(
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-4xl mx-auto mb-6">
      
      <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
        {editCow ? "✏️ Update Cow Details" : "➕ Add New Cow"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {/* NAME */}
        <div>
          <label className="text-sm text-gray-600">Cow Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-1"
          />
        </div>

        {/* AGE */}
        <div>
          <label className="text-sm text-gray-600">Age</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-1"
          />
        </div>

        {/* BREED */}
        <div>
          <label className="text-sm text-gray-600">Breed</label>
          <input
            type="text"
            name="breed"
            value={form.breed}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-1"
          />
        </div>

        {/* MILK */}
        <div>
          <label className="text-sm text-gray-600">
            Milk Capacity (liters)
          </label>
          <input
            type="number"
            name="milkCapacity"
            value={form.milkCapacity}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-1"
          />
        </div>

        {/* BUTTONS */}
        <div className="col-span-2 flex justify-center gap-4 mt-4">
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded text-white ${
              editCow ? "bg-yellow-500" : "bg-blue-500"
            } ${loading ? "opacity-50" : ""}`}
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
              className="bg-gray-400 text-white px-6 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}