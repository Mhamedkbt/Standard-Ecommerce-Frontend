import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { totalItems } = useCart();
  
  // Create a reference to the navbar to detect "outside" clicks
  const navRef = useRef(null);

  const toggleMenu = () => setIsOpen((s) => !s);

  // --- PRO LOGIC: AUTO-CLOSE MENU ---
  useEffect(() => {
    const handleClose = () => setIsOpen(false);

    const handleClickOutside = (event) => {
      // If the click is NOT on the navbar/menu, close it
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // 1. Close when user scrolls down
      window.addEventListener('scroll', handleClose);
      // 2. Close when user clicks anywhere on the "body"
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      window.removeEventListener('scroll', handleClose);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const linkClasses = "text-gray-700 hover:text-indigo-700 font-medium transition duration-300 tracking-wide block py-3 px-4 rounded-lg hover:bg-gray-50 lg:px-0 lg:hover:bg-transparent";

  return (
    // Attached navRef here to detect clicks
    <header ref={navRef} className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-3xl font-extrabold text-indigo-700 tracking-tighter">E C O M M</Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex flex-1 items-center justify-end space-x-10">
            <nav className="flex space-x-6">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.path} className="text-gray-700 hover:text-indigo-700 font-medium transition duration-300 tracking-wide">
                  {link.name}
                </Link>
              ))}
            </nav>

            <Link to="/cart" className="relative text-gray-700 hover:text-indigo-700 transition">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 text-xs bg-indigo-500 text-white rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link to="/login" className="text-sm text-white bg-gray-900 py-2 px-5 rounded-full hover:bg-indigo-700 transition shadow-lg">Login</Link>
          </div>

          {/* Mobile Buttons */}
          <div className="flex items-center lg:hidden space-x-5">
            <Link to="/cart" className="relative text-gray-700 hover:text-indigo-700 transition">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 text-xs bg-indigo-500 text-white rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* HAMBURGER / X ICON TOGGLE */}
            <button onClick={toggleMenu} className="text-gray-600 hover:text-indigo-700 focus:outline-none transition-colors duration-200">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  // "X" Icon - Increased stroke for a pro look
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  // Hamburger Icon
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div 
        className={`lg:hidden bg-white border-t border-gray-100 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-4 md:px-8 py-6">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setIsOpen(false)} // Close when link clicked
                className={linkClasses}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4">
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)} 
                className="block w-full text-center text-sm text-white bg-indigo-600 py-3 rounded-xl hover:bg-indigo-700 transition font-bold shadow-md"
              >
                Login
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;