import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyCars, getOwnerOrders, addCar, updateCar, deleteCar, getCurrentUser, getCarImage } from '../services/api';

export default function HostCars() {
  const [myCars, setMyCars] = useState([]);
  const [ownerOrders, setOwnerOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'cars'
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const currentUser = getCurrentUser() || {};

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    price: 3499,
    rating: 5.0,
    type: 'SUV',
    seats: 5,
    range: '500 km',
    acceleration: '7.5s',
    fuelType: 'Petrol',
    imageUrl: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [cars, orders] = await Promise.all([getMyCars(), getOwnerOrders()]);
      setMyCars(cars || []);
      setOwnerOrders(orders || []);
    } catch (err) {
      console.error('Failed to load host data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingCar(null);
    setFormData({
      name: '',
      company: '',
      price: 3499,
      rating: 5.0,
      type: 'SUV',
      seats: 5,
      range: '500 km',
      acceleration: '7.5s',
      fuelType: 'Petrol',
      imageUrl: '',
    });
    setShowAddModal(true);
  };

  const openEditModal = (car) => {
    setEditingCar(car);
    setFormData({
      name: car.name || '',
      company: car.company || '',
      price: car.price || 3499,
      rating: car.rating || 5.0,
      type: car.type || 'SUV',
      seats: car.seats || 5,
      range: car.range || '500 km',
      acceleration: car.acceleration || '7.5s',
      fuelType: car.fuelType || 'Petrol',
      imageUrl: car.imageUrl || car.image || '',
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        rating: parseFloat(formData.rating) || 5.0,
        seats: parseInt(formData.seats),
        imageUrl: formData.imageUrl.trim() ? formData.imageUrl.trim() : getCarImage(formData.type),
      };

      if (editingCar) {
        await updateCar(editingCar.id || editingCar.name, payload);
        setMessage(`Successfully updated vehicle "${formData.name}".`);
      } else {
        await addCar(payload);
        setMessage(`Successfully listed your vehicle "${formData.name}" in the fleet!`);
      }

      setShowAddModal(false);
      await loadData();
    } catch (err) {
      console.error('Failed to save car:', err);
      alert('Unable to save vehicle details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCar = async (car) => {
    if (!window.confirm(`Are you sure you want to remove ${car.name} from your listed fleet?`)) {
      return;
    }
    try {
      await deleteCar(car.id || car.name);
      await loadData();
    } catch (err) {
      console.error('Failed to delete car:', err);
      alert('Failed to delete car.');
    }
  };

  const totalEarnings = ownerOrders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (parseFloat(o.carPrice) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ebedff]">
        <div>
          <span className="text-xs font-mono font-bold text-[#006194] uppercase tracking-wider">Vehicle Host Portal</span>
          <h1 className="text-3xl font-extrabold text-[#131a33] mt-1">My Cars & Rental Inquiries</h1>
          <p className="text-sm text-[#3f4850] mt-1">
            Host: <span className="font-bold text-[#131a33]">{currentUser.name || 'Owner'}</span> ({currentUser.email}) • Monitor bookings placed on your fleet
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-3 bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>List a New Car</span>
        </button>
      </div>

      {message && (
        <div className="my-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          <span>{message}</span>
        </div>
      )}

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-8">
        <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#707881] uppercase">My Listed Cars</span>
            <span className="material-symbols-outlined text-[#006194] text-[20px]">directions_car</span>
          </div>
          <div className="text-2xl font-black text-[#131a33] mt-2">{myCars.length}</div>
          <div className="text-[11px] text-[#006194] font-medium mt-1">Active in Public Fleet</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#707881] uppercase">Orders on My Cars</span>
            <span className="material-symbols-outlined text-[#006194] text-[20px]">receipt_long</span>
          </div>
          <div className="text-2xl font-black text-[#131a33] mt-2">{ownerOrders.length}</div>
          <div className="text-[11px] text-[#006194] font-medium mt-1">Booked by Verified Renters</div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#707881] uppercase">Host Gross Invoiced</span>
            <span className="material-symbols-outlined text-[#006194] text-[20px]">payments</span>
          </div>
          <div className="text-2xl font-black text-[#131a33] mt-2">₹{totalEarnings.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-[#006194] font-medium mt-1">Confirmed Rental Revenue</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-[#006194] text-white shadow-md'
              : 'bg-white border border-[#ebedff] text-[#707881] hover:text-[#131a33]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">notifications_active</span>
          <span>Bookings on My Cars ({ownerOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cars')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'cars'
              ? 'bg-[#006194] text-white shadow-md'
              : 'bg-white border border-[#ebedff] text-[#707881] hover:text-[#131a33]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">garage</span>
          <span>My Listed Vehicles ({myCars.length})</span>
        </button>
      </div>

      {/* TAB 1: ORDERS ON MY CARS */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-[#ebedff] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#ebedff] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#131a33]">Order Details of Your Vehicles</h2>
              <p className="text-xs text-[#707881] mt-0.5">Showing reservations placed exclusively on cars listed under your account</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#006194]">{ownerOrders.length} bookings</span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-[#707881]">
              <span className="material-symbols-outlined animate-spin text-3xl text-[#006194]">progress_activity</span>
              <p className="mt-2 text-sm">Loading vehicle orders...</p>
            </div>
          ) : ownerOrders.length === 0 ? (
            <div className="py-20 text-center">
              <span className="material-symbols-outlined text-4xl text-[#bfc7d2]">event_busy</span>
              <h3 className="text-base font-bold text-[#131a33] mt-2">No bookings on your vehicles yet</h3>
              <p className="text-xs text-[#707881] mt-1 max-w-sm mx-auto">
                When another driver reserves any of your listed vehicles, their booking details and schedule will appear here.
              </p>
              {myCars.length === 0 && (
                <button
                  onClick={openAddModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 bg-[#006194] text-white text-xs font-bold rounded-xl shadow hover:bg-[#007bb9]"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>List Your First Car</span>
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf8ff] text-[#707881] uppercase font-bold border-b border-[#ebedff]">
                  <tr>
                    <th className="py-3 px-6">Order ID</th>
                    <th className="py-3 px-6">Vehicle</th>
                    <th className="py-3 px-6">Renter (Driver)</th>
                    <th className="py-3 px-6">Rental Window</th>
                    <th className="py-3 px-6">Pickup Station</th>
                    <th className="py-3 px-6">Total Invoiced</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ebedff]">
                  {ownerOrders.map((order) => (
                    <tr key={order.orderId || order.id} className="hover:bg-[#faf8ff] transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-[#131a33]">
                        {order.orderId || order.id}
                      </td>
                      <td className="py-4 px-6 font-bold text-[#006194]">
                        {order.carName}
                      </td>
                      <td className="py-4 px-6 text-[#3f4850]">
                        <div className="font-semibold text-[#131a33]">{order.carUser}</div>
                        <div className="text-[10px] text-[#707881]">Verified Renter</div>
                      </td>
                      <td className="py-4 px-6 text-[#3f4850] font-mono text-[11px]">
                        <div>{order.pickUpTime ? new Date(order.pickUpTime).toLocaleDateString() : 'N/A'}</div>
                        <div className="text-[10px] text-[#707881]">to {order.returnUpTime ? new Date(order.returnUpTime).toLocaleDateString() : 'N/A'}</div>
                      </td>
                      <td className="py-4 px-6 text-[#3f4850]">
                        {order.pickupLocation || 'Main Hub'}
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
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#f3f3ff] hover:bg-[#ebedff] text-[#006194] rounded-lg font-bold"
                        >
                          <span>Details</span>
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
      )}

      {/* TAB 2: MY LISTED CARS */}
      {activeTab === 'cars' && (
        <div>
          {loading ? (
            <div className="py-20 text-center text-[#707881]">
              <span className="material-symbols-outlined animate-spin text-3xl text-[#006194]">progress_activity</span>
              <p className="mt-2 text-sm">Loading your vehicles...</p>
            </div>
          ) : myCars.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#ebedff] p-12 text-center space-y-4 shadow-sm">
              <span className="material-symbols-outlined text-[48px] text-[#bfc7d2]">no_crash</span>
              <h3 className="text-lg font-bold text-[#131a33]">You haven't listed any cars yet</h3>
              <p className="text-xs text-[#3f4850] max-w-sm mx-auto">
                Add your car to the DriveEase marketplace to start earning rental income.
              </p>
              <button
                onClick={openAddModal}
                className="px-5 py-2.5 bg-[#006194] text-white text-xs font-bold rounded-xl shadow"
              >
                List Your Car Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCars.map((car) => (
                <div
                  key={car.id || car.name}
                  className="bg-white rounded-2xl border border-[#ebedff] hover:border-[#006194]/40 hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] bg-[#f8fafc] overflow-hidden">
                      <img
                        src={car.imageUrl || car.image || getCarImage(car.type)}
                        alt={car.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80";
                        }}
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold text-[#006194] shadow-sm">
                        {car.type}
                      </div>
                      <div className="absolute top-3 right-3 bg-emerald-600/90 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                        HOSTED BY YOU
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#006194] uppercase tracking-wider">
                          {car.company}
                        </span>
                        <h3 className="text-lg font-bold text-[#131a33]">{car.name}</h3>
                      </div>

                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#ebedff] text-[11px] text-[#707881]">
                        <div>{car.seats} Seats</div>
                        <div>{car.fuelType || 'Petrol'}</div>
                        <div>{car.range || '500 km'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#707881] block">Daily Rate</span>
                      <div className="text-xl font-extrabold text-[#006194]">
                        ₹{car.price?.toLocaleString('en-IN')}
                        <span className="text-xs text-[#707881] font-normal"> / day</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(car)}
                        className="px-3 py-1.5 bg-[#f3f3ff] hover:bg-[#ebedff] text-[#006194] text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[15px]">edit</span>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCar(car)}
                        className="p-1.5 hover:bg-red-50 text-[#707881] hover:text-red-600 rounded-lg transition-colors"
                        title="Remove Car"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT CAR MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#ebedff] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#ebedff]">
              <div>
                <h3 className="text-xl font-bold text-[#131a33]">
                  {editingCar ? 'Edit Vehicle Details' : 'List Your Vehicle'}
                </h3>
                <p className="text-xs text-[#707881] mt-0.5">
                  Vehicle will be listed in the DriveEase public catalog under your account
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#ebedff] text-[#707881]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Vehicle Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Creta SX 2024"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold focus:ring-2 focus:ring-[#006194] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Manufacturer</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyundai, Tata, Mahindra"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold focus:ring-2 focus:ring-[#006194] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Price / Day (₹)</label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold focus:ring-2 focus:ring-[#006194] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Body Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold focus:ring-2 focus:ring-[#006194] focus:outline-none"
                  >
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Electric">Electric</option>
                    <option value="Convertible">Convertible</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Seats</label>
                  <select
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold focus:ring-2 focus:ring-[#006194] focus:outline-none"
                  >
                    <option value={4}>4 Seats</option>
                    <option value={5}>5 Seats</option>
                    <option value={7}>7 Seats</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Fuel Type</label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold focus:ring-2 focus:ring-[#006194] focus:outline-none"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Range / Tank</label>
                  <input
                    type="text"
                    placeholder="e.g. 550 km"
                    value={formData.range}
                    onChange={(e) => setFormData({ ...formData, range: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold focus:ring-2 focus:ring-[#006194] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://... or leave empty to use type template"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold focus:ring-2 focus:ring-[#006194] focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#ebedff] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#bfc7d2] text-xs font-bold text-[#707881] hover:bg-[#f3f3ff]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#006194] hover:bg-[#007bb9] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  {submitting ? <span>Saving to Fleet...</span> : <span>{editingCar ? 'Update Vehicle' : 'List Car Now'}</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
