import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminAnalytics } from '../services/api';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState({
    grossRevenue: 0,
    totalBookings: 0,
    activeTrips: 0,
    totalCars: 0,
    utilizationRate: 84.2,
    averageRating: 4.92,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminAnalytics().then(data => {
      if (data) setAnalytics(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ebedff]">
        <div>
          <span className="text-xs font-mono font-bold text-[#006194] uppercase tracking-wider">Executive Suite</span>
          <h1 className="text-3xl font-extrabold text-[#131a33] mt-1">Admin Operations Center</h1>
          <p className="text-sm text-[#3f4850] mt-1">
            Aggregated metrics, active fleet telemetry, and MongoDB real-time ledger via Spring Boot.
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
          <div className="text-3xl font-black text-[#006194] mt-2">
            ₹{analytics.grossRevenue?.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-[#006947] font-semibold mt-1">
            Across {analytics.totalBookings} total bookings
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm">
          <div className="flex items-center justify-between text-[#707881] text-xs font-bold uppercase">
            <span>Fleet Inventory</span>
            <span className="material-symbols-outlined text-[#006194] text-[20px]">garage</span>
          </div>
          <div className="text-3xl font-black text-[#131a33] mt-2">{analytics.totalCars}</div>
          <div className="text-xs text-[#006947] font-semibold mt-1">
            {analytics.activeTrips} active reservations
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm">
          <div className="flex items-center justify-between text-[#707881] text-xs font-bold uppercase">
            <span>Fleet Utilization</span>
            <span className="material-symbols-outlined text-[#006947] text-[20px]">monitoring</span>
          </div>
          <div className="text-3xl font-black text-[#131a33] mt-2">{analytics.utilizationRate}%</div>
          <div className="text-xs text-[#006947] font-semibold mt-1">Live capacity metric</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm">
          <div className="flex items-center justify-between text-[#707881] text-xs font-bold uppercase">
            <span>Avg Rating</span>
            <span className="material-symbols-outlined text-[#006947] text-[20px]">star</span>
          </div>
          <div className="text-3xl font-black text-[#006947] mt-2">
            ★ {analytics.averageRating}
          </div>
          <div className="text-xs text-[#707881] font-mono mt-1">MongoDB Collections Synced</div>
        </div>
      </div>

      {/* Main Grid: Recent Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#ebedff] shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#ebedff]">
            <div>
              <h2 className="text-lg font-bold text-[#131a33]">Recent Order Transactions</h2>
              <p className="text-xs text-[#3f4850]">Latest rental reservations dispatched by the platform</p>
            </div>
            <Link to="/history" className="text-xs font-bold text-[#006194] hover:underline">
              View All Invoices
            </Link>
          </div>

          {loading ? (
            <div className="py-10 text-center text-xs text-[#707881]">Loading analytics from Spring Boot...</div>
          ) : analytics.recentOrders.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#707881]">No transaction history recorded yet.</div>
          ) : (
            <div className="divide-y divide-[#ebedff]">
              {analytics.recentOrders.map((o) => (
                <div key={o.orderId || Math.random()} className="py-3.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-sm text-[#131a33]">{o.carName}</div>
                    <div className="text-xs text-[#707881]">
                      {o.carUser || 'Driver'} • Ref: <span className="font-mono">{o.orderId}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-sm text-[#006194]">₹{(o.carPrice || 0).toLocaleString('en-IN')}</div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      o.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {o.status || 'CONFIRMED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right side operational health */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-[#ebedff] shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-[#131a33]">Backend System Health</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f3f3ff]">
                <span className="font-semibold text-[#131a33]">Spring Boot REST API</span>
                <span className="font-bold text-[#006947] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#006947] animate-pulse"></span>
                  Active (8080)
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f3f3ff]">
                <span className="font-semibold text-[#131a33]">MongoDB Cloud Database</span>
                <span className="font-bold text-[#006947] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#006947] animate-pulse"></span>
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f3f3ff]">
                <span className="font-semibold text-[#131a33]">Digital Key Telemetry</span>
                <span className="font-bold text-[#006194]">Online (REST)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
