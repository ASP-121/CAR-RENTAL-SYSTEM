import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCars, bookCar } from '../services/api';

export default function BookCar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    carUser: 'Alex Morgan',
    pickupLocation: 'San Francisco Int Airport (SFO)',
    pickUpDate: new Date().toISOString().split('T')[0],
    pickUpTime: '10:00',
    returnDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    returnTime: '10:00',
    insuranceType: 'premium',
  });

  useEffect(() => {
    getCars().then(allCars => {
      const found = allCars.find(c => (c.id && c.id === id) || c.name === id || c.name.toLowerCase() === decodeURIComponent(id).toLowerCase());
      setCar(found || allCars[0]);
      setLoading(false);
    });
  }, [id]);

  // Calculate rental duration in days
  const calculateDays = () => {
    const start = new Date(formData.pickUpDate);
    const end = new Date(formData.returnDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const days = calculateDays();
  const dailyRate = car ? car.price : 90;
  const baseTotal = dailyRate * days;
  const insuranceCost = formData.insuranceType === 'premium' ? 18 * days : 0;
  const tax = Math.round(baseTotal * 0.08);
  const grandTotal = baseTotal + insuranceCost + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!car) return;

    setSubmitting(true);

    const generatedOrderId = "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();

    const orderPayload = {
      orderId: generatedOrderId,
      carName: car.name,
      carCompany: car.company,
      carPrice: grandTotal,
      carRating: car.rating || 4.9,
      carType: car.type || 'Sedan',
      seats: car.seats || 5,
      carUser: formData.carUser,
      carOwner: "SmartDrive Fleet",
      pickupLocation: formData.pickupLocation,
      pickUpTime: `${formData.pickUpDate}T${formData.pickUpTime}:00`,
      returnUpTime: `${formData.returnDate}T${formData.returnTime}:00`,
      isBooked: true,
    };

    try {
      await bookCar(orderPayload);
      // Navigate to confirmation & digital key screen
      navigate(`/confirmation/${generatedOrderId}`, { state: { order: orderPayload, car } });
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Unable to complete booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="h-64 bg-white rounded-2xl animate-pulse border border-[#ebedff]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-[#ebedff]">
        <span className="text-xs font-mono font-bold text-[#006194] uppercase tracking-wider">Step 2 of 3</span>
        <h1 className="text-3xl font-extrabold text-[#131a33] mt-1">Book Car & Rate Calculator</h1>
        <p className="text-sm text-[#3f4850] mt-1">
          Review vehicle telemetry, configure trip schedule, and lock in your automated reservation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Booking inputs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Driver Information */}
          <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#131a33] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006194] text-[20px]">person</span>
              Driver Information
            </h2>

            <div>
              <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Full Name</label>
              <input
                type="text"
                required
                value={formData.carUser}
                onChange={(e) => setFormData({ ...formData, carUser: e.target.value })}
                className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-sm font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                placeholder="e.g. Alex Morgan"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Pick-up Location</label>
              <select
                value={formData.pickupLocation}
                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-sm font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
              >
                <option value="San Francisco Int Airport (SFO)">San Francisco Int Airport (SFO)</option>
                <option value="Downtown Station, Market St">Downtown Station, Market St</option>
                <option value="San Jose Silicon Valley Hub">San Jose Silicon Valley Hub</option>
                <option value="Oakland Airport Express">Oakland Airport Express</option>
              </select>
            </div>
          </div>

          {/* Schedule & Timing */}
          <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#131a33] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006194] text-[20px]">schedule</span>
              Rental Dates & Times
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Pick-up Date</label>
                <input
                  type="date"
                  required
                  value={formData.pickUpDate}
                  onChange={(e) => setFormData({ ...formData, pickUpDate: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-sm font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Pick-up Time</label>
                <input
                  type="time"
                  required
                  value={formData.pickUpTime}
                  onChange={(e) => setFormData({ ...formData, pickUpTime: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-sm font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Return Date</label>
                <input
                  type="date"
                  required
                  value={formData.returnDate}
                  onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-sm font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Return Time</label>
                <input
                  type="time"
                  required
                  value={formData.returnTime}
                  onChange={(e) => setFormData({ ...formData, returnTime: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-sm font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Insurance Package */}
          <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm space-y-3">
            <h2 className="text-base font-bold text-[#131a33] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006194] text-[20px]">security</span>
              Protection Package
            </h2>

            <div
              onClick={() => setFormData({ ...formData, insuranceType: 'premium' })}
              className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                formData.insuranceType === 'premium'
                  ? 'border-[#006194] bg-[#ebedff]/40'
                  : 'border-[#ebedff] bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#006947] text-[24px]">verified_user</span>
                <div>
                  <div className="text-sm font-bold text-[#131a33]">Comprehensive Smart Coverage</div>
                  <div className="text-xs text-[#3f4850]">$0 deductible, roadside assistance, digital unlock warranty.</div>
                </div>
              </div>
              <span className="text-sm font-bold text-[#006194]">+$18/day</span>
            </div>

            <div
              onClick={() => setFormData({ ...formData, insuranceType: 'basic' })}
              className={`p-4 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                formData.insuranceType === 'basic'
                  ? 'border-[#006194] bg-[#ebedff]/40'
                  : 'border-[#ebedff] bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#707881] text-[24px]">shield</span>
                <div>
                  <div className="text-sm font-bold text-[#131a33]">Standard State Minimum</div>
                  <div className="text-xs text-[#3f4850]">$500 damage deductible applies.</div>
                </div>
              </div>
              <span className="text-sm font-bold text-[#707881]">Included</span>
            </div>
          </div>
        </div>

        {/* Right Summary & Rate Breakdown */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-[#ebedff] p-6 sm:p-8 shadow-lg sticky top-28 space-y-6">
            <h2 className="text-lg font-bold text-[#131a33] pb-4 border-b border-[#ebedff]">
              Rate Breakdown & Vehicle
            </h2>

            {/* Selected Car Card */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#f3f3ff] border border-[#ebedff]">
              <img
                src={car.image || '/assets/cars/sedan.jpg'}
                alt={car.name}
                className="w-20 h-16 rounded-xl object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80";
                }}
              />
              <div>
                <span className="text-[11px] font-mono text-[#006194] font-bold uppercase">{car.company}</span>
                <div className="text-base font-bold text-[#131a33] leading-tight">{car.name}</div>
                <div className="text-xs text-[#707881] mt-0.5">{car.type} • {car.seats} Seats</div>
              </div>
            </div>

            {/* Calculation Ledger */}
            <div className="space-y-3 text-xs font-medium text-[#3f4850]">
              <div className="flex justify-between">
                <span>Daily rate (${dailyRate} × {days} days)</span>
                <span className="text-[#131a33] font-bold">${baseTotal}</span>
              </div>

              {insuranceCost > 0 && (
                <div className="flex justify-between">
                  <span>Smart Coverage (${18} × {days} days)</span>
                  <span className="text-[#131a33] font-bold">+${insuranceCost}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Tax & Airport Concession (8%)</span>
                <span className="text-[#131a33] font-bold">+${tax}</span>
              </div>

              <div className="flex justify-between text-[#006947]">
                <span>Keyless Digital Unlock Fee</span>
                <span className="font-bold">FREE ($0.00)</span>
              </div>

              <div className="pt-4 border-t-2 border-[#ebedff] flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-[#131a33] block">Total Amount Due</span>
                  <span className="text-[10px] text-[#707881]">Calculated automatically</span>
                </div>
                <span className="text-3xl font-black text-[#006194]">${grandTotal}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#006194] hover:bg-[#007bb9] disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                  <span>Confirming with MongoDB...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                  <span>Confirm Reservation & Generate Key</span>
                </>
              )}
            </button>

            <div className="text-center text-[11px] text-[#707881] flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#006947]">verified</span>
              Encrypted MongoDB transaction • Spring Boot REST Verified
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
