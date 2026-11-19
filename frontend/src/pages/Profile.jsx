import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, getUserProfile, updateUserProfile } from '../services/api';

export default function Profile() {
  const [user, setUser] = useState(getCurrentUser() || {});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getUserProfile().then(data => {
      if (data) setUser(data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateUserProfile(user);
      if (updated) setUser(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-[#ebedff] shadow-xl overflow-hidden">
        {/* Profile Header banner */}
        <div className="bg-gradient-to-r from-[#1c2541] to-[#282f49] p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#006194] to-[#007bb9] flex items-center justify-center text-3xl font-extrabold text-white shadow-lg border-2 border-white/20">
              {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'DR'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#006947]/20 border border-[#006947] text-[#4edea3] text-[10px] font-mono uppercase font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Verified Driver
                </span>
              </div>
              <p className="text-xs text-[#bdc5e9] mt-1">{user.membershipTier || 'Platinum Keyless Access'}</p>
            </div>
          </div>

          <div className="flex gap-4 text-center">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <div className="text-xl font-bold text-white">{user.tripsCompleted || 0}</div>
              <div className="text-[10px] text-[#bdc5e9] uppercase">Trips Taken</div>
            </div>
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
              <div className="text-xl font-bold text-[#4edea3]">{user.rating || 5.0} ★</div>
              <div className="text-[10px] text-[#bdc5e9] uppercase">Driver Score</div>
            </div>
          </div>
        </div>

        {/* Verification & Details Form */}
        <form onSubmit={handleSave} className="p-8 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#ebedff]">
            <h2 className="text-base font-bold text-[#131a33]">
              Driver Credentials & Identity Verification
            </h2>
            {saved && (
              <span className="text-xs font-semibold text-[#006947] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Saved to MongoDB
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Full Name</label>
              <input
                type="text"
                value={user.name || ''}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-sm font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Email Address</label>
              <input
                type="email"
                disabled
                value={user.email || ''}
                className="w-full h-11 px-3.5 rounded-lg bg-[#ebedff] border border-[#bfc7d2]/60 text-sm font-medium text-[#707881] cursor-not-allowed focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Phone Number</label>
              <input
                type="text"
                value={user.phone || ''}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-sm font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Driver's License #</label>
              <input
                type="text"
                value={user.licenseNumber || ''}
                onChange={(e) => setUser({ ...user, licenseNumber: e.target.value })}
                className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-sm font-mono focus:ring-2 focus:ring-[#006194] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <Link to="/my-bookings" className="text-xs text-[#006194] hover:underline font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">history</span>
              View My Booking History
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-[#006194] hover:bg-[#007bb9] disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2"
            >
              {saving ? (
                <span>Saving to Server...</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Update Driver Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
