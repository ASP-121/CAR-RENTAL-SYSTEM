import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRedirectAdmin = searchParams.get('redirect') === 'admin';

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [password, setPassword] = useState('password123');
  const [phone, setPhone] = useState('+1 (415) 890-2341');
  const [licenseNumber, setLicenseNumber] = useState('CA-9482104-D');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(isRedirectAdmin ? 'Admin authorization required. Please sign in with an Administrator account.' : '');
  const [success, setSuccess] = useState('');

  // Quick fill demo credentials
  const selectDemoUser = (type) => {
    setError('');
    setSuccess('');
    setIsLogin(true);
    if (type === 'admin') {
      setEmail('admin@driveease.com');
      setPassword('admin123');
    } else {
      setEmail('alex.morgan@example.com');
      setPassword('password123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const res = await loginUser(email, password);
        if (res.success) {
          const user = res.user;
          const isAdmin = user?.role === 'ADMIN';
          setSuccess(`Signed in as ${user.name} (${isAdmin ? 'Administrator' : 'Customer'})!`);

          setTimeout(() => {
            if (isAdmin) {
              navigate('/admin');
            } else {
              navigate(isRedirectAdmin ? '/fleet' : '/fleet');
            }
          }, 600);
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
          const isAdmin = res.user?.role === 'ADMIN';
          setSuccess(`Account created for ${res.user.name}!`);
          setTimeout(() => {
            navigate(isAdmin ? '/admin' : '/fleet');
          }, 600);
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
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
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
            Role-Based Access: Admin Dashboard or Driver Reservations
          </p>
        </div>

        {/* Quick Demo Switcher */}
        <div className="p-3 bg-[#f3f3ff] rounded-2xl border border-[#ebedff] space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-[#707881] uppercase tracking-wider">
            <span>Quick Demo Accounts:</span>
            <span className="material-symbols-outlined text-[16px] text-[#006194]">bolt</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => selectDemoUser('admin')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                email === 'admin@driveease.com'
                  ? 'bg-[#ba1a1a] text-white border-[#ba1a1a] shadow-sm'
                  : 'bg-white text-[#ba1a1a] border-red-200 hover:bg-red-50'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              <span>Admin Demo</span>
            </button>

            <button
              type="button"
              onClick={() => selectDemoUser('customer')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                email === 'alex.morgan@example.com'
                  ? 'bg-[#006194] text-white border-[#006194] shadow-sm'
                  : 'bg-white text-[#006194] border-[#ebedff] hover:bg-[#ebedff]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">person</span>
              <span>Customer Demo</span>
            </button>
          </div>
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
                placeholder="e.g. Alex Morgan or Admin Name"
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
            {email.toLowerCase().includes('admin') && (
              <span className="text-[10px] text-[#ba1a1a] font-bold mt-1 block flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">shield</span>
                Administrator Privilege Login Detected
              </span>
            )}
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
                <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">License #</label>
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
              email.toLowerCase().includes('admin')
                ? 'bg-[#ba1a1a] hover:bg-red-700'
                : 'bg-[#006194] hover:bg-[#007bb9]'
            }`}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>
                  {isLogin
                    ? email.toLowerCase().includes('admin')
                      ? 'Sign In as Administrator'
                      : 'Sign In as Driver'
                    : 'Complete Registration'}
                </span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#ebedff] text-center text-xs text-[#707881]">
          <span>Role-Based Access Control • Spring Boot & MongoDB</span>
        </div>
      </div>
    </div>
  );
}
