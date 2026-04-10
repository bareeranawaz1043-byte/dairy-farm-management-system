"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* BRAND */}
        <div>
          <h2 className="text-white font-bold text-lg mb-2">
            🐄 Dairy Farm System
          </h2>
          <p className="text-sm">
            Manage cows, milk production, feeding, and sales efficiently.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
            <li><a href="/cows" className="hover:text-white">Cows</a></li>
            <li><a href="/milk" className="hover:text-white">Milk</a></li>
            <li><a href="/sales" className="hover:text-white">Sales</a></li>
          </ul>
        </div>

        {/* INFO */}
        <div>
          <h3 className="text-white font-semibold mb-2">Contact</h3>
          <p className="text-sm">Email: support@dairyfarm.com</p>
          <p className="text-sm">Phone: +92 300 1234567</p>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="text-center text-sm border-t border-gray-700 py-3">
        © {new Date().getFullYear()} Dairy Farm Management System. All rights reserved.
      </div>
    </footer>
  );
}