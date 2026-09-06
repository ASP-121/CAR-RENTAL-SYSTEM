import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Demo authentication: navigate straight to Fleet or Profile
    navigate('/fleet');
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
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              isLogin ? 'bg-white text-[#006194] shadow' : 'text-[#707881]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              !isLogin ? 'bg-white text-[#006194] shadow' : 'text-[#707881]'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-[#3f4850] cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-[#006194]" />
              <span>Remember me</span>
            </label>
            <span className="text-[#006194] hover:underline cursor-pointer font-medium">Forgot password?</span>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#006194] hover:bg-[#007bb9] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{isLogin ? 'Sign In & Access Fleet' : 'Complete Registration'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </form>

        <div className="pt-4 border-t border-[#ebedff] text-center text-xs text-[#707881]">
          <span>Protected by Spring Boot Security & MongoDB Cloud</span>
        </div>
      </div>
    </div>
  );
}
