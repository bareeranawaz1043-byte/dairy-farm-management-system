"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import API from "../../utils/api";

export default function SignUp() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await API.post("/users/register", form);

      toast.success("Account created successfully!");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      router.push("/"); // dashboard
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <Toaster position="top-right" />

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="flex gap-4">
            <input name="firstName" placeholder="First Name" className="w-full border p-2 rounded" onChange={handleChange} required />
            <input name="lastName" placeholder="Last Name" className="w-full border p-2 rounded" onChange={handleChange} required />
          </div>

          <input name="email" type="email" placeholder="Email" className="w-full border p-2 rounded" onChange={handleChange} required />

          <input name="password" type="password" placeholder="Password" className="w-full border p-2 rounded" onChange={handleChange} required />

          <input name="confirmPassword" type="password" placeholder="Confirm Password" className="w-full border p-2 rounded" onChange={handleChange} required />

          <select name="role" className="w-full border p-2 rounded" onChange={handleChange}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button className="w-full bg-green-500 text-white p-2 rounded">
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link href="/login">
            <span className="text-blue-500 cursor-pointer">Login</span>
          </Link>
        </p>
      </div>
    </div>
  );
}