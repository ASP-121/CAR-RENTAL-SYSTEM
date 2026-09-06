import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Fleet from './pages/Fleet';
import CarDetails from './pages/CarDetails';
import BookCar from './pages/BookCar';
import Confirmation from './pages/Confirmation';
import MyBookings from './pages/MyBookings';
import RentalHistory from './pages/RentalHistory';
import AdminFleet from './pages/AdminFleet';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Auth from './pages/Auth';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#131a33]">
        <Navbar />
        {/* Main Content container with top padding for fixed navbar */}
        <main className="flex-1 pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/cars/:id" element={<CarDetails />} />
            <Route path="/book/:id" element={<BookCar />} />
            <Route path="/confirmation/:orderId" element={<Confirmation />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/history" element={<RentalHistory />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/fleet" element={<AdminFleet />} />
            <Route path="/admin/bookings" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
