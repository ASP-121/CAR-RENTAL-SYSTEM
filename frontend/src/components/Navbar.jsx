import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Cars Fleet', path: '/fleet' },
    { name: 'My Bookings', path: '/my-bookings' },
    { name: 'Rental History', path: '/history' },
    { name: 'Admin Dashboard', path: '/admin' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-[#282f49] border-b border-[#bfc7d2]/20 backdrop-blur-md">
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#006194] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-white text-[22px]">directions_car</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white leading-none">DriveEase</span>
              <span className="font-mono text-[10px] text-[#bdc5e9] uppercase tracking-widest mt-1">Mobility</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 p-1 bg-black/20 rounded-xl">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                  isActive(link.path)
                    ? 'bg-[#545d7c]/60 text-white shadow-sm'
                    : 'text-[#bdc5e9] hover:text-white hover:bg-white/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right CTA / Controls */}
        <div className="flex items-center gap-4">
          <Link
            to="/fleet"
            className="hidden sm:flex items-center justify-center px-5 py-2.5 bg-[#006194] hover:bg-[#007bb9] text-white text-sm font-semibold rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
          >
            Book a Car
          </Link>

          <div className="flex items-center gap-2 pl-3 border-l border-white/15">
            <Link
              to="/history"
              aria-label="Notifications"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[#bdc5e9] hover:text-white hover:bg-white/10 transition-colors relative"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
            </Link>

            <Link
              to="/profile"
              aria-label="User Profile"
              className="group flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#006194] to-[#007bb9] flex items-center justify-center text-white font-bold text-sm shadow">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-[#bdc5e9] hover:text-white hover:bg-white/10"
            >
              <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1c2541] border-b border-white/10 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                isActive(link.path)
                  ? 'bg-[#006194] text-white'
                  : 'text-[#bdc5e9] hover:bg-white/10 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10 flex gap-2">
            <Link
              to="/auth"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 bg-white/10 text-white rounded-lg text-sm font-semibold"
            >
              Sign In
            </Link>
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 bg-[#006194] text-white rounded-lg text-sm font-semibold"
            >
              Profile
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
