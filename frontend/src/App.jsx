import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

import Fleet from './pages/Fleet';
import CarDetails from './pages/CarDetails';
import BookCar from './pages/BookCar';
import Confirmation from './pages/Confirmation';
import MyBookings from './pages/MyBookings';
import RentalHistory from './pages/RentalHistory';
import HostCars from './pages/HostCars';
import BuySellMarketplace from './pages/BuySellMarketplace';
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
            {/* 1st page opened is the authentication / login page */}
            <Route path="/" element={<Auth />} />
            <Route path="/auth" element={<Auth />} />

            {/* All internal pages are accessible only upon login/register */}
            <Route
              path="/fleet"
              element={
                <PrivateRoute>
                  <Fleet />
                </PrivateRoute>
              }
            />
            <Route
              path="/cars/:id"
              element={
                <PrivateRoute>
                  <CarDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/book/:id"
              element={
                <PrivateRoute>
                  <BookCar />
                </PrivateRoute>
              }
            />
            <Route
              path="/confirmation/:orderId"
              element={
                <PrivateRoute>
                  <Confirmation />
                </PrivateRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <PrivateRoute>
                  <MyBookings />
                </PrivateRoute>
              }
            />
            {/* Vehicle Host Portal: User can add their car and view order details when someone books it */}
            <Route
              path="/host"
              element={
                <PrivateRoute>
                  <HostCars />
                </PrivateRoute>
              }
            />
            {/* Buy / Sell Certified Marketplace Portal */}
            <Route
              path="/buy-sell"
              element={
                <PrivateRoute>
                  <BuySellMarketplace />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* ADMIN ROUTES: ACCESSIBLE ONLY TO ADMIN ROLE */}
            {/* Requirement: Only admin can see each car's previous order details and fleet invoice ledger */}
            <Route
              path="/history"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <RentalHistory />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/fleet"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <AdminFleet />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            {/* Catch-all redirect to auth */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
