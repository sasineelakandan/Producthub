import React from 'react';
import Link from 'next/link';
import { FiChevronRight, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-lg p-4 flex justify-between items-center sticky top-0 z-10">
      <div className="text-2xl font-bold text-indigo-700">LuxeCart</div>
      <div className="flex gap-4 items-center">
        <Link href="/home">
          <button className="bg-indigo-700 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg">
            <span>Home</span>
          </button>
        </Link>

        <Link href="/addproduct">
          <button className="bg-indigo-700 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg">
            <span>Add Product</span>
            <FiChevronRight className="text-lg" />
          </button>
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <span>Logout</span>
          <FiLogOut className="text-lg" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
