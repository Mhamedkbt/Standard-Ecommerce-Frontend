import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { totalItems } = useCart();

  const toggleMenu = () => setIsOpen((s) => !s);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (term) {
      navigate(`/shop?q=${encodeURIComponent(term)}`);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const linkClasses = "text-gray-700 hover:text-indigo-700 font-medium transition duration-300 tracking-wide block py-2 px-3 lg:px-0";

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-3xl font-extrabold text-indigo-700 tracking-tighter">E C O M M</Link>

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

          <div className="flex items-center lg:hidden space-x-5">
            <Link to="/cart" className="relative text-gray-700 hover:text-indigo-700 transition">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>

              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 text-xs bg-indigo-500 text-white rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </Link>

            <button onClick={toggleMenu} className="text-gray-600 hover:text-indigo-700 focus:outline-none">
              <svg className="h-7 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden px-4 md:px-8 pb-4 border-t border-gray-100">
          <nav className="flex flex-col space-y-2 mb-4">
            {navLinks.map((link) => (
              <Link key={link.name} to={link.path} onClick={toggleMenu} className={linkClasses}>
                {link.name}
              </Link>
            ))}
            <Link to="/login" onClick={toggleMenu} className="block w-full text-center text-sm text-white bg-indigo-600 py-2 mt-2 rounded-lg hover:bg-indigo-700 transition font-semibold">
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
