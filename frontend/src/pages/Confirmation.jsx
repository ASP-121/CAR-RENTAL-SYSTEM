import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getOrders } from '../services/api';

export default function Confirmation() {
  const { orderId } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [locked, setLocked] = useState(false);
  const [climateOn, setClimateOn] = useState(true);
  const [digitalKeyActive, setDigitalKeyActive] = useState(true);

  useEffect(() => {
    if (!order) {
      getOrders().then(orders => {
        const found = orders.find(o => o.orderId === orderId);
        if (found) setOrder(found);
      });
    }
  }, [orderId, order]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-[#ebedff] shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#006194] to-[#007bb9] p-8 text-white text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-white text-[36px]">check_circle</span>
          </div>

          <span className="font-mono text-xs uppercase tracking-widest text-[#cce5ff] font-bold">
            Reservation Confirmed
          </span>
          <h1 className="text-3xl font-extrabold mt-1">Ready for the Road!</h1>
          <p className="text-sm text-[#eff0ff] mt-2 max-w-md mx-auto">
            Your booking is confirmed in our database and your digital smart key is now ready.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl font-mono text-xs border border-white/20">
            <span>REFERENCE:</span>
            <span className="font-bold text-[#6ffbbe]">{order?.orderId || orderId || 'ORD-982341'}</span>
          </div>
        </div>

        {/* Digital Key Radial Control Card */}
        <div className="p-8 space-y-8">
          <div className="bg-[#1c2541] rounded-2xl p-6 sm:p-8 text-white shadow-inner flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#006947]/20 border border-[#006947] text-[#4edea3] text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping"></span>
                SMART DIGITAL KEY ACTIVE
              </div>
              <h2 className="text-2xl font-bold">{order?.carName || 'Tesla Model 3 Performance'}</h2>
              <p className="text-xs text-[#bdc5e9] max-w-sm">
                Control keyless entry and precondition vehicle climate directly from your phone.
              </p>
              <div className="text-xs font-mono text-[#bdc5e9]">
                Status: <span className="text-[#4edea3] font-bold">{locked ? 'LOCKED' : 'UNLOCKED (Ready)'}</span> • Battery: 94%
              </div>
            </div>

            {/* Interactive Radial Buttons */}
            <div className="flex items-center gap-4">
              {/* Lock/Unlock Toggle */}
              <button
                onClick={() => setLocked(!locked)}
                className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all shadow-lg ${
                  locked
                    ? 'bg-[#ba1a1a] text-white hover:bg-[#ba1a1a]/90'
                    : 'bg-[#006947] text-white hover:bg-[#006947]/90'
                }`}
              >
                <span className="material-symbols-outlined text-[32px]">
                  {locked ? 'lock' : 'lock_open'}
                </span>
                <span className="text-[11px] font-bold uppercase">
                  {locked ? 'Locked' : 'Unlocked'}
                </span>
              </button>

              {/* Climate Preconditioning */}
              <button
                onClick={() => setClimateOn(!climateOn)}
                className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all shadow-lg ${
                  climateOn
                    ? 'bg-[#006194] text-white hover:bg-[#007bb9]'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                <span className="material-symbols-outlined text-[32px]">ac_unit</span>
                <span className="text-[11px] font-bold uppercase">
                  {climateOn ? '70°F Auto' : 'Climate Off'}
                </span>
              </button>
            </div>
          </div>

          {/* Reservation Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-[#faf8ff] border border-[#ebedff] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#707881]">Trip Schedule</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#3f4850]">Pick-up Location:</span>
                  <span className="font-bold text-[#131a33] text-right">{order?.pickupLocation || 'San Francisco SFO'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#3f4850]">Pick-up Schedule:</span>
                  <span className="font-bold text-[#131a33]">{order?.pickUpTime ? new Date(order.pickUpTime).toLocaleString() : 'Immediate'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#3f4850]">Return Schedule:</span>
                  <span className="font-bold text-[#131a33]">{order?.returnUpTime ? new Date(order.returnUpTime).toLocaleString() : '3 Days Later'}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#faf8ff] border border-[#ebedff] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#707881]">Billing Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#3f4850]">Driver Name:</span>
                  <span className="font-bold text-[#131a33]">{order?.carUser || 'Alex Morgan'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#3f4850]">Vehicle Type:</span>
                  <span className="font-bold text-[#131a33]">{order?.carType || 'Electric'}</span>
                </div>
                <div className="flex justify-between border-t border-[#ebedff] pt-2">
                  <span className="font-bold text-[#131a33]">Total Paid:</span>
                  <span className="font-black text-[#006194] text-lg">${order?.carPrice || 320}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#ebedff]">
            <Link
              to="/my-bookings"
              className="px-6 py-3 bg-[#006194] hover:bg-[#007bb9] text-white font-bold text-xs rounded-xl shadow transition-all"
            >
              View in My Bookings
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-3 bg-[#f3f3ff] hover:bg-[#ebedff] text-[#131a33] font-bold text-xs rounded-xl border border-[#ebedff] flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Print Invoice</span>
              </button>

              <Link
                to="/fleet"
                className="px-4 py-3 bg-white hover:bg-[#faf8ff] text-[#131a33] font-bold text-xs rounded-xl border border-[#bfc7d2] transition-colors"
              >
                Back to Fleet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
