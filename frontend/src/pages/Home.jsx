import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCars } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('San Francisco Downtown');
  const [dates, setDates] = useState({
    pickup: new Date().toISOString().split('T')[0],
    returnDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
  });

  useEffect(() => {
    getCars().then(data => {
      setCars(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/fleet?location=${encodeURIComponent(location)}&pickup=${dates.pickup}&returnDate=${dates.returnDate}`);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#ebedff] via-[#faf8ff] to-[#faf8ff] pb-16 pt-10">
        <div className="absolute -right-32 -top-40 w-[600px] h-[600px] rounded-full bg-[#006194]/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 top-1/2 w-96 h-96 rounded-full bg-[#d0d9fd]/40 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#cce5ff] text-[#001d31] shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#006947] animate-pulse"></span>
                <span className="font-mono text-xs font-semibold uppercase tracking-wider">Next-Gen Mobility Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#131a33] tracking-tight leading-[1.1]">
                Rent the Right Car for{' '}
                <span className="text-[#006194] underline decoration-[#93ccff] decoration-4 underline-offset-8">
                  Every Journey
                </span>
              </h1>

              <p className="text-lg text-[#3f4850] max-w-xl">
                Find, book, and unlock premium vehicles on demand. Transparent pricing, instant digital keys, and automated fleet tracking with Spring Boot & MongoDB.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/fleet"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#006194] hover:bg-[#007bb9] text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <span>Browse Fleet</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>

                <Link
                  to="/my-bookings"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#282f49] hover:bg-[#131a33] text-white font-semibold rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-[20px]">calendar_month</span>
                  <span>View My Bookings</span>
                </Link>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-6 pt-6 w-full max-w-lg border-t border-[#bfc7d2]/30">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#131a33] flex items-center">
                    4.98<span className="text-[#006194] text-xl ml-0.5">★</span>
                  </div>
                  <div className="text-xs text-[#3f4850] font-medium mt-0.5">25k+ Verified Drivers</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#131a33] flex items-center">
                    100<span className="text-[#006947] text-xl ml-0.5">%</span>
                  </div>
                  <div className="text-xs text-[#3f4850] font-medium mt-0.5">Digital Keyless Entry</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#131a33]">
                    &lt; 3<span className="text-[#006194] text-xl font-bold">m</span>
                  </div>
                  <div className="text-xs text-[#3f4850] font-medium mt-0.5">Average Booking Speed</div>
                </div>
              </div>
            </div>

            {/* Hero Right Showcase Vehicle */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full rounded-2xl p-6 bg-gradient-to-tr from-[#e3e7ff] via-[#f3f3ff] to-white shadow-xl border border-white/60">
                {/* Floating Badges */}
                <div className="absolute -top-3 -left-3 z-20 flex items-center gap-2 bg-white text-[#131a33] px-4 py-2 rounded-xl shadow-md border border-[#ebedff]">
                  <span className="material-symbols-outlined text-[#006947] text-[20px]">verified</span>
                  <div>
                    <div className="text-xs font-bold leading-none">Instant Confirmation</div>
                    <div className="text-[10px] text-[#3f4850]">Direct to MongoDB</div>
                  </div>
                </div>

                <div className="absolute -bottom-3 -right-3 z-20 flex items-center gap-2 bg-[#282f49] text-white px-4 py-2 rounded-xl shadow-lg">
                  <span className="material-symbols-outlined text-[#4edea3] text-[20px]">bolt</span>
                  <div>
                    <div className="text-xs font-bold leading-none">Fleet Telemetry</div>
                    <div className="text-[10px] text-[#bdc5e9]">Real-time tracking</div>
                  </div>
                </div>

                {/* Main Vehicle Image */}
                <div className="overflow-hidden rounded-xl bg-slate-900/5 aspect-video flex items-center justify-center">
                  <img
                    src="/assets/cars/electric.jpg"
                    alt="Tesla Model 3"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop&q=80";
                    }}
                  />
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-[#006194] uppercase tracking-wider">Featured Vehicle</div>
                    <div className="text-xl font-bold text-[#131a33]">Tesla Model 3 Performance</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-[#006194]">$89<span className="text-xs font-normal text-[#3f4850]">/day</span></div>
                    <div className="text-[11px] text-[#006947] font-semibold">Available Now</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Reservation Search Bar */}
      <section className="relative -mt-6 z-30 max-w-6xl mx-auto px-4 w-full">
        <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl border border-[#ebedff] p-4 sm:p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#707881] mb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#006194]">location_on</span>
              Pick-up Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, airport, or address"
              className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/50 text-sm font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#707881] mb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#006194]">calendar_today</span>
              Pick-up Date
            </label>
            <input
              type="date"
              value={dates.pickup}
              onChange={(e) => setDates({ ...dates, pickup: e.target.value })}
              className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/50 text-sm font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#707881] mb-1.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#006194]">event_repeat</span>
              Return Date
            </label>
            <input
              type="date"
              value={dates.returnDate}
              onChange={(e) => setDates({ ...dates, returnDate: e.target.value })}
              className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/50 text-sm font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full h-11 bg-[#006194] hover:bg-[#007bb9] text-white font-semibold rounded-lg shadow flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
              <span>Find Available Cars</span>
            </button>
          </div>
        </form>
      </section>

      {/* Featured Fleet Catalog Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-mono font-bold text-[#006194] uppercase tracking-wider">Premium Selection</span>
            <h2 className="text-3xl font-extrabold text-[#131a33] mt-1">Available Fleet Models</h2>
            <p className="text-sm text-[#3f4850] mt-1">Live data queried from Spring Boot MongoDB backend</p>
          </div>
          <Link
            to="/fleet"
            className="inline-flex items-center gap-1 text-[#006194] hover:text-[#007bb9] font-bold text-sm mt-4 md:mt-0"
          >
            <span>View all inventory</span>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(n => (
              <div key={n} className="h-96 rounded-2xl bg-white animate-pulse border border-[#ebedff] p-4"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.slice(0, 6).map((car) => (
              <div
                key={car.id || car.name}
                className="group bg-white rounded-2xl border border-[#ebedff] hover:border-[#006194]/40 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Image stage */}
                <div className="relative aspect-[16/10] bg-[#f8fafc] overflow-hidden">
                  <img
                    src={car.image || '/assets/cars/sedan.jpg'}
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-[#131a33] shadow-sm">
                    {car.company}
                  </div>
                  <div className="absolute top-3 right-3 bg-[#006947]/10 text-[#006947] border border-[#006947]/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    ★ {car.rating || 4.9}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[#131a33] group-hover:text-[#006194] transition-colors">
                      {car.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-3 text-xs text-[#707881] font-medium border-y border-[#ebedff] py-2.5">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">airline_seat_recline_normal</span>
                        {car.seats || 5} Seats
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">category</span>
                        {car.type || 'Sedan'}
                      </span>
                      <span className="flex items-center gap-1 text-[#006947]">
                        <span className="material-symbols-outlined text-[16px]">key</span>
                        Keyless
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-2">
                    <div>
                      <span className="text-xs text-[#707881] block">Daily Rate</span>
                      <span className="text-2xl font-black text-[#006194]">
                        ${car.price}
                        <span className="text-xs font-normal text-[#3f4850]"> /day</span>
                      </span>
                    </div>

                    <Link
                      to={`/book/${car.id || encodeURIComponent(car.name)}`}
                      className="px-4 py-2.5 bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-bold rounded-lg shadow transition-all transform group-hover:scale-105"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Feature Value Props */}
      <section className="bg-[#ebedff] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono font-bold text-[#006194] uppercase tracking-wider">Why DriveEase</span>
            <h2 className="text-3xl font-extrabold text-[#131a33] mt-1">Built for Seamless Mobility</h2>
            <p className="text-sm text-[#3f4850] mt-2">Engineered from ground up with automated pricing, keyless access, and instant database validation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#ebedff]">
              <div className="w-12 h-12 rounded-xl bg-[#cce5ff] text-[#006194] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">speed</span>
              </div>
              <h3 className="text-lg font-bold text-[#131a33] mb-2">Automated Rate Calculation</h3>
              <p className="text-sm text-[#3f4850] leading-relaxed">
                Dynamic duration tracking with automated deposit, taxes, and duration multiplier computed on the fly.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#ebedff]">
              <div className="w-12 h-12 rounded-xl bg-[#6ffbbe]/20 text-[#006947] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">phonelink_lock</span>
              </div>
              <h3 className="text-lg font-bold text-[#131a33] mb-2">Instant Digital Key</h3>
              <p className="text-sm text-[#3f4850] leading-relaxed">
                Unlock your rented vehicle directly from your smartphone browser upon booking confirmation.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#ebedff]">
              <div className="w-12 h-12 rounded-xl bg-[#d0d9fd] text-[#545d7c] flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-[28px]">history_edu</span>
              </div>
              <h3 className="text-lg font-bold text-[#131a33] mb-2">Full Telemetry & History</h3>
              <p className="text-sm text-[#3f4850] leading-relaxed">
                Review complete invoices, rental periods, and car revenue analytics stored safely in MongoDB.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
