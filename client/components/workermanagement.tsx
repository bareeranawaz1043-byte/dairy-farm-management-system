"use client";

import { useEffect, useState } from "react";
import API from "../utils/api";
import toast, { Toaster } from "react-hot-toast";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export default function WorkerManagement() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id: string) => {
    try {
      const token = localStorage.getItem("token");

      await API.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("User deleted");
      fetchUsers();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6">
      <Toaster />

      <h2 className="text-xl font-bold mb-4">Worker Management</h2>

      {users.map((user) => (
        <div
          key={user._id}
          className="flex justify-between bg-gray-100 p-3 mb-2 rounded"
        >
          <span>
            {user.name} ({user.role})
          </span>

          <button
            onClick={() => deleteUser(user._id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}