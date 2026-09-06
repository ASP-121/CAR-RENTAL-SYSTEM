import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState({
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (415) 890-2341',
    licenseNumber: 'CA-9482104-D',
    verified: true,
    membershipTier: 'Platinum Keyless Access',
    tripsCompleted: 14,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-[#ebedff] shadow-xl overflow-hidden">
        {/* Profile Header banner */}
        <div className="bg-gradient-to-r from-[#1c2541] to-[#282f49] p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#006194] to-[#007bb9] flex items-center justify-center text-3xl font-extrabold text-white shadow-lg border-2 border-white/20">
              AM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#006947]/20 border border-[#006947] text-[#4edea3] text-[10px] font-mono uppercase font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Verified Driver
                </span>
              </div>
              <p className="text-xs text-[#bdc5e9] mt-1">{user.membershipTier}</p>
            </div>
          </div>

          <div className="flex gap-4 text-center">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <div className="text-xl font-bold text-white">{user.tripsCompleted}</div>
              <div className="text-[10px] text-[#bdc5e9] uppercase">Trips Taken</div>
            </div>
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <div className="text-xl font-bold text-[#4edea3]">5.0 ★</div>
              <div className="text-[10px] text-[#bdc5e9] uppercase">Driver Score</div>
            </div>
          </div>
        </div>

        {/* Verification & Details Form */}
        <form onSubmit={handleSave} className="p-8 space-y-6">
          <h2 className="text-base font-bold text-[#131a33] pb-2 border-b border-[#ebedff]">
            Driver Credentials & Identity Verification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Full Name</label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-sm font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Email Address</label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-sm font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Phone Number</label>
              <input
                type="text"
                value={user.phone}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-sm font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Driver's License #</label>
              <input
                type="text"
                value={user.licenseNumber}
                onChange={(e) => setUser({ ...user, licenseNumber: e.target.value })}
                className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-sm font-mono focus:ring-2 focus:ring-[#006194] focus:outline-none"
              />
            </div>
          </div>

          {/* Keyless Bluetooth Smart Phone Setup */}
          <div className="p-4 rounded-2xl bg-[#ebedff]/50 border border-[#ebedff] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#006194] text-[28px]">phone_android</span>
              <div>
                <div className="text-sm font-bold text-[#131a33]">Smartphone Keyless Pairing</div>
                <div className="text-xs text-[#3f4850]">Device paired: iPhone 15 Pro (Ultra-Wideband Active)</div>
              </div>
            </div>
            <span className="text-xs font-bold text-[#006947] bg-[#006947]/10 px-3 py-1 rounded-full border border-[#006947]/30">
              CONNECTED
            </span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#ebedff]">
            {saved && (
              <span className="text-xs font-bold text-[#006947] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check</span>
                Profile updated successfully!
              </span>
            )}
            {!saved && <span></span>}

            <button
              type="submit"
              className="px-6 py-3 bg-[#006194] hover:bg-[#007bb9] text-white font-bold text-xs rounded-xl shadow transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
