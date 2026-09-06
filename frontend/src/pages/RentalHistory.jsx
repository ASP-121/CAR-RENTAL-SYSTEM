import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getOrders, getCars } from '../services/api';

export default function RentalHistory() {
  const [searchParams] = useSearchParams();
  const carParam = searchParams.get('car') || 'All';

  const [orders, setOrders] = useState([]);
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(carParam);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOrders(), getCars()]).then(([allOrders, allCars]) => {
      setOrders(allOrders);
      setCars(allCars);
      setLoading(false);
    });
  }, []);

  const filteredOrders = orders.filter(o => {
    if (selectedCar === 'All') return true;
    return o.carName?.toLowerCase() === selectedCar.toLowerCase();
  });

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + (parseFloat(o.carPrice) || 0), 0);
  const totalBookings = filteredOrders.length;
  const avgOrderValue = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ebedff]">
        <div>
          <span className="text-xs font-mono font-bold text-[#006194] uppercase tracking-wider">DBMS Reporting</span>
          <h1 className="text-3xl font-extrabold text-[#131a33] mt-1">Rental History & Invoices</h1>
          <p className="text-sm text-[#3f4850] mt-1">
            Audit trail of vehicle reservations, driver receipts, and car telemetry data from MongoDB.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-[#707881] uppercase">Filter by Car:</label>
          <select
            value={selectedCar}
            onChange={(e) => setSelectedCar(e.target.value)}
            className="h-10 px-3 rounded-lg bg-white border border-[#bfc7d2] text-xs font-semibold text-[#131a33] focus:ring-2 focus:ring-[#006194] focus:outline-none"
          >
            <option value="All">All Fleet Vehicles</option>
            {cars.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
        <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm">
          <span className="text-xs font-bold text-[#707881] uppercase tracking-wider block">Total Bookings</span>
          <div className="text-3xl font-extrabold text-[#131a33] mt-2">{totalBookings}</div>
          <span className="text-xs text-[#006947] font-semibold mt-1 inline-block">Database Verified</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm">
          <span className="text-xs font-bold text-[#707881] uppercase tracking-wider block">Total Generated Revenue</span>
          <div className="text-3xl font-extrabold text-[#006194] mt-2">${totalRevenue.toLocaleString()}</div>
          <span className="text-xs text-[#006947] font-semibold mt-1 inline-block">Spring Boot REST API</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm">
          <span className="text-xs font-bold text-[#707881] uppercase tracking-wider block">Average Order Value</span>
          <div className="text-3xl font-extrabold text-[#545d7c] mt-2">${avgOrderValue}</div>
          <span className="text-xs text-[#707881] font-semibold mt-1 inline-block">Per reservation</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-[#ebedff] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#ebedff] flex items-center justify-between">
          <h2 className="text-base font-bold text-[#131a33]">Invoice Ledger & Trip Records</h2>
          <span className="text-xs font-mono text-[#707881]">{filteredOrders.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f3f3ff] text-[#707881] uppercase font-mono tracking-wider border-b border-[#ebedff]">
              <tr>
                <th className="py-3.5 px-6">Order ID</th>
                <th className="py-3.5 px-6">Vehicle</th>
                <th className="py-3.5 px-6">Driver</th>
                <th className="py-3.5 px-6">Pickup Station</th>
                <th className="py-3.5 px-6">Amount</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebedff] font-medium text-[#131a33]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-[#707881]">Loading orders from MongoDB...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#707881]">
                    No rental history found for this selection.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.orderId || Math.random()} className="hover:bg-[#faf8ff] transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#006194]">
                      {o.orderId}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold">{o.carName}</div>
                      <div className="text-[11px] text-[#707881]">{o.carCompany} • {o.carType}</div>
                    </td>
                    <td className="py-4 px-6">{o.carUser || 'Driver'}</td>
                    <td className="py-4 px-6 text-[#3f4850]">{o.pickupLocation || 'San Francisco SFO'}</td>
                    <td className="py-4 px-6 font-extrabold text-[#131a33] text-sm">
                      ${o.carPrice}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#006947]/10 text-[#006947] border border-[#006947]/30 text-[10px] font-bold">
                        COMPLETED
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/confirmation/${o.orderId}`}
                        className="px-3 py-1.5 bg-[#ebedff] hover:bg-[#d0d9fd] text-[#006194] font-bold rounded-lg transition-colors inline-block"
                      >
                        Receipt
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
