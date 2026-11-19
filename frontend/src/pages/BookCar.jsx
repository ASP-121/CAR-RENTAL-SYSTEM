import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCars, bookCar, checkAvailability, calculateDynamicPrice, getCurrentUser } from '../services/api';

export default function BookCar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [dynamicPrice, setDynamicPrice] = useState(null);

  const currentUser = getCurrentUser();

  // Form State
  const [formData, setFormData] = useState({
    carUser: currentUser ? currentUser.name : '',
    pickupLocation: 'Mumbai Chhatrapati Shivaji Maharaj Airport (BOM)',
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

  // Check availability and calculate dynamic pricing when car or dates change
  useEffect(() => {
    if (car && formData.pickUpDate && formData.returnDate) {
      const start = `${formData.pickUpDate}T${formData.pickUpTime}:00`;
      const end = `${formData.returnDate}T${formData.returnTime}:00`;
      
      checkAvailability(car.name, start, end).then(res => {
        setIsAvailable(res.available);
        setAvailabilityMessage(res.message);
      });

      calculateDynamicPrice(car.name, start, end).then(dp => {
        if (dp) setDynamicPrice(dp);
      });
    }
  }, [car, formData.pickUpDate, formData.pickUpTime, formData.returnDate, formData.returnTime]);

  // Calculate rental duration in days
  const calculateDays = () => {
    const start = new Date(formData.pickUpDate);
    const end = new Date(formData.returnDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const days = dynamicPrice ? dynamicPrice.rentalDays : calculateDays();
  const effectiveDailyRate = dynamicPrice ? dynamicPrice.effectiveDailyRate : (car ? car.price : 4999);
  const baseTotal = dynamicPrice ? dynamicPrice.baseSubtotal : (effectiveDailyRate * days);
  const insuranceCost = formData.insuranceType === 'premium' ? 499 * days : 0;
  const tax = dynamicPrice ? dynamicPrice.tax : Math.round(baseTotal * 0.18);
  const grandTotal = baseTotal + insuranceCost + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!car) return;

    if (!currentUser) {
      alert("Please sign in or register an account to complete your vehicle reservation.");
      navigate('/auth');
      return;
    }

    if (!isAvailable) {
      alert("This vehicle is already reserved for the selected schedule. Please select alternative dates.");
      return;
    }

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
      carUser: currentUser.email || currentUser.name || 'Driver',
      carOwner: "DriveEase Smart Fleet",
      pickupLocation: formData.pickupLocation,
      pickUpTime: `${formData.pickUpDate}T${formData.pickUpTime}:00`,
      returnUpTime: `${formData.returnDate}T${formData.returnTime}:00`,
      isBooked: true,
      status: "CONFIRMED",
    };

    try {
      await bookCar(orderPayload);
      navigate(`/confirmation/${generatedOrderId}`, { state: { order: orderPayload, car } });
    } catch (err) {
      console.error('Booking failed:', err);
      alert(err.message || 'Unable to complete booking. Please try again.');
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          {/* Driver identity */}
          <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-[#131a33] uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#006194]">badge</span>
              Driver Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Driver Name</label>
                <input
                  type="text"
                  required
                  value={formData.carUser}
                  onChange={(e) => setFormData({ ...formData, carUser: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold text-[#131a33] focus:ring-2 focus:ring-[#006194] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Pickup Station</label>
                <select
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  className="w-full h-11 px-3 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold text-[#131a33] focus:ring-2 focus:ring-[#006194] focus:outline-none"
                >
                  <option value="Mumbai Chhatrapati Shivaji Maharaj Airport (BOM)">Mumbai Airport Hub (BOM)</option>
                  <option value="Delhi Indira Gandhi International Airport (DEL)">Delhi IGI Airport (DEL)</option>
                  <option value="Bengaluru Kempegowda International Airport (BLR)">Bengaluru Airport Hub (BLR)</option>
                  <option value="Hyderabad Rajiv Gandhi International Airport (HYD)">Hyderabad Airport (HYD)</option>
                  <option value="Pune Airport / Viman Nagar Terminal (PNQ)">Pune Airport Hub (PNQ)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Schedule Configuration */}
          <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#131a33] uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#006194]">schedule</span>
                Trip Schedule
              </h2>
              {availabilityMessage && (
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                  isAvailable
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  <span className="material-symbols-outlined text-[14px]">
                    {isAvailable ? 'check_circle' : 'cancel'}
                  </span>
                  {isAvailable ? 'Available' : 'Conflict Detected'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Pickup Date</label>
                <input
                  type="date"
                  required
                  value={formData.pickUpDate}
                  onChange={(e) => setFormData({ ...formData, pickUpDate: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Pickup Time</label>
                <input
                  type="time"
                  required
                  value={formData.pickUpTime}
                  onChange={(e) => setFormData({ ...formData, pickUpTime: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Return Date</label>
                <input
                  type="date"
                  required
                  value={formData.returnDate}
                  onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Return Time</label>
                <input
                  type="time"
                  required
                  value={formData.returnTime}
                  onChange={(e) => setFormData({ ...formData, returnTime: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Insurance */}
          <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-[#131a33] uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#006194]">shield</span>
              Protection Package
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, insuranceType: 'premium' })}
                className={`p-4 rounded-xl text-left border-2 transition-all ${
                  formData.insuranceType === 'premium'
                    ? 'border-[#006194] bg-[#f3f3ff]'
                    : 'border-[#ebedff] bg-white'
                }`}
              >
                <div className="font-bold text-xs text-[#131a33]">Comprehensive (₹499/day)</div>
                <div className="text-[11px] text-[#707881] mt-1">₹0 deductible, 24/7 RSA assistance</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, insuranceType: 'basic' })}
                className={`p-4 rounded-xl text-left border-2 transition-all ${
                  formData.insuranceType === 'basic'
                    ? 'border-[#006194] bg-[#f3f3ff]'
                    : 'border-[#ebedff] bg-white'
                }`}
              >
                <div className="font-bold text-xs text-[#131a33]">Standard (Included)</div>
                <div className="text-[11px] text-[#707881] mt-1">Basic statutory third-party liability</div>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !isAvailable}
            className="w-full py-4 bg-[#006194] hover:bg-[#007bb9] disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span>Confirming with MongoDB...</span>
            ) : !isAvailable ? (
              <span>Car Not Available for Selected Dates</span>
            ) : (
              <>
                <span>Confirm Reservation (₹{grandTotal.toLocaleString('en-IN')})</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Right Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm space-y-6 sticky top-28">
            <div className="flex items-center gap-4 pb-4 border-b border-[#ebedff]">
              <img
                src={car.image || '/assets/cars/sedan.jpg'}
                alt={car.name}
                className="w-24 h-16 rounded-xl object-cover border border-[#ebedff]"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80";
                }}
              />
              <div>
                <span className="text-[10px] font-mono font-bold text-[#006194] uppercase">{car.company}</span>
                <h3 className="text-base font-bold text-[#131a33]">{car.name}</h3>
                <span className="text-xs text-[#006947] font-semibold">★ {car.rating || 4.9} Verified</span>
              </div>
            </div>

            {/* Dynamic Pricing Surge/Discount Indicator */}
            {dynamicPrice && dynamicPrice.surgeType !== 'STANDARD' && (
              <div className={`p-3 rounded-xl text-xs font-bold border flex items-start gap-2.5 ${
                dynamicPrice.multiplier > 1.0
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">
                  {dynamicPrice.multiplier > 1.0 ? 'bolt' : 'savings'}
                </span>
                <div className="space-y-0.5">
                  <div className="leading-tight font-extrabold">{dynamicPrice.surgeMessage}</div>
                  <div className="text-[10px] font-mono opacity-80">
                    Base: ₹{dynamicPrice.baseDailyRate?.toLocaleString('en-IN')}/day • Demand Multiplier: {dynamicPrice.multiplier}x
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-[#707881]">
                <span>Effective Daily Rate</span>
                <span className="font-semibold text-[#131a33]">₹{effectiveDailyRate.toLocaleString('en-IN')} / day</span>
              </div>
              <div className="flex justify-between text-[#707881]">
                <span>Rental Period</span>
                <span className="font-semibold text-[#131a33]">{days} Days</span>
              </div>
              <div className="flex justify-between text-[#707881]">
                <span>Base Subtotal</span>
                <span className="font-semibold text-[#131a33]">₹{baseTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#707881]">
                <span>Protection Plan</span>
                <span className="font-semibold text-[#131a33]">₹{insuranceCost.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#707881]">
                <span>GST (18%)</span>
                <span className="font-semibold text-[#131a33]">₹{tax.toLocaleString('en-IN')}</span>
              </div>

              <div className="pt-3 border-t border-[#ebedff] flex justify-between text-sm font-extrabold text-[#131a33]">
                <span>Estimated Total</span>
                <span className="text-xl text-[#006194]">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 bg-[#f3f3ff] rounded-xl text-[11px] text-[#3f4850] space-y-1">
              <div className="font-bold text-[#131a33] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#006194]">key</span>
                Instant Digital Key Access
              </div>
              <p>Lock, unlock, and precondition climate via smartphone immediately upon booking confirmation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
