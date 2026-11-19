import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserOrders, cancelOrder, getCarImage, getCurrentUser } from '../services/api';

export default function MyBookings() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  const currentUser = getCurrentUser() || {};

  const loadOrders = () => {
    setLoading(true);
    getUserOrders().then(data => {
      setOrders(data || []);
      setLoading(false);
    }).catch(() => {
      setOrders([]);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancelBooking = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }
    setActionLoading(orderId);
    try {
      await cancelOrder(orderId);
      loadOrders();
    } catch (err) {
      alert("Failed to cancel booking. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'active') return order.isBooked && order.status !== 'CANCELLED' && order.status !== 'COMPLETED';
    if (activeTab === 'completed') return order.status === 'COMPLETED';
    if (activeTab === 'cancelled') return order.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ebedff]">
        <div>
          <span className="text-xs font-mono font-bold text-[#006194] uppercase tracking-wider">Driver Portal</span>
          <h1 className="text-3xl font-extrabold text-[#131a33] mt-1">My Bookings Dashboard</h1>
          <p className="text-sm text-[#3f4850] mt-1">
            Driver: <span className="font-bold text-[#131a33]">{currentUser.name || 'Driver'}</span> ({currentUser.email || ''}) • Spring Boot Synced
          </p>
        </div>

        <Link
          to="/fleet"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-bold rounded-xl shadow transition-all self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Book Another Car</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mt-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-[#006194] text-white shadow-sm'
              : 'bg-white text-[#3f4850] hover:bg-[#ebedff] border border-[#ebedff]'
          }`}
        >
          All Reservations ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'active'
              ? 'bg-[#006194] text-white shadow-sm'
              : 'bg-white text-[#3f4850] hover:bg-[#ebedff] border border-[#ebedff]'
          }`}
        >
          Active Trips
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'completed'
              ? 'bg-[#006194] text-white shadow-sm'
              : 'bg-white text-[#3f4850] hover:bg-[#ebedff] border border-[#ebedff]'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'cancelled'
              ? 'bg-[#006194] text-white shadow-sm'
              : 'bg-white text-[#3f4850] hover:bg-[#ebedff] border border-[#ebedff]'
          }`}
        >
          Cancelled
        </button>
      </div>

      {/* Orders List */}
      <div className="mt-8 space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(n => (
              <div key={n} className="h-40 bg-white rounded-2xl animate-pulse border border-[#ebedff]"></div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#ebedff] p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-[#ebedff] flex items-center justify-center mx-auto text-[#006194]">
              <span className="material-symbols-outlined text-[32px]">car_rental</span>
            </div>
            <h3 className="text-xl font-bold text-[#131a33]">No Bookings Found</h3>
            <p className="text-sm text-[#3f4850] max-w-sm mx-auto">
              No reservations under this tab. Browse our fleet and reserve your next vehicle with instant digital unlock!
            </p>
            <Link
              to="/fleet"
              className="inline-block px-6 py-3 bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-bold rounded-xl shadow"
            >
              Explore Fleet Inventory
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.orderId || Math.random()}
              className="bg-white rounded-2xl border border-[#ebedff] hover:border-[#006194]/40 hover:shadow-lg transition-all p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            >
              {/* Left Details */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto">
                <img
                  src={getCarImage(order.carType)}
                  alt={order.carName}
                  className="w-28 h-20 rounded-xl object-cover border border-[#ebedff]"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80";
                  }}
                />

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#006194] uppercase tracking-wider">
                      {order.carCompany || 'Verified Partner'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${
                      order.status === 'CANCELLED'
                        ? 'bg-red-50 text-red-600 border-red-200'
                        : order.status === 'COMPLETED'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-[#006947]/10 text-[#006947] border-[#006947]/30'
                    }`}>
                      {order.status || 'CONFIRMED'}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#131a33]">{order.carName}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#707881] pt-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#006194]">tag</span>
                      Order: <span className="font-mono font-semibold text-[#131a33]">{order.orderId}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#006194]">location_on</span>
                      {order.pickupLocation || 'Station 1'}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#006194]">schedule</span>
                      {order.pickUpTime ? new Date(order.pickUpTime).toLocaleDateString() : 'Dates confirmed'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Billing & Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between w-full lg:w-auto gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-[#ebedff]">
                <div className="text-left lg:text-right">
                  <span className="text-xs text-[#707881] block">Total Invoiced</span>
                  <span className="text-2xl font-black text-[#006194]">₹{(order.carPrice || 0).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {order.status !== 'CANCELLED' && (
                    <Link
                      to={`/confirmation/${order.orderId}`}
                      className="px-4 py-2 bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-bold rounded-lg shadow transition-all flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">key</span>
                      <span>Digital Key</span>
                    </Link>
                  )}

                  <Link
                    to={`/history?car=${encodeURIComponent(order.carName)}`}
                    className="px-3 py-2 bg-[#f3f3ff] hover:bg-[#ebedff] text-[#131a33] text-xs font-bold rounded-lg border border-[#ebedff] transition-colors"
                  >
                    History
                  </Link>

                  {order.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleCancelBooking(order.orderId)}
                      disabled={actionLoading === order.orderId}
                      className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">cancel</span>
                      <span>{actionLoading === order.orderId ? 'Cancelling...' : 'Cancel'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
