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

  // ✅ Logout function (Branch 4)
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      
      <h1 className="text-lg font-bold">Dairy Farm</h1>

      <div className="flex gap-4 items-center">
        <a href="/dashboard" className="hover:text-gray-300">Dashboard</a>

        {/* ✅ Admin Only */}
        {user?.role === "admin" && (
          <>
            <a href="/cows" className="hover:text-gray-300">Cows</a>
            <a href="/sales" className="hover:text-gray-300">Sales</a>
          </>
        )}

        {/* ✅ Available for all */}
        <a href="/milk" className="hover:text-gray-300">Milk</a>

        {/* ✅ Show user role */}
        {user && (
          <span className="text-sm bg-gray-700 px-2 py-1 rounded">
            {user.role}
          </span>
        )}

        {/* ✅ Logout Button */}
        {user && (
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}