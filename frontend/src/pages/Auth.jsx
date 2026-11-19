import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loginUser, registerUser } from '../services/api';

const ROOT_ADMIN_EMAIL = 'akash2006@gmail.com';
const ROOT_ADMIN_PASSWORD = 'akzz4712';

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isRedirectAdmin = searchParams.get('redirect') === 'admin';

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    isRedirectAdmin
      ? `Access restricted: Administrator privileges required. Please sign in with ${ROOT_ADMIN_EMAIL}.`
      : ''
  );
  const [success, setSuccess] = useState('');

  const isAdminEmail = email.trim().toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase();

  const handleFillAdmin = () => {
    setIsLogin(true);
    setEmail(ROOT_ADMIN_EMAIL);
    setPassword(ROOT_ADMIN_PASSWORD);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const res = await loginUser(email.trim(), password);
        if (res.success && res.user) {
          const user = res.user;
          const isAdmin = user.role === 'ADMIN';
          setSuccess(
            isAdmin
              ? `Root Administrator Verified. Welcome back, ${user.name}!`
              : `Welcome back, ${user.name}!`
          );

          setTimeout(() => {
            if (isAdmin) {
              navigate('/admin');
            } else {
              navigate('/fleet');
            }
          }, 600);
        } else {
          setError(res.message || 'Login failed. Please verify your email and password.');
        }
      } else {
        // Prevent registration with admin email
        if (email.trim().toLowerCase() === ROOT_ADMIN_EMAIL.toLowerCase()) {
          setError(`The email ${ROOT_ADMIN_EMAIL} is reserved for system administration. Please switch to Sign In.`);
          setLoading(false);
          return;
        }

        const res = await registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
          phone: phone.trim(),
          licenseNumber: licenseNumber.trim(),
          role: 'CUSTOMER',
        });

        if (res.success && res.user) {
          setSuccess(`Driver account registered successfully for ${res.user.name}!`);

          setTimeout(() => {
            navigate('/fleet');
          }, 600);
        } else {
          setError(res.message || 'Registration could not be completed. Please try again.');
        }
      }
    } catch (err) {
      setError('Connection failure: Unable to reach authentication server.');
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
            {isLogin ? 'Sign In to Your Account' : 'Create a Driver Account'}
          </h1>
          <p className="text-xs text-[#3f4850]">
            {isLogin
              ? 'Access vehicle rentals, hosting portal, or administrative controls.'
              : 'Register to rent, host, or trade pre-owned vehicles on DriveEase.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#f3f3ff] p-1 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              isLogin ? 'bg-white text-[#006194] shadow' : 'text-[#707881]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              !isLogin ? 'bg-white text-[#006194] shadow' : 'text-[#707881]'
            }`}
          >
            Register
          </button>
        </div>


        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] shrink-0">check_circle</span>
            <span>{success}</span>
          </div>
        )}

        {/* Live Admin Detected Notification */}
        {isLogin && isAdminEmail && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs font-bold flex items-center gap-2 shadow-xs">
            <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">verified_user</span>
            <div>
              <span>System Administrator Identified (Akash)</span>
              <span className="block text-[10px] font-normal text-red-600">
                Grants full access to fleet operations, all car histories, and executive telemetry.
              </span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-[#707881] mb-1 uppercase">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
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
              placeholder="name@example.com"
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
              placeholder="Enter your password"
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
                  placeholder="+91 98765 00000"
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
                  placeholder="e.g. DL-142024001928"
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
              isLogin && isAdminEmail
                ? 'bg-[#ba1a1a] hover:bg-red-700 shadow-red-500/20'
                : 'bg-[#006194] hover:bg-[#007bb9]'
            }`}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">
                  {isLogin && isAdminEmail ? 'admin_panel_settings' : 'login'}
                </span>
                <span>
                  {isLogin
                    ? isAdminEmail
                      ? 'Sign In as System Administrator (Akash)'
                      : 'Sign In to DriveEase'
                    : 'Complete Driver Registration'}
                </span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#ebedff] text-center text-[11px] text-[#707881]">
          <span>Role-Based Access Control • Spring Security 6 & MongoDB</span>
        </div>
      </div>
    </div>
  );
}
