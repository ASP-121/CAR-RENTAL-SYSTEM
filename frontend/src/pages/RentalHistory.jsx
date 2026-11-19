import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getOrders, getUserOrders, getCars, getCurrentUser } from '../services/api';

export default function RentalHistory() {
  const [searchParams] = useSearchParams();
  const carParam = searchParams.get('car') || 'All';

  const [orders, setOrders] = useState([]);
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(carParam);
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'ADMIN';

  useEffect(() => {
    const fetchOrders = isAdmin ? getOrders() : getUserOrders();
    Promise.all([fetchOrders, getCars()]).then(([allOrders, allCars]) => {
      setOrders(allOrders || []);
      setCars(allCars || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, [isAdmin]);

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
          <span className="text-xs font-mono font-bold text-[#006194] uppercase tracking-wider">
            {isAdmin ? 'DBMS Fleet Reporting' : 'Personal Driver Ledger'}
          </span>
          <h1 className="text-3xl font-extrabold text-[#131a33] mt-1">Rental History & Invoices</h1>
          <p className="text-sm text-[#3f4850] mt-1">
            {isAdmin 
              ? 'Complete audit trail of vehicle reservations, driver receipts, and telemetry data from MongoDB.' 
              : 'Your verified trip reservations, receipts, and digital vehicle access logs.'}
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
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#707881] uppercase">{isAdmin ? 'Gross Revenue' : 'Total Spent'}</span>
            <span className="material-symbols-outlined text-[#006194] text-[20px]">payments</span>
          </div>
          <div className="text-2xl font-black text-[#131a33] mt-2">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-[#006194] font-medium mt-1">Synced with MongoDB</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#707881] uppercase">Reservations Logged</span>
            <span className="material-symbols-outlined text-[#006194] text-[20px]">receipt_long</span>
          </div>
          <div className="text-2xl font-black text-[#131a33] mt-2">{totalBookings}</div>
          <div className="text-[11px] text-[#006194] font-medium mt-1">Confirmed & Audited</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#707881] uppercase">Average Order Value</span>
            <span className="material-symbols-outlined text-[#006194] text-[20px]">trending_up</span>
          </div>
          <div className="text-2xl font-black text-[#131a33] mt-2">₹{avgOrderValue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-[#006194] font-medium mt-1">Per rental period</div>
        </div>
      </div>

      {/* Invoices & History Table */}
      <div className="bg-white rounded-3xl border border-[#ebedff] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#ebedff] flex items-center justify-between">
          <h2 className="text-base font-bold text-[#131a33]">Invoices & Rental Audit Log</h2>
          <span className="text-xs font-mono text-[#707881]">{filteredOrders.length} records</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-[#707881]">
            <span className="material-symbols-outlined animate-spin text-3xl text-[#006194]">progress_activity</span>
            <p className="mt-2 text-sm">Loading rental history from database...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-20 text-center">
            <span className="material-symbols-outlined text-4xl text-[#bfc7d2]">receipt_long</span>
            <h3 className="text-base font-bold text-[#131a33] mt-2">No reservation history found</h3>
            <p className="text-xs text-[#707881] mt-1">No past reservations recorded for this vehicle selection.</p>
            <Link
              to="/fleet"
              className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 bg-[#006194] text-white text-xs font-bold rounded-xl shadow hover:bg-[#007bb9]"
            >
              Browse Fleet & Book
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf8ff] text-[#707881] uppercase font-bold border-b border-[#ebedff]">
                <tr>
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Vehicle</th>
                  <th className="py-3 px-6">Renter</th>
                  <th className="py-3 px-6">Rental Window</th>
                  <th className="py-3 px-6">Amount</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebedff]">
                {filteredOrders.map(order => (
                  <tr key={order.orderId || order.id} className="hover:bg-[#faf8ff] transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#131a33]">
                      {order.orderId || order.id || 'N/A'}
                    </td>
                    <td className="py-4 px-6 font-bold text-[#006194]">
                      {order.carName}
                    </td>
                    <td className="py-4 px-6 text-[#3f4850]">
                      <div>{order.carUser || 'Driver'}</div>
                      <div className="text-[10px] text-[#707881] font-mono">{order.userPhone || ''}</div>
                    </td>
                    <td className="py-4 px-6 text-[#3f4850] font-mono text-[11px]">
                      <div>{order.pickUpTime ? new Date(order.pickUpTime).toLocaleDateString() : 'N/A'}</div>
                      <div className="text-[10px] text-[#707881]">to {order.returnUpTime ? new Date(order.returnUpTime).toLocaleDateString() : 'N/A'}</div>
                    </td>
                    <td className="py-4 px-6 font-bold text-[#131a33]">
                      ₹{(order.carPrice || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        order.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-700'
                          : order.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {order.status || 'CONFIRMED'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to={`/confirmation/${order.orderId || order.id}`}
                        className="inline-flex items-center gap-1 text-[#006194] hover:text-[#007bb9] font-bold"
                      >
                        <span>Receipt</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
