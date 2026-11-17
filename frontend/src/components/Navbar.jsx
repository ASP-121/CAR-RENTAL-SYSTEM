import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../services/api';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    const handleAuthChange = () => setCurrentUser(getCurrentUser());
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  const handleSignOut = () => {
    logoutUser();
    navigate('/auth');
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const isAdmin = currentUser?.role === 'ADMIN';

  // Navigation Links tailored to role
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Cars Fleet', path: '/fleet' },
    ...(currentUser ? [{ name: 'My Bookings', path: '/my-bookings' }] : []),
    { name: 'Rental History', path: '/history' },
    // ADMIN DASHBOARD ONLY VISIBLE TO ADMIN LOGIN
    ...(isAdmin ? [{ name: 'Admin Dashboard', path: '/admin', badge: 'ADMIN' }] : []),
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
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  isActive(link.path)
                    ? 'bg-[#545d7c]/60 text-white shadow-sm'
                    : 'text-[#bdc5e9] hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.2 bg-[#ba1a1a] text-white text-[9px] font-black rounded-md tracking-wider">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right CTA / Controls */}
        <div className="flex items-center gap-4">
          <Link
            to="/fleet"
            className="hidden sm:flex items-center justify-center px-4 py-2 bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-bold rounded-xl shadow-md transition-all transform hover:-translate-y-0.5"
          >
            Book a Car
          </Link>

          <div className="flex items-center gap-3 pl-3 border-l border-white/15">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow ${
                    isAdmin ? 'bg-[#ba1a1a]' : 'bg-[#006194]'
                  }`}>
                    {isAdmin ? 'AD' : (currentUser.name ? currentUser.name[0] : 'U')}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-bold text-white leading-none">{currentUser.name}</span>
                    <span className="text-[10px] text-[#bdc5e9] mt-0.5 uppercase font-mono">
                      {isAdmin ? 'Administrator' : 'Customer'}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="px-3 py-1.5 bg-white/10 hover:bg-red-500/20 text-[#bdc5e9] hover:text-red-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-white/15"
              >
                <span className="material-symbols-outlined text-[16px]">login</span>
                <span>Sign In</span>
              </Link>
            )}

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
              className={`block px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-between ${
                isActive(link.path)
                  ? 'bg-[#545d7c] text-white'
                  : 'text-[#bdc5e9] hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{link.name}</span>
              {link.badge && (
                <span className="px-1.5 py-0.5 bg-[#ba1a1a] text-white text-[9px] font-black rounded-md">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
          {currentUser && (
            <button
              onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
              className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/10 rounded-lg font-semibold flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Sign Out ({currentUser.name})</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
