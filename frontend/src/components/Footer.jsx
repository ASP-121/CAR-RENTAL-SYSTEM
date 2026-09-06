import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#1c2541] text-[#eff0ff] border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#006194] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[22px]">directions_car</span>
              </div>
              <div>
                <div className="text-xl font-bold text-white leading-none">DriveEase</div>
                <div className="font-mono text-[10px] text-[#bdc5e9] tracking-widest uppercase mt-0.5">Mobility Platform</div>
              </div>
            </div>
            <p className="text-sm text-[#bdc5e9] leading-relaxed">
              Precision automotive reservations with instant digital unlock, transparent rates, and full fleet telemetry.
            </p>
            <div className="flex gap-3 text-white/80">
              <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#006194] cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-[18px]">public</span>
              </span>
              <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#006194] cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-[18px]">hub</span>
              </span>
              <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#006194] cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-[18px]">support_agent</span>
              </span>
            </div>
          </div>

          {/* Col 2: Fleet & Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Explore Fleet</h4>
            <ul className="space-y-2 text-sm text-[#bdc5e9]">
              <li><Link to="/fleet" className="hover:text-white transition-colors">Electric Vehicles</Link></li>
              <li><Link to="/fleet" className="hover:text-white transition-colors">Executive Sedans</Link></li>
              <li><Link to="/fleet" className="hover:text-white transition-colors">Family SUVs</Link></li>
              <li><Link to="/fleet" className="hover:text-white transition-colors">Convertibles & Luxury</Link></li>
              <li><Link to="/fleet" className="hover:text-white transition-colors">Instant Keyless Unlock</Link></li>
            </ul>
          </div>

          {/* Col 3: Portal & Ops */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Management</h4>
            <ul className="space-y-2 text-sm text-[#bdc5e9]">
              <li><Link to="/my-bookings" className="hover:text-white transition-colors">My Active Bookings</Link></li>
              <li><Link to="/history" className="hover:text-white transition-colors">Rental Invoices & History</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
              <li><Link to="/admin/fleet" className="hover:text-white transition-colors">Fleet Inventory Ops</Link></li>
              <li><Link to="/admin/bookings" className="hover:text-white transition-colors">Booking Operations</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform Status */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform Status</h4>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#4edea3]">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                API CONNECTIVITY ACTIVE
              </div>
              <p className="text-xs text-[#bdc5e9]">
                Connected to Spring Boot REST backend at <code>http://localhost:8080/api</code>
              </p>
              <div className="pt-2">
                <Link
                  to="/admin/fleet"
                  className="block text-center py-2 px-3 bg-[#006194] hover:bg-[#007bb9] text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Manage Cars Inventory
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#bdc5e9]">
          <div>&copy; {new Date().getFullYear()} DriveEase Mobility Platform. Course DBMS Project 131, 146, 187.</div>
          <div className="flex gap-6">
            <Link to="/" className="hover:text-white">Terms of Service</Link>
            <Link to="/" className="hover:text-white">Privacy Policy</Link>
            <Link to="/profile" className="hover:text-white">Driver Verification</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
