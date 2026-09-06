import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCars } from '../services/api';

export default function Fleet() {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSeats, setSelectedSeats] = useState('All');
  const [maxPrice, setMaxPrice] = useState(300);
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    getCars().then(data => {
      setCars(data);
      setLoading(false);
    });
  }, []);

  const types = ['All', 'Electric', 'Sedan', 'SUV', 'Convertible', 'Hatchback'];
  const seatOptions = ['All', '4', '5', '7'];

  const filteredCars = cars
    .filter(car => {
      const matchSearch =
        car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = selectedType === 'All' || car.type?.toLowerCase() === selectedType.toLowerCase();
      const matchSeats = selectedSeats === 'All' || car.seats === parseInt(selectedSeats);
      const matchPrice = car.price <= maxPrice;
      return matchSearch && matchType && matchSeats && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ebedff]">
        <div>
          <h1 className="text-3xl font-extrabold text-[#131a33]">Browse Fleet & Vehicles</h1>
          <p className="text-sm text-[#3f4850] mt-1">
            Choose from our premium fleet of smart, electric, and luxury vehicles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-[#707881] uppercase tracking-wider">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-3 rounded-lg bg-white border border-[#bfc7d2] text-xs font-semibold text-[#131a33] focus:ring-2 focus:ring-[#006194] focus:outline-none"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#ebedff] shadow-sm space-y-6 sticky top-28">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#131a33] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#006194]">tune</span>
                Filter Fleet
              </h2>
              <button
                onClick={() => {
                  setSelectedType('All');
                  setSelectedSeats('All');
                  setMaxPrice(300);
                  setSearchTerm('');
                }}
                className="text-xs text-[#006194] hover:underline font-semibold"
              >
                Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-[#707881] mb-2 uppercase">Search Vehicle</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#707881] text-[18px]">search</span>
                <input
                  type="text"
                  placeholder="e.g. Tesla, BMW, Sedan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/50 text-xs font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                />
              </div>
            </div>

            {/* Vehicle Category Chips */}
            <div>
              <label className="block text-xs font-bold text-[#707881] mb-2 uppercase">Vehicle Type</label>
              <div className="flex flex-wrap gap-1.5">
                {types.map(t => (
                  <button
                    key={t}
                    onClick={() => setSelectedType(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      selectedType === t
                        ? 'bg-[#006194] text-white'
                        : 'bg-[#ebedff] text-[#131a33] hover:bg-[#d0d9fd]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Seating Capacity */}
            <div>
              <label className="block text-xs font-bold text-[#707881] mb-2 uppercase">Seats</label>
              <div className="grid grid-cols-4 gap-2">
                {seatOptions.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSeats(s)}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-colors ${
                      selectedSeats === s
                        ? 'bg-[#006194] text-white border-[#006194]'
                        : 'bg-[#faf8ff] text-[#131a33] border-[#bfc7d2]/60 hover:bg-[#ebedff]'
                    }`}
                  >
                    {s === 'All' ? 'All' : `${s} seats`}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Range Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-[#707881] mb-2 uppercase">
                <span>Max Daily Rate</span>
                <span className="text-sm font-extrabold text-[#006194]">${maxPrice} / day</span>
              </div>
              <input
                type="range"
                min="50"
                max="350"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-[#006194]"
              />
              <div className="flex justify-between text-[11px] text-[#707881] mt-1">
                <span>$50</span>
                <span>$350</span>
              </div>
            </div>

            {/* Quick Promo Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#ebedff] to-[#f3f3ff] border border-[#d0d9fd] text-xs space-y-1">
              <div className="font-bold text-[#006194] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                Instant Digital Key
              </div>
              <p className="text-[#3f4850] text-[11px]">
                Unlock via smartphone directly after checkout. No physical key required.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Vehicle Grid */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-80 bg-white rounded-2xl animate-pulse border border-[#ebedff]"></div>
              ))}
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-[#ebedff] text-center space-y-4">
              <span className="material-symbols-outlined text-[48px] text-[#707881]">no_crash</span>
              <h3 className="text-lg font-bold text-[#131a33]">No vehicles match your criteria</h3>
              <p className="text-sm text-[#3f4850]">Try adjusting your search terms, price slider, or filters.</p>
              <button
                onClick={() => {
                  setSelectedType('All');
                  setSelectedSeats('All');
                  setMaxPrice(300);
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-[#006194] text-white text-xs font-bold rounded-lg shadow"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCars.map((car) => (
                <div
                  key={car.id || car.name}
                  className="bg-white rounded-2xl border border-[#ebedff] hover:border-[#006194]/40 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
                >
                  {/* Image header */}
                  <div className="relative aspect-[16/10] bg-[#f8fafc] overflow-hidden">
                    <img
                      src={car.image || '/assets/cars/sedan.jpg'}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80";
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-[#131a33] shadow-sm">
                      {car.company}
                    </div>
                    <div className="absolute top-3 right-3 bg-[#006947]/10 text-[#006947] border border-[#006947]/30 px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm">
                      ★ {car.rating || 4.9}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-bold text-[#131a33] group-hover:text-[#006194] transition-colors">
                          {car.name}
                        </h3>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-3 gap-2 my-4 text-xs font-medium text-[#707881] bg-[#f3f3ff] p-2.5 rounded-xl border border-[#ebedff]">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-[#006194]">airline_seat_recline_normal</span>
                          <span>{car.seats || 5} Seats</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-[#006194]">local_gas_station</span>
                          <span>{car.type}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-[#006947]">sensors</span>
                          <span>Keyless</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#ebedff] flex items-center justify-between">
                      <div>
                        <span className="text-[11px] text-[#707881] block">Daily Rate</span>
                        <span className="text-2xl font-black text-[#006194]">
                          ${car.price}
                          <span className="text-xs font-normal text-[#3f4850]"> /day</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/cars/${car.id || encodeURIComponent(car.name)}`}
                          className="px-3 py-2 bg-[#f3f3ff] hover:bg-[#ebedff] text-[#131a33] text-xs font-bold rounded-lg transition-colors"
                        >
                          Specs
                        </Link>
                        <Link
                          to={`/book/${car.id || encodeURIComponent(car.name)}`}
                          className="px-4 py-2 bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-bold rounded-lg shadow transition-all"
                        >
                          Reserve
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
