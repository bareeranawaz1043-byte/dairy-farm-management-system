"use client";

import { useState, FormEvent } from "react";
import API from "@/utils/api";

type Props = {
  fetchCows: () => void;
};

export default function CowForm({ fetchCows }: Props) {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // simple validation
    if (!name || !age) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/cows", {
        name,
        age: Number(age), // convert to number
      });

      setName("");
      setAge("");

      fetchCows();
    } catch (error) {
      console.log("Error adding cow:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-4 flex gap-2 items-center"
    >
      <input
        type="text"
        placeholder="Cow Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-1/3"
      />

      <input
        type="number"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="border p-2 rounded w-1/3"
      />

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Cow
      </button>
    </form>
  );
}