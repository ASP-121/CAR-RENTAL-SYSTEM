import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [password, setPassword] = useState('password123');
  const [phone, setPhone] = useState('+1 (415) 890-2341');
  const [licenseNumber, setLicenseNumber] = useState('CA-9482104-D');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const res = await loginUser(email, password);
        if (res.success) {
          setSuccess('Signed in successfully! Redirecting to fleet...');
          setTimeout(() => navigate('/fleet'), 800);
        } else {
          setError(res.message || 'Login failed. Please check your credentials.');
        }
      } else {
        const res = await registerUser({
          name: name || 'Driver',
          email,
          password,
          phone,
          licenseNumber,
        });
        if (res.success) {
          setSuccess('Account created! Redirecting to fleet...');
          setTimeout(() => navigate('/fleet'), 800);
        } else {
          setError(res.message || 'Registration failed. Try again.');
        }
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-[#ebedff] shadow-xl p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#006194] flex items-center justify-center text-white mx-auto shadow-md">
            <span className="material-symbols-outlined text-[26px]">directions_car</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#131a33]">
            {isLogin ? 'Sign In to DriveEase' : 'Create an Account'}
          </h1>
          <p className="text-xs text-[#3f4850]">
            Access instant vehicle reservations, telemetry, and digital keys.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#f3f3ff] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              isLogin ? 'bg-white text-[#006194] shadow' : 'text-[#707881]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              !isLogin ? 'bg-white text-[#006194] shadow' : 'text-[#707881]'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-3.5 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
            />
          </div>

          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Phone</label>
                <input
                  type="text"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Driver License #</label>
                <input
                  type="text"
                  required
                  placeholder="CA-9482104"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-[#f3f3ff] border border-[#bfc7d2]/60 text-xs font-medium focus:ring-2 focus:ring-[#006194] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-[#3f4850] cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#006194]" />
              <span>Remember me</span>
            </label>
            <span className="text-[#006194] hover:underline cursor-pointer font-medium">Forgot password?</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#006194] hover:bg-[#007bb9] disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>{isLogin ? 'Sign In & Access Fleet' : 'Complete Registration'}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#ebedff] text-center text-xs text-[#707881]">
          <span>Protected by Spring Boot Security & MongoDB Cloud</span>
        </div>
      </div>
    </div>
  );
}
