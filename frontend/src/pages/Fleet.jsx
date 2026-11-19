import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCars } from '../services/api';

export default function Fleet() {
  const [searchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All');
  const [selectedSeats, setSelectedSeats] = useState('All');
  const [maxPrice, setMaxPrice] = useState(25000);
  const [sortBy, setSortBy] = useState('recommended');

  const loadFleet = () => {
    setLoading(true);
    const params = {
      type: selectedType !== 'All' ? selectedType : undefined,
      seats: selectedSeats !== 'All' ? parseInt(selectedSeats) : undefined,
      maxPrice: maxPrice < 25000 ? maxPrice : undefined,
      search: searchTerm.trim() ? searchTerm.trim() : undefined,
      sortBy: sortBy !== 'recommended' ? sortBy : undefined,
    };

    getCars(params).then(data => {
      setCars(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadFleet();
  }, [selectedType, selectedSeats, maxPrice, sortBy]);

  // Handle search submit or debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadFleet();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const types = ['All', 'Electric', 'Sedan', 'SUV', 'Convertible', 'Hatchback'];
  const seatOptions = ['All', '4', '5', '7'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#ebedff]">
        <div>
          <h1 className="text-3xl font-extrabold text-[#131a33]">Browse Fleet & Vehicles</h1>
          <p className="text-sm text-[#3f4850] mt-1">
            Choose from our premium fleet of smart, electric, and luxury vehicles (Server-side filtered).
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
                  setSortBy('recommended');
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
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                />
              </div>
            </div>

            {/* Vehicle Category Chips */}
            <div>
              <label className="block text-xs font-bold text-[#707881] mb-2 uppercase">Category</label>
              <div className="flex flex-wrap gap-2">
                {types.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedType === type
                        ? 'bg-[#006194] text-white shadow-sm'
                        : 'bg-[#f3f3ff] text-[#3f4850] hover:bg-[#ebedff]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Seats */}
            <div>
              <label className="block text-xs font-bold text-[#707881] mb-2 uppercase">Seating Capacity</label>
              <div className="grid grid-cols-4 gap-2">
                {seatOptions.map(seats => (
                  <button
                    key={seats}
                    onClick={() => setSelectedSeats(seats)}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-all text-center ${
                      selectedSeats === seats
                        ? 'bg-[#006194] text-white shadow-sm'
                        : 'bg-[#f3f3ff] text-[#3f4850] hover:bg-[#ebedff]'
                    }`}
                  >
                    {seats === 'All' ? 'All' : `${seats} Seats`}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Daily Price Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#707881] uppercase">Max Daily Rate</label>
                <span className="text-xs font-mono font-bold text-[#006194]">₹{maxPrice.toLocaleString('en-IN')}/day</span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#bfc7d2]/50 rounded-lg appearance-none cursor-pointer accent-[#006194]"
              />
            </div>
          </div>
        </aside>

        {/* Right Car Catalog Grid */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-80 bg-white rounded-2xl animate-pulse border border-[#ebedff]"></div>
              ))}
            </div>
          ) : cars.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#ebedff] p-12 text-center space-y-4 shadow-sm">
              <span className="material-symbols-outlined text-[48px] text-[#707881]">search_off</span>
              <h3 className="text-lg font-bold text-[#131a33]">No Vehicles Match Your Filter Criteria</h3>
              <p className="text-xs text-[#3f4850] max-w-sm mx-auto">
                Try widening your price limit or clearing category filters to view available fleet.
              </p>
              <button
                onClick={() => {
                  setSelectedType('All');
                  setSelectedSeats('All');
                  setMaxPrice(25000);
                  setSearchTerm('');
                }}
                className="px-4 py-2 bg-[#006194] text-white text-xs font-bold rounded-lg shadow"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cars.map((car) => (
                <div
                  key={car.id || car.name}
                  className="bg-white rounded-2xl border border-[#ebedff] hover:border-[#006194]/40 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
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
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold text-[#006194] shadow-sm">
                        {car.type}
                      </div>
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-mono flex items-center gap-1">
                        <span>★</span>
                        <span>{car.rating || 4.9}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#006194] uppercase tracking-wider">
                          {car.company}
                        </span>
                        <h3 className="text-lg font-bold text-[#131a33] group-hover:text-[#006194] transition-colors">
                          {car.name}
                        </h3>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#ebedff] text-[11px] text-[#707881]">
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-[#006194]">airline_seat_recline_normal</span>
                          <span>{car.seats} Seats</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-[#006194]">ev_station</span>
                          <span>{car.fuelType || 'Gasoline'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[15px] text-[#006194]">speed</span>
                          <span>{car.range || '450 mi'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="p-5 pt-0 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#707881] block">Daily Rate</span>
                      <div className="text-xl font-extrabold text-[#006194]">
                        ₹{car.price?.toLocaleString('en-IN')}
                        <span className="text-xs text-[#707881] font-normal"> / day</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/cars/${encodeURIComponent(car.id || car.name)}`}
                        className="px-3 py-2 bg-[#f3f3ff] hover:bg-[#ebedff] text-[#131a33] text-xs font-bold rounded-lg transition-colors"
                      >
                        Details
                      </Link>
                      <Link
                        to={`/book/${encodeURIComponent(car.id || car.name)}`}
                        className="px-4 py-2 bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-bold rounded-lg shadow transition-all"
                      >
                        Reserve
                      </Link>
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
