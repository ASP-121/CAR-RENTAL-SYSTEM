import React, { useState, useEffect } from 'react';
import {
  getSaleListings,
  createSaleListing,
  deleteSaleListing,
  getMySaleListings,
  submitPurchaseInquiry,
  getMyPurchaseInquiries,
  updateInquiryStatus,
  getCurrentUser,
  getCarImage
} from '../services/api';

export default function BuySellMarketplace() {
  const [listings, setListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [myInquiries, setMyInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'sell', 'manage'

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [maxBudget, setMaxBudget] = useState(5000000); // 50 Lakhs

  // Inquiry Modal
  const [selectedCarForInquiry, setSelectedCarForInquiry] = useState(null);
  const [inquiryType, setInquiryType] = useState('SCHEDULE_TEST_DRIVE');
  const [offeredPrice, setOfferedPrice] = useState(0);
  const [buyerPhone, setBuyerPhone] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Sell Form
  const currentUser = getCurrentUser() || {};
  const [sellForm, setSellForm] = useState({
    carName: '',
    company: '',
    year: 2022,
    kmDriven: 25000,
    sellingPrice: 1200000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    ownerType: '1st Owner',
    city: 'Mumbai',
    sellerPhone: '+91 98765 43210',
    imageUrl: '',
    description: '',
  });
  const [sellSubmitting, setSellSubmitting] = useState(false);

  const loadMarketplace = async () => {
    setLoading(true);
    try {
      const [allCars, userCars, inquiries] = await Promise.all([
        getSaleListings({
          search: searchTerm.trim() ? searchTerm.trim() : undefined,
          city: selectedCity !== 'All' ? selectedCity : undefined,
          maxPrice: maxBudget < 5000000 ? maxBudget : undefined,
        }),
        getMySaleListings(),
        getMyPurchaseInquiries(),
      ]);
      setListings(allCars || []);
      setMyListings(userCars || []);
      setMyInquiries(inquiries || []);
    } catch (err) {
      console.error('Failed to load marketplace data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMarketplace();
  }, [selectedCity, maxBudget]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadMarketplace();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSellSubmit = async (e) => {
    e.preventDefault();
    setSellSubmitting(true);
    setFeedbackMessage('');
    try {
      const payload = {
        ...sellForm,
        year: parseInt(sellForm.year),
        kmDriven: parseInt(sellForm.kmDriven),
        sellingPrice: parseFloat(sellForm.sellingPrice),
        sellerName: currentUser.name || 'Seller',
        sellerEmail: currentUser.email,
        imageUrl: sellForm.imageUrl.trim() ? sellForm.imageUrl.trim() : getCarImage(sellForm.company),
      };

      await createSaleListing(payload);
      setFeedbackMessage(`Your ${sellForm.carName} has been successfully listed in the verified marketplace!`);
      setActiveTab('browse');
      await loadMarketplace();
    } catch (err) {
      console.error(err);
      alert('Unable to list car for sale. Please try again.');
    } finally {
      setSellSubmitting(false);
    }
  };

  const handleOpenInquiry = (car) => {
    setSelectedCarForInquiry(car);
    setOfferedPrice(car.sellingPrice);
    setBuyerPhone(currentUser.phone || '+91 ');
    setInquiryMessage('I am interested in this vehicle and would like to arrange an inspection/test drive.');
  };

  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    setInquirySubmitting(true);
    try {
      await submitPurchaseInquiry({
        listingId: selectedCarForInquiry.id,
        carName: selectedCarForInquiry.carName,
        sellerEmail: selectedCarForInquiry.sellerEmail,
        buyerName: currentUser.name || 'Interested Buyer',
        buyerPhone,
        offeredPrice: parseFloat(offeredPrice),
        inquiryType,
        message: inquiryMessage,
      });

      setSelectedCarForInquiry(null);
      setFeedbackMessage(`Inquiry sent to seller for ${selectedCarForInquiry.carName}. They will contact you shortly!`);
      await loadMarketplace();
    } catch (err) {
      console.error(err);
      alert('Failed to submit purchase inquiry.');
    } finally {
      setInquirySubmitting(false);
    }
  };

  const handleDeleteListing = async (carId) => {
    if (!window.confirm('Are you sure you want to remove this car listing from the marketplace?')) return;
    try {
      await deleteSaleListing(carId);
      await loadMarketplace();
    } catch (err) {
      alert('Failed to remove listing');
    }
  };

  const handleUpdateInquiry = async (inquiryId, status) => {
    try {
      await updateInquiryStatus(inquiryId, status);
      await loadMarketplace();
    } catch (err) {
      alert('Failed to update inquiry status');
    }
  };

  const cities = ['All', 'Mumbai', 'Delhi', 'Bengaluru', 'Pune', 'Hyderabad', 'Chennai'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1c2541] via-[#282f49] to-[#006194] rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden mb-8">
        <div className="relative z-10 max-w-xl">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[11px] font-mono font-bold rounded-full uppercase tracking-wider">
            DriveEase Pre-Owned Certified
          </span>
          <h1 className="text-3xl font-extrabold mt-2 leading-tight">Buy & Sell Verified Cars</h1>
          <p className="text-xs text-[#bdc5e9] mt-2">
            Buy certified pre-owned vehicles with complete service history or sell your personal car directly to verified drivers with zero commission.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <button
            onClick={() => setActiveTab('sell')}
            className="px-5 py-3 bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Sell Your Car</span>
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            <span>{feedbackMessage}</span>
          </div>
          <button onClick={() => setFeedbackMessage('')} className="text-emerald-600 hover:text-emerald-900">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-3 mb-8 border-b border-[#ebedff] pb-3">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'browse'
              ? 'bg-[#006194] text-white shadow-md'
              : 'text-[#707881] hover:text-[#131a33]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">storefront</span>
          <span>Browse Cars for Sale ({listings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sell')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'sell'
              ? 'bg-[#006194] text-white shadow-md'
              : 'text-[#707881] hover:text-[#131a33]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">sell</span>
          <span>List Car for Sale</span>
        </button>

        <button
          onClick={() => setActiveTab('manage')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
            activeTab === 'manage'
              ? 'bg-[#006194] text-white shadow-md'
              : 'text-[#707881] hover:text-[#131a33]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
          <span>My Listings & Inquiries ({myListings.length + myInquiries.length})</span>
        </button>
      </div>

      {/* TAB 1: BROWSE CARS FOR SALE */}
      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Filters */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-[#ebedff] p-5 shadow-sm space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1.5 uppercase">Search Vehicle</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#707881] text-[18px]">search</span>
                  <input
                    type="text"
                    placeholder="City, Honda, Tata, BMW..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/50 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#006194]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#707881] mb-2 uppercase">City Location</label>
                <div className="flex flex-wrap gap-1.5">
                  {cities.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedCity(c)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        selectedCity === c
                          ? 'bg-[#006194] text-white shadow'
                          : 'bg-[#f3f3ff] text-[#3f4850] hover:bg-[#ebedff]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold text-[#707881] uppercase">Max Budget</label>
                  <span className="text-xs font-mono font-bold text-[#006194]">
                    ₹{(maxBudget / 100000).toFixed(1)} Lakhs
                  </span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="5000000"
                  step="100000"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[#bfc7d2]/50 rounded-lg appearance-none cursor-pointer accent-[#006194]"
                />
              </div>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCity('All');
                  setMaxBudget(5000000);
                }}
                className="w-full py-2 bg-[#f3f3ff] hover:bg-[#ebedff] text-[#006194] text-xs font-bold rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Right Listings Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="py-20 text-center text-[#707881]">
                <span className="material-symbols-outlined animate-spin text-3xl text-[#006194]">progress_activity</span>
                <p className="mt-2 text-sm">Searching verified car listings...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#ebedff] p-12 text-center space-y-3">
                <span className="material-symbols-outlined text-4xl text-[#bfc7d2]">directions_car</span>
                <h3 className="text-base font-bold text-[#131a33]">No vehicles found matching criteria</h3>
                <p className="text-xs text-[#707881] max-w-sm mx-auto">
                  Try adjusting your budget limit or selected city to view available verified cars.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listings.map((car) => (
                  <div
                    key={car.id}
                    className="bg-white rounded-2xl border border-[#ebedff] hover:border-[#006194]/40 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative aspect-[16/10] bg-[#f8fafc] overflow-hidden">
                        <img
                          src={car.imageUrl || getCarImage(car.company)}
                          alt={car.carName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80";
                          }}
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold text-[#006194] shadow-sm">
                          {car.city}
                        </div>
                        <div className="absolute top-3 right-3 bg-emerald-600/90 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                          {car.ownerType || '1st Owner'}
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-[#006194] uppercase tracking-wider">
                            {car.company} • {car.year} Model
                          </span>
                          <h3 className="text-base font-bold text-[#131a33] group-hover:text-[#006194] transition-colors">
                            {car.carName}
                          </h3>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#ebedff] text-[11px] text-[#707881]">
                          <div>{car.kmDriven?.toLocaleString('en-IN')} km</div>
                          <div>{car.fuelType || 'Petrol'}</div>
                          <div>{car.transmission || 'Automatic'}</div>
                        </div>

                        {car.description && (
                          <p className="text-[11px] text-[#3f4850] line-clamp-2">{car.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-between border-t border-[#ebedff]/60 mt-2">
                      <div>
                        <span className="text-[10px] text-[#707881] block">Price</span>
                        <div className="text-xl font-black text-[#006194]">
                          ₹{(car.sellingPrice / 100000).toFixed(2)} Lakhs
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenInquiry(car)}
                        className="px-4 py-2.5 bg-[#006194] hover:bg-[#007bb9] text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined text-[16px]">chat</span>
                        <span>Contact / Buy</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      )}

      {/* TAB 2: SELL YOUR CAR FORM */}
      {activeTab === 'sell' && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#ebedff] p-6 sm:p-10 shadow-lg space-y-6">
          <div className="pb-4 border-b border-[#ebedff]">
            <h2 className="text-2xl font-extrabold text-[#131a33]">List Your Car for Sale</h2>
            <p className="text-xs text-[#707881] mt-1">
              Reach thousands of verified DriveEase renters and buyers. Direct seller connections with zero platform commission.
            </p>
          </div>

          <form onSubmit={handleSellSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Car Model & Trim</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Honda City ZX CVT"
                  value={sellForm.carName}
                  onChange={(e) => setSellForm({ ...sellForm, carName: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#006194]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Manufacturer</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Honda, Tata, Hyundai"
                  value={sellForm.company}
                  onChange={(e) => setSellForm({ ...sellForm, company: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#006194]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Year</label>
                <input
                  type="number"
                  min="2005"
                  max="2026"
                  required
                  value={sellForm.year}
                  onChange={(e) => setSellForm({ ...sellForm, year: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#006194]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">KM Driven</label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="e.g. 25000"
                  value={sellForm.kmDriven}
                  onChange={(e) => setSellForm({ ...sellForm, kmDriven: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#006194]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Selling Price (₹)</label>
                <input
                  type="number"
                  min="100000"
                  step="10000"
                  required
                  placeholder="e.g. 1150000"
                  value={sellForm.sellingPrice}
                  onChange={(e) => setSellForm({ ...sellForm, sellingPrice: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#006194]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Fuel Type</label>
                <select
                  value={sellForm.fuelType}
                  onChange={(e) => setSellForm({ ...sellForm, fuelType: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#006194]"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Transmission</label>
                <select
                  value={sellForm.transmission}
                  onChange={(e) => setSellForm({ ...sellForm, transmission: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#006194]"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Ownership</label>
                <select
                  value={sellForm.ownerType}
                  onChange={(e) => setSellForm({ ...sellForm, ownerType: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#006194]"
                >
                  <option value="1st Owner">1st Owner</option>
                  <option value="2nd Owner">2nd Owner</option>
                  <option value="3rd Owner">3rd Owner</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">City Location</label>
                <select
                  value={sellForm.city}
                  onChange={(e) => setSellForm({ ...sellForm, city: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#006194]"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Pune">Pune</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Contact Mobile</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={sellForm.sellerPhone}
                  onChange={(e) => setSellForm({ ...sellForm, sellerPhone: e.target.value })}
                  className="w-full h-11 px-3.5 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#006194]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Photo URL (Optional)</label>
              <input
                type="url"
                placeholder="https://... or leave empty to use standard brand template"
                value={sellForm.imageUrl}
                onChange={(e) => setSellForm({ ...sellForm, imageUrl: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#006194]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Vehicle Condition & Service Highlights</label>
              <textarea
                rows="3"
                placeholder="e.g. Single-owner driven, zero accident claims, serviced at authorized dealership..."
                value={sellForm.description}
                onChange={(e) => setSellForm({ ...sellForm, description: e.target.value })}
                className="w-full p-3 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#006194]"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={sellSubmitting}
              className="w-full py-3.5 bg-[#006194] hover:bg-[#007bb9] disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all"
            >
              {sellSubmitting ? 'Listing to Marketplace...' : 'List Car for Sale (Free)'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: MANAGE MY LISTINGS & INQUIRIES */}
      {activeTab === 'manage' && (
        <div className="space-y-10">
          {/* Section A: My Listed Cars */}
          <div className="bg-white rounded-3xl border border-[#ebedff] p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-[#131a33] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006194]">garage</span>
              <span>Cars You Listed for Sale ({myListings.length})</span>
            </h3>

            {myListings.length === 0 ? (
              <p className="text-xs text-[#707881]">You haven't listed any cars for sale yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myListings.map((car) => (
                  <div key={car.id} className="p-4 rounded-2xl border border-[#ebedff] flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm text-[#131a33]">{car.carName}</div>
                      <div className="text-xs text-[#707881]">
                        {car.year} • {car.city} • ₹{(car.sellingPrice / 100000).toFixed(2)} Lakhs
                      </div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                        {car.status}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteListing(car.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                      title="Remove Listing"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section B: Inquiries Received & Sent */}
          <div className="bg-white rounded-3xl border border-[#ebedff] p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-[#131a33] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006194]">mark_chat_unread</span>
              <span>Purchase & Test-Drive Inquiries ({myInquiries.length})</span>
            </h3>

            {myInquiries.length === 0 ? (
              <p className="text-xs text-[#707881]">No inquiries sent or received yet.</p>
            ) : (
              <div className="space-y-3">
                {myInquiries.map((inq) => {
                  const isSeller = inq.sellerEmail?.toLowerCase() === currentUser.email?.toLowerCase();
                  return (
                    <div key={inq.id} className="p-4 rounded-2xl border border-[#ebedff] bg-[#faf8ff] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#131a33]">{inq.carName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inq.inquiryType === 'SCHEDULE_TEST_DRIVE' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {inq.inquiryType === 'SCHEDULE_TEST_DRIVE' ? 'Test Drive Request' : 'Purchase Offer'}
                          </span>
                        </div>

                        <div className="text-xs text-[#3f4850] mt-1">
                          {isSeller ? (
                            <>Inquiry from buyer: <span className="font-bold">{inq.buyerName}</span> ({inq.buyerEmail}) • Phone: <span className="font-mono">{inq.buyerPhone}</span></>
                          ) : (
                            <>Your inquiry to seller: <span className="font-bold">{inq.sellerEmail}</span></>
                          )}
                        </div>

                        {inq.offeredPrice > 0 && (
                          <div className="text-xs font-bold text-[#006194] mt-0.5">
                            Offered Price: ₹{(inq.offeredPrice / 100000).toFixed(2)} Lakhs
                          </div>
                        )}

                        {inq.message && <p className="text-[11px] text-[#707881] mt-1">"{inq.message}"</p>}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          inq.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : inq.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {inq.status}
                        </span>

                        {isSeller && inq.status === 'PENDING' && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleUpdateInquiry(inq.id, 'ACCEPTED')}
                              className="px-2.5 py-1 bg-green-600 text-white text-[11px] font-bold rounded-lg hover:bg-green-700"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateInquiry(inq.id, 'REJECTED')}
                              className="px-2.5 py-1 bg-red-100 text-red-700 text-[11px] font-bold rounded-lg hover:bg-red-200"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* INQUIRY MODAL */}
      {selectedCarForInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-[#ebedff] max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#ebedff]">
              <div>
                <h3 className="text-lg font-bold text-[#131a33]">Connect with Seller</h3>
                <p className="text-xs text-[#707881]">{selectedCarForInquiry.carName} • ₹{(selectedCarForInquiry.sellingPrice / 100000).toFixed(2)} Lakhs</p>
              </div>
              <button
                onClick={() => setSelectedCarForInquiry(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#ebedff] text-[#707881]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitInquiry} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#707881] mb-1.5 uppercase">Inquiry Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInquiryType('SCHEDULE_TEST_DRIVE')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      inquiryType === 'SCHEDULE_TEST_DRIVE'
                        ? 'border-[#006194] bg-[#f3f3ff] text-[#006194]'
                        : 'border-[#ebedff] text-[#707881]'
                    }`}
                  >
                    Schedule Test Drive
                  </button>
                  <button
                    type="button"
                    onClick={() => setInquiryType('BUY_OFFER')}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      inquiryType === 'BUY_OFFER'
                        ? 'border-[#006194] bg-[#f3f3ff] text-[#006194]'
                        : 'border-[#ebedff] text-[#707881]'
                    }`}
                  >
                    Make Cash Offer
                  </button>
                </div>
              </div>

              {inquiryType === 'BUY_OFFER' && (
                <div>
                  <label className="block font-bold text-[#707881] mb-1 uppercase">Your Offer Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 font-semibold focus:outline-none focus:ring-2 focus:ring-[#006194]"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-[#707881] mb-1 uppercase">Your Contact Phone</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 font-semibold focus:outline-none focus:ring-2 focus:ring-[#006194]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#707881] mb-1 uppercase">Message to Seller</label>
                <textarea
                  rows="3"
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#f3f3ff] border border-[#bfc7d2]/60 font-medium focus:outline-none focus:ring-2 focus:ring-[#006194]"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCarForInquiry(null)}
                  className="px-4 py-2 rounded-xl border border-[#bfc7d2] font-bold text-[#707881]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inquirySubmitting}
                  className="px-5 py-2 bg-[#006194] hover:bg-[#007bb9] disabled:opacity-50 text-white font-bold rounded-xl shadow"
                >
                  {inquirySubmitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
