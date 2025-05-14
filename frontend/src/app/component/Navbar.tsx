import React, { useState } from 'react';
import Link from 'next/link';
import { FiChevronRight, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg p-4 flex justify-between items-center sticky top-0 z-50">
      <div className="text-2xl font-bold text-indigo-700">LuxeCart</div>

      {/* Desktop Menu Items - always visible on lg screens */}
      <div className="hidden lg:flex lg:items-center lg:gap-6">
        <Link href="/home" className="hover:opacity-80 transition-opacity">
          <button className="bg-indigo-700 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg">
            <span>Home</span>
          </button>
        </Link>

        <Link href="/addproduct" className="hover:opacity-80 transition-opacity">
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

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className="text-2xl text-indigo-700 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu - appears below navbar when toggled */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-6 flex flex-col gap-4 z-40">
          <Link 
            href="/home" 
            className="w-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <button className="w-full bg-indigo-700 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
              <span>Home</span>
            </button>
          </Link>

          <Link 
            href="/addproduct" 
            className="w-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <button className="w-full bg-indigo-700 text-white px-6 py-2 rounded-lg hover:bg-indigo-800 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
              <span>Add Product</span>
              <FiChevronRight className="text-lg" />
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <span>Logout</span>
            <FiLogOut className="text-lg" />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;