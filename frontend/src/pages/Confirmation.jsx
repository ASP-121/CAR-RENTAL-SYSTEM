import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getOrders, getOrderDetail, getTelemetry, toggleTelemetryLock, toggleTelemetryClimate } from '../services/api';

export default function Confirmation() {
  const { orderId } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [telemetry, setTelemetry] = useState({
    locked: false,
    climateOn: true,
    temperature: 70,
    batteryLevel: 94,
    status: 'ONLINE',
  });
  const [togglingLock, setTogglingLock] = useState(false);
  const [togglingClimate, setTogglingClimate] = useState(false);

  useEffect(() => {
    const idToFind = orderId || order?.orderId;
    if (idToFind) {
      if (!order) {
        getOrderDetail(idToFind).then(found => {
          if (found) setOrder(found);
        });
      }
      getTelemetry(idToFind).then(tel => {
        if (tel) setTelemetry(tel);
      });
    }
  }, [orderId, order]);

  const handleLockToggle = async () => {
    const id = order?.orderId || orderId;
    if (!id) return;
    setTogglingLock(true);
    try {
      const updated = await toggleTelemetryLock(id);
      if (updated) setTelemetry(prev => ({ ...prev, locked: updated.locked }));
    } catch (err) {
      console.error('Failed to toggle lock:', err);
    } finally {
      setTogglingLock(false);
    }
  };

  const handleClimateToggle = async () => {
    const id = order?.orderId || orderId;
    if (!id) return;
    setTogglingClimate(true);
    try {
      const updated = await toggleTelemetryClimate(id);
      if (updated) setTelemetry(prev => ({ ...prev, climateOn: updated.climateOn }));
    } catch (err) {
      console.error('Failed to toggle climate:', err);
    } finally {
      setTogglingClimate(false);
    }
  };

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
                SMART DIGITAL KEY ACTIVE • SERVER SYNCED
              </div>
              <h2 className="text-2xl font-bold">{order?.carName || 'Tesla Model 3 Performance'}</h2>
              <p className="text-xs text-[#bdc5e9] max-w-sm">
                Live vehicle telemetry connected via Spring Boot REST controller.
              </p>
              <div className="text-xs font-mono text-[#bdc5e9]">
                Status: <span className="text-[#4edea3] font-bold">{telemetry.locked ? 'LOCKED' : 'UNLOCKED (Ready)'}</span> • Battery: {telemetry.batteryLevel || 94}%
              </div>
            </div>

            {/* Interactive Radial Buttons */}
            <div className="flex items-center gap-4">
              {/* Lock/Unlock Toggle */}
              <button
                type="button"
                disabled={togglingLock}
                onClick={handleLockToggle}
                className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all shadow-lg ${
                  telemetry.locked
                    ? 'bg-[#ba1a1a] text-white hover:bg-[#ba1a1a]/90'
                    : 'bg-[#006947] text-white hover:bg-[#006947]/90'
                }`}
              >
                <span className="material-symbols-outlined text-[32px]">
                  {telemetry.locked ? 'lock' : 'lock_open'}
                </span>
                <span className="text-[11px] font-bold uppercase">
                  {telemetry.locked ? 'Locked' : 'Unlocked'}
                </span>
              </button>

              {/* Climate Preconditioning */}
              <button
                type="button"
                disabled={togglingClimate}
                onClick={handleClimateToggle}
                className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all shadow-lg ${
                  telemetry.climateOn
                    ? 'bg-[#006194] text-white hover:bg-[#007bb9]'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                <span className="material-symbols-outlined text-[32px]">ac_unit</span>
                <span className="text-[11px] font-bold uppercase">
                  {telemetry.climateOn ? `${telemetry.temperature || 70}°F Auto` : 'Climate Off'}
                </span>
              </button>
            </div>
          </div>

          {/* Reservation Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-[#f3f3ff] rounded-2xl p-6 space-y-3">
              <span className="text-xs font-bold text-[#707881] uppercase tracking-wider block">Pickup Details</span>
              <div className="font-bold text-sm text-[#131a33] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006194] text-[20px]">location_on</span>
                {order?.pickupLocation || 'San Francisco Int Airport (SFO)'}
              </div>
              <div className="text-xs text-[#3f4850] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006194] text-[20px]">schedule</span>
                {order?.pickUpTime ? new Date(order.pickUpTime).toLocaleString() : 'Pickup Confirmed'}
              </div>
            </div>

            <div className="bg-[#f3f3ff] rounded-2xl p-6 space-y-3">
              <span className="text-xs font-bold text-[#707881] uppercase tracking-wider block">Billing Summary</span>
              <div className="font-bold text-2xl text-[#006194]">
                ₹{(order?.carPrice || 4999).toLocaleString('en-IN')}
              </div>
              <div className="text-xs text-[#006947] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Status: {order?.status || 'CONFIRMED'} in MongoDB
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#ebedff]">
            <Link
              to="/my-bookings"
              className="text-xs font-bold text-[#006194] hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              View in My Bookings Dashboard
            </Link>

            <Link
              to="/fleet"
              className="px-6 py-3 bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-bold rounded-xl shadow transition-all"
            >
              Explore More Cars
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
