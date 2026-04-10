"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // hide on auth pages
  if (pathname === "/login" || pathname === "/signup") return null;

  return <Navbar />;
}