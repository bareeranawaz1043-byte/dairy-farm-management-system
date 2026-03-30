"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "../../components/dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      setAuthorized(true); 
    }
  }, []);

  if (!authorized) {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  return <Dashboard />;
}