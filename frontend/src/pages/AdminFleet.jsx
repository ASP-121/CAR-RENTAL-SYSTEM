import React, { useState, useEffect } from 'react';
import { getCars, addCar, updateCar, deleteCar } from '../services/api';

export default function AdminFleet() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    price: 4999,
    rating: 4.8,
    type: 'Sedan',
    seats: 5,
    range: '500 km',
    acceleration: '4.5s',
    fuelType: 'Gasoline',
    imageUrl: '',
  });

  const loadCars = () => {
    setLoading(true);
    getCars().then(data => {
      setCars(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadCars();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingCar) {
        await updateCar(editingCar.id || editingCar.name, {
          ...formData,
          price: parseFloat(formData.price),
          rating: parseFloat(formData.rating),
          seats: parseInt(formData.seats),
        });
      } else {
        await addCar({
          ...formData,
          price: parseFloat(formData.price),
          rating: parseFloat(formData.rating),
          seats: parseInt(formData.seats),
        });
      }
      setShowAddModal(false);
      setEditingCar(null);
      setFormData({
        name: '',
        company: '',
        price: 95,
        rating: 4.8,
        type: 'Sedan',
        seats: 5,
        range: '450 mi',
        acceleration: '4.5s',
        fuelType: 'Gasoline',
        imageUrl: '',
      });
      loadCars();
    } catch (err) {
      console.error(err);
      alert('Failed to save vehicle details');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = (car) => {
    setEditingCar(car);
    setFormData({
      name: car.name || '',
      company: car.company || '',
      price: car.price || 95,
      rating: car.rating || 4.8,
      type: car.type || 'Sedan',
      seats: car.seats || 5,
      range: car.range || '450 mi',
      acceleration: car.acceleration || '4.5s',
      fuelType: car.fuelType || 'Gasoline',
      imageUrl: car.imageUrl || '',
    });
    setShowAddModal(true);
  };

  const handleDeleteClick = async (car) => {
    if (!window.confirm(`Are you sure you want to remove ${car.name} from MongoDB fleet inventory?`)) {
      return;
    }
    try {
      await deleteCar(car.id || car.name);
      loadCars();
    } catch (err) {
      alert("Failed to delete vehicle");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ebedff]">
        <div>
          <span className="text-xs font-mono font-bold text-[#006194] uppercase tracking-wider">Operations Control</span>
          <h1 className="text-3xl font-extrabold text-[#131a33] mt-1">Admin Fleet Management</h1>
          <p className="text-sm text-[#3f4850] mt-1">
            Real-time vehicle telemetry, status control, and inventory configuration in MongoDB.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCar(null);
            setFormData({
              name: '',
              company: '',
              price: 95,
              rating: 4.8,
              type: 'Sedan',
              seats: 5,
              range: '450 mi',
              acceleration: '4.5s',
              fuelType: 'Gasoline',
              imageUrl: '',
            });
            setShowAddModal(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-bold rounded-xl shadow transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Fleet KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 my-8">
        <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm">
          <span className="text-xs font-bold text-[#707881] uppercase tracking-wider block">Total Fleet Size</span>
          <div className="text-3xl font-extrabold text-[#131a33] mt-2">{cars.length} Vehicles</div>
          <span className="text-xs text-[#006947] font-semibold mt-1 inline-block">MongoDB Synced</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm">
          <span className="text-xs font-bold text-[#707881] uppercase tracking-wider block">Active On-Road</span>
          <div className="text-3xl font-extrabold text-[#006194] mt-2">{Math.min(cars.length, 3)} Units</div>
          <span className="text-xs text-[#006194] font-semibold mt-1 inline-block">Keyless Digital Access</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm">
          <span className="text-xs font-bold text-[#707881] uppercase tracking-wider block">Utilization Rate</span>
          <div className="text-3xl font-extrabold text-[#006947] mt-2">84.2%</div>
          <span className="text-xs text-[#006947] font-semibold mt-1 inline-block">+6.4% this week</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm">
          <span className="text-xs font-bold text-[#707881] uppercase tracking-wider block">Service & Maintenance</span>
          <div className="text-3xl font-extrabold text-[#545d7c] mt-2">0 Urgent</div>
          <span className="text-xs text-[#707881] font-semibold mt-1 inline-block">All systems nominal</span>
        </div>
      </div>

      {/* Vehicle Inventory Grid */}
      <div className="bg-white rounded-2xl border border-[#ebedff] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#ebedff] flex items-center justify-between">
          <h2 className="text-base font-bold text-[#131a33]">Fleet Inventory Registry</h2>
          <span className="text-xs font-mono text-[#707881]">{cars.length} cars configured</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f3f3ff] text-[#707881] uppercase font-mono tracking-wider border-b border-[#ebedff]">
              <tr>
                <th className="py-3.5 px-6">Vehicle</th>
                <th className="py-3.5 px-6">Make / Company</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Specs</th>
                <th className="py-3.5 px-6">Daily Rate</th>
                <th className="py-3.5 px-6">Rating</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebedff] font-medium text-[#131a33]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-[#707881]">Loading fleet from Spring Boot...</td>
                </tr>
              ) : cars.map((car) => (
                <tr key={car.id || car.name} className="hover:bg-[#faf8ff] transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img
                      src={car.image || '/assets/cars/sedan.jpg'}
                      alt={car.name}
                      className="w-12 h-9 rounded-lg object-cover border border-[#ebedff]"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80";
                      }}
                    />
                    <div>
                      <div className="font-bold text-sm text-[#131a33]">{car.name}</div>
                      <div className="text-[10px] text-[#707881] font-mono">VIN: 5YJ3E1EB{car.id?.slice(-4) || '9281'}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold">{car.company}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full bg-[#ebedff] text-[#006194] text-[10px] font-bold">
                      {car.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-[11px] text-[#131a33] font-semibold">{car.seats} Seats • {car.fuelType || 'Gas'}</div>
                    <div className="text-[10px] text-[#707881]">{car.range || '450 mi'} • {car.acceleration || '4.8s'}</div>
                  </td>
                  <td className="py-4 px-6 font-extrabold text-sm text-[#006194]">₹{car.price?.toLocaleString('en-IN')}/day</td>
                  <td className="py-4 px-6 font-bold text-[#006947]">★ {car.rating || 4.9}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditClick(car)}
                        className="px-2.5 py-1.5 bg-[#f3f3ff] hover:bg-[#ebedff] text-[#006194] font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[15px]">edit</span>
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(car)}
                        className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-lg border border-red-200 transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[15px]">delete</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Car Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-[#ebedff] space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#ebedff]">
              <div>
                <h3 className="text-xl font-bold text-[#131a33]">
                  {editingCar ? 'Update Vehicle' : 'Add Vehicle to Fleet'}
                </h3>
                <p className="text-xs text-[#3f4850] mt-0.5">Persists directly to Spring Boot MongoDB collection</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-[#f3f3ff] flex items-center justify-center hover:bg-[#ebedff]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Model Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Model Y Long Range"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Manufacturer / Company</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tesla, BMW, Audi"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Vehicle Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                  >
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Electric">Electric</option>
                    <option value="Convertible">Convertible</option>
                    <option value="Hatchback">Hatchback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Seats</label>
                  <input
                    type="number"
                    min="2"
                    max="9"
                    required
                    value={formData.seats}
                    onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
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
                    className="w-full h-10 px-3 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Rating (★)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.05"
                    required
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Range (mi)</label>
                  <input
                    type="text"
                    placeholder="e.g. 350 mi"
                    value={formData.range}
                    onChange={(e) => setFormData({ ...formData, range: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">0-60 MPH Acceleration</label>
                  <input
                    type="text"
                    placeholder="e.g. 3.5s"
                    value={formData.acceleration}
                    onChange={(e) => setFormData({ ...formData, acceleration: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#ebedff]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#707881] hover:text-[#131a33]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#006194] hover:bg-[#007bb9] disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow"
                >
                  {submitting ? 'Saving...' : editingCar ? 'Save Changes' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
