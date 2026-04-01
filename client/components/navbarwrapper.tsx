"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // ✅ login page pe navbar hide
  if (pathname === "/login") return null;

  return <Navbar />;
}