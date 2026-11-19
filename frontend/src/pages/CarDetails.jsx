import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCars, getCurrentUser } from '../services/api';

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentUser = getCurrentUser();
  const isAdmin = currentUser?.role === 'ADMIN';

  useEffect(() => {
    getCars().then(allCars => {
      const found = allCars.find(c => (c.id && c.id === id) || c.name === id || c.name.toLowerCase() === decodeURIComponent(id).toLowerCase());
      setCar(found || allCars[0]);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-96 bg-white rounded-3xl animate-pulse border border-[#ebedff]"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Vehicle Not Found</h2>
        <Link to="/fleet" className="inline-block px-4 py-2 bg-[#006194] text-white rounded-lg">Return to Fleet</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-[#707881] mb-6">
        <Link to="/" className="hover:text-[#006194]">Home</Link>
        <span>/</span>
        <Link to="/fleet" className="hover:text-[#006194]">Fleet</Link>
        <span>/</span>
        <span className="text-[#131a33] font-bold">{car.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left main info */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Visual Stage */}
          <div className="bg-white rounded-3xl border border-[#ebedff] shadow-sm overflow-hidden p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-mono font-bold text-[#006194] uppercase tracking-wider">{car.company}</span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#131a33] mt-1">{car.name}</h1>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#006947]/10 text-[#006947] border border-[#006947]/30 rounded-full text-xs font-bold">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Available Now
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#f3f3ff] text-[#131a33] rounded-full text-xs font-bold border border-[#ebedff]">
                  ★ {car.rating || 4.9} Rating
                </span>
              </div>
            </div>

            {/* Vehicle Image Stage */}
            <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-[#f8fafc] border border-[#ebedff]">
              <img
                src={car.image || '/assets/cars/sedan.jpg'}
                alt={car.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80";
                }}
              />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#4edea3]">bolt</span>
                <span>Active Telemetry Monitoring</span>
              </div>
            </div>

            {/* Technical Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <div className="p-4 rounded-xl bg-[#f3f3ff] border border-[#ebedff] text-center">
                <span className="material-symbols-outlined text-[24px] text-[#006194] mb-1">airline_seat_recline_normal</span>
                <div className="text-xs text-[#707881] font-semibold">Capacity</div>
                <div className="text-lg font-bold text-[#131a33] mt-0.5">{car.seats || 5} Passengers</div>
              </div>

              <div className="p-4 rounded-xl bg-[#f3f3ff] border border-[#ebedff] text-center">
                <span className="material-symbols-outlined text-[24px] text-[#006194] mb-1">speed</span>
                <div className="text-xs text-[#707881] font-semibold">0-60 MPH</div>
                <div className="text-lg font-bold text-[#131a33] mt-0.5">{car.acceleration || '4.2s'}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#f3f3ff] border border-[#ebedff] text-center">
                <span className="material-symbols-outlined text-[24px] text-[#006194] mb-1">battery_charging_full</span>
                <div className="text-xs text-[#707881] font-semibold">Max Range</div>
                <div className="text-lg font-bold text-[#131a33] mt-0.5">{car.range || '380 mi'}</div>
              </div>

              <div className="p-4 rounded-xl bg-[#f3f3ff] border border-[#ebedff] text-center">
                <span className="material-symbols-outlined text-[24px] text-[#006194] mb-1">category</span>
                <div className="text-xs text-[#707881] font-semibold">Powertrain</div>
                <div className="text-lg font-bold text-[#131a33] mt-0.5">{car.type}</div>
              </div>
            </div>
          </div>

          {/* Included Features */}
          <div className="bg-white rounded-3xl border border-[#ebedff] p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-[#131a33]">Vehicle Features & Inclusions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#faf8ff] border border-[#ebedff]">
                <span className="material-symbols-outlined text-[#006947] text-[20px]">phonelink_ring</span>
                <div>
                  <div className="text-sm font-bold text-[#131a33]">Digital Key Access</div>
                  <p className="text-xs text-[#3f4850] mt-0.5">Unlock car via browser immediately upon booking.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#faf8ff] border border-[#ebedff]">
                <span className="material-symbols-outlined text-[#006947] text-[20px]">shield</span>
                <div>
                  <div className="text-sm font-bold text-[#131a33]">Comprehensive Coverage</div>
                  <p className="text-xs text-[#3f4850] mt-0.5">24/7 Roadside breakdown assist included.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#faf8ff] border border-[#ebedff]">
                <span className="material-symbols-outlined text-[#006947] text-[20px]">airline_seat_legroom_extra</span>
                <div>
                  <div className="text-sm font-bold text-[#131a33]">Premium Cabin Comfort</div>
                  <p className="text-xs text-[#3f4850] mt-0.5">Heated seats, wireless charging, and climate control.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-[#faf8ff] border border-[#ebedff]">
                <span className="material-symbols-outlined text-[#006947] text-[20px]">autorenew</span>
                <div>
                  <div className="text-sm font-bold text-[#131a33]">Flexible Cancellation</div>
                  <p className="text-xs text-[#3f4850] mt-0.5">Free changes up to 24 hours prior to reservation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Box */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-3xl border border-[#ebedff] p-6 sm:p-8 shadow-lg sticky top-28 space-y-6">
            <div className="flex justify-between items-baseline pb-4 border-b border-[#ebedff]">
              <div>
                <span className="text-xs text-[#707881] block uppercase font-bold">Rental Rate</span>
                <span className="text-3xl font-extrabold text-[#006194]">₹{car.price?.toLocaleString('en-IN')}</span>
                <span className="text-xs text-[#3f4850] font-normal"> / day</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#cce5ff] text-[#001d31] font-mono text-xs font-bold">
                INSTANT UNLOCK
              </span>
            </div>

            {/* Estimated rate calculator snippet */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-[#3f4850]">
                <span>Base 3-day rental</span>
                <span className="font-semibold text-[#131a33]">₹{(car.price * 3).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#3f4850]">
                <span>Standard damage waiver</span>
                <span className="font-semibold text-[#006947]">INCLUDED</span>
              </div>
              <div className="flex justify-between text-[#3f4850]">
                <span>GST & Airport surcharge (18%)</span>
                <span className="font-semibold text-[#131a33]">₹{Math.round((car.price * 3) * 0.18).toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-3 border-t border-[#ebedff] flex justify-between text-sm font-bold text-[#131a33]">
                <span>Estimated Total</span>
                <span className="text-base text-[#006194]">
                  ₹{Math.round((car.price * 3) * 1.18).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/book/${car.id || encodeURIComponent(car.name)}`)}
              className="w-full py-3.5 bg-[#006194] hover:bg-[#007bb9] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              <span>Proceed to Booking</span>
            </button>

            {isAdmin && (
              <div className="text-center pt-2 border-t border-[#ebedff]">
                <Link
                  to={`/history?car=${encodeURIComponent(car.name)}`}
                  className="text-xs text-[#006194] hover:underline font-semibold flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">history</span>
                  <span>View Rental History for {car.name} (Admin Only)</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
