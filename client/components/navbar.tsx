"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

type User = {
  name?: string;
  role?: string;
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-gray-700 hover:text-white"
    }`;

  return (
    <nav className="bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">

        {/* LOGO */}
        <h1 className="text-xl font-bold text-white tracking-wide">
          🐄 Dairy Farm
        </h1>

        {/* LINKS */}
        <div className="flex items-center gap-3">

          <Link href="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>

          {user?.role === "admin" && (
            <>
              <Link href="/cows" className={linkClass("/cows")}>
                Cows
              </Link>

              <Link href="/feeding" className={linkClass("/feeding")}>
                Feeding
              </Link>

              <Link href="/sales" className={linkClass("/sales")}>
                Sales
              </Link>

              <Link href="/workers" className={linkClass("/workers")}>
                Workers
              </Link>
            </>
          )}

          <Link href="/milk" className={linkClass("/milk")}>
            Milk
          </Link>

          {/* USER INFO */}
          {user && (
            <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-200">
              {user.role}
            </span>
          )}

          {/* LOGOUT */}
          {user && (
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}