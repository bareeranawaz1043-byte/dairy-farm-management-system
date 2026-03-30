"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <h1>Dairy Farm</h1>

      <div className="flex gap-4">
        <a href="/dashboard">Dashboard</a>

        {user?.role === "admin" && (
          <>
            <a href="/cows">Cows</a>
            <a href="/sales">Sales</a>
          </>
        )}

        <a href="/milk">Milk</a>
      </div>
    </nav>
  );
}