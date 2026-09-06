import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCars, getOrders } from '../services/api';

export default function AdminDashboard() {
  const [cars, setCars] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getCars(), getOrders()]).then(([c, o]) => {
      setCars(c);
      setOrders(o);
      setLoading(false);
    });
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.carPrice) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ebedff]">
        <div>
          <span className="text-xs font-mono font-bold text-[#006194] uppercase tracking-wider">Executive Suite</span>
          <h1 className="text-3xl font-extrabold text-[#131a33] mt-1">Admin Operations Center</h1>
          <p className="text-sm text-[#3f4850] mt-1">
            Fleet health, live customer reservations, telemetry status, and Spring Boot backend analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/fleet"
            className="px-4 py-2.5 bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">directions_car</span>
            <span>Manage Fleet</span>
          </Link>
          <Link
            to="/history"
            className="px-4 py-2.5 bg-white border border-[#bfc7d2] hover:bg-[#f3f3ff] text-[#131a33] text-xs font-bold rounded-xl transition-colors"
          >
            Invoices
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm">
          <div className="flex items-center justify-between text-[#707881] text-xs font-bold uppercase">
            <span>Gross Revenue</span>
            <span className="material-symbols-outlined text-[#006194] text-[20px]">payments</span>
          </div>
          <div className="text-3xl font-black text-[#006194] mt-2">${totalRevenue.toLocaleString()}</div>
          <div className="text-xs text-[#006947] font-semibold mt-1">Across {orders.length} bookings</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm">
          <div className="flex items-center justify-between text-[#707881] text-xs font-bold uppercase">
            <span>Fleet Inventory</span>
            <span className="material-symbols-outlined text-[#006194] text-[20px]">garage</span>
          </div>
          <div className="text-3xl font-black text-[#131a33] mt-2">{cars.length}</div>
          <div className="text-xs text-[#006947] font-semibold mt-1">100% telemetry linked</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm">
          <div className="flex items-center justify-between text-[#707881] text-xs font-bold uppercase">
            <span>Avg Customer Rating</span>
            <span className="material-symbols-outlined text-[#006947] text-[20px]">star</span>
          </div>
          <div className="text-3xl font-black text-[#131a33] mt-2">4.92 ★</div>
          <div className="text-xs text-[#707881] font-semibold mt-1">From driver feedback</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm">
          <div className="flex items-center justify-between text-[#707881] text-xs font-bold uppercase">
            <span>Database Status</span>
            <span className="material-symbols-outlined text-[#006947] text-[20px]">database</span>
          </div>
          <div className="text-xl font-bold text-[#006947] mt-3 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006947] animate-pulse"></span>
            MongoDB Online
          </div>
          <div className="text-xs text-[#707881] font-mono mt-1">Collections: CarDetail, OrderDetail</div>
        </div>
      </div>

      {/* Main Grid: Recent Operations & Fleet Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Bookings */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#ebedff] shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#ebedff]">
            <div>
              <h2 className="text-lg font-bold text-[#131a33]">Recent Order Transactions</h2>
              <p className="text-xs text-[#3f4850]">Latest rental reservations dispatched by the platform</p>
            </div>
            <Link to="/history" className="text-xs font-bold text-[#006194] hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 5).map((ord) => (
              <div
                key={ord.orderId || Math.random()}
                className="p-4 rounded-xl bg-[#faf8ff] border border-[#ebedff] flex items-center justify-between hover:bg-[#ebedff]/30 transition-colors text-xs"
              >
                <div>
                  <div className="font-mono font-bold text-[#006194]">{ord.orderId}</div>
                  <div className="font-bold text-[#131a33] text-sm mt-0.5">{ord.carName}</div>
                  <div className="text-[#707881] mt-0.5">Driver: {ord.carUser || 'Driver'} • {ord.pickupLocation}</div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-[#131a33]">${ord.carPrice}</div>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#006947]/10 text-[#006947] text-[10px] font-bold">
                    CONFIRMED
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Operational Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-[#ebedff] shadow-sm p-6 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#131a33]">Platform Endpoints</h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#f3f3ff] border border-[#ebedff]">
                <span className="text-[#006947] font-bold">GET</span> /api/cars
              </div>
              <div className="p-2.5 rounded-lg bg-[#f3f3ff] border border-[#ebedff]">
                <span className="text-[#006194] font-bold">POST</span> /api/cars/add
              </div>
              <div className="p-2.5 rounded-lg bg-[#f3f3ff] border border-[#ebedff]">
                <span className="text-[#006194] font-bold">POST</span> /api/booking/car
              </div>
              <div className="p-2.5 rounded-lg bg-[#f3f3ff] border border-[#ebedff]">
                <span className="text-[#006947] font-bold">GET</span> /api/booking/orders
              </div>
              <div className="p-2.5 rounded-lg bg-[#f3f3ff] border border-[#ebedff]">
                <span className="text-[#006947] font-bold">GET</span> /api/booking/history/:car
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1c2541] to-[#282f49] rounded-2xl p-6 text-white space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-mono text-[#4edea3]">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
              DIGITAL FLEET DISPATCH
            </div>
            <h4 className="text-base font-bold">Ready to add new vehicle inventory?</h4>
            <p className="text-xs text-[#bdc5e9]">
              Instantly configure specifications, seats, rates, and publish directly to customers.
            </p>
            <Link
              to="/admin/fleet"
              className="inline-block px-4 py-2.5 bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-bold rounded-lg shadow transition-colors"
            >
              Open Fleet Manager
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
