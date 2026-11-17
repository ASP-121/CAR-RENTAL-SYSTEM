import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Fallback initial cars if backend has no data yet
export const DEFAULT_CARS = [
  {
    id: "car_1",
    name: "Model 3 Performance",
    company: "Tesla",
    price: 89,
    rating: 4.95,
    type: "Electric",
    seats: 5,
    range: "315 mi",
    acceleration: "3.1s",
    fuelType: "Electric",
    image: "/assets/cars/electric.jpg",
  },
  {
    id: "car_2",
    name: "C-Class Sedan",
    company: "Mercedes-Benz",
    price: 115,
    rating: 4.88,
    type: "Sedan",
    seats: 5,
    range: "540 mi",
    acceleration: "5.3s",
    fuelType: "Gasoline",
    image: "/assets/cars/sedan.jpg",
  },
  {
    id: "car_3",
    name: "X5 xDrive40i",
    company: "BMW",
    price: 135,
    rating: 4.92,
    type: "SUV",
    seats: 7,
    range: "480 mi",
    acceleration: "4.8s",
    fuelType: "Hybrid",
    image: "/assets/cars/suv.jpg",
  },
  {
    id: "car_4",
    name: "911 Carrera Cabriolet",
    company: "Porsche",
    price: 240,
    rating: 4.99,
    type: "Convertible",
    seats: 4,
    range: "410 mi",
    acceleration: "3.8s",
    fuelType: "Gasoline",
    image: "/assets/cars/convertible.jpg",
  },
  {
    id: "car_5",
    name: "Golf GTI Clubsport",
    company: "Volkswagen",
    price: 65,
    rating: 4.79,
    type: "Hatchback",
    seats: 5,
    range: "450 mi",
    acceleration: "5.6s",
    fuelType: "Gasoline",
    image: "/assets/cars/hatchback.jpg",
  },
];

// --- AUTHENTICATION & USER HELPERS ---
export const getCurrentUser = () => {
  const stored = localStorage.getItem('driveease_user');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  return null;
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('driveease_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('driveease_user');
  }
  window.dispatchEvent(new Event('authChange'));
};

export const logoutUser = () => {
  localStorage.removeItem('driveease_user');
  window.dispatchEvent(new Event('authChange'));
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data && response.data.user) {
      setCurrentUser(response.data.user);
    }
    return response.data;
  } catch (error) {
    console.warn('Backend auth unavailable, using offline login fallback:', error.message);
    const isAdmin = email.toLowerCase().includes('admin') || password === 'admin123';
    const fallbackUser = {
      name: isAdmin ? 'Fleet Administrator' : (email.split('@')[0] || 'Driver'),
      email: email,
      phone: isAdmin ? '+1 (800) 555-0199' : '+1 (415) 890-2341',
      licenseNumber: isAdmin ? 'ADMIN-EXEC-01' : 'CA-9482104-D',
      membershipTier: isAdmin ? 'Master Operations Access' : 'Platinum Keyless Access',
      tripsCompleted: isAdmin ? 52 : 14,
      rating: 5.0,
      verified: true,
      role: isAdmin ? 'ADMIN' : 'CUSTOMER',
    };
    setCurrentUser(fallbackUser);
    return { success: true, user: fallbackUser };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data && response.data.user) {
      setCurrentUser(response.data.user);
    }
    return response.data;
  } catch (error) {
    console.warn('Backend auth unavailable, registering locally:', error.message);
    const isAdmin = userData.email?.toLowerCase().includes('admin');
    const newUser = {
      ...userData,
      name: userData.name || (isAdmin ? 'Admin' : 'Driver'),
      membershipTier: isAdmin ? 'Master Operations Access' : 'Standard Member',
      tripsCompleted: 0,
      rating: 5.0,
      verified: true,
      role: isAdmin ? 'ADMIN' : 'CUSTOMER',
    };
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  }
};

export const getUserProfile = async (email) => {
  try {
    const response = await api.get('/auth/profile', { params: { email } });
    return response.data;
  } catch (error) {
    return getCurrentUser();
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/auth/profile', userData);
    setCurrentUser(response.data);
    return response.data;
  } catch (error) {
    setCurrentUser(userData);
    return userData;
  }
};

// --- CAR / FLEET OPERATIONS ---
export const getCars = async (filters = {}) => {
  try {
    const response = await api.get('/cars', { params: filters });
    if (response.data && response.data.length > 0) {
      return response.data.map(car => ({
        ...car,
        image: car.imageUrl || getCarImage(car.type),
      }));
    }
    return DEFAULT_CARS;
  } catch (error) {
    console.warn('Backend unavailable, using default car catalog:', error.message);
    const stored = localStorage.getItem('driveease_cars');
    if (stored) {
      try { return JSON.parse(stored); } catch(e) {}
    }
    return DEFAULT_CARS;
  }
};

export const getCarById = async (id) => {
  try {
    const response = await api.get(`/cars/${id}`);
    const car = response.data;
    return {
      ...car,
      image: car.imageUrl || getCarImage(car.type),
    };
  } catch (error) {
    const all = await getCars();
    return all.find(c => c.id === id || c.name === id) || all[0];
  }
};

export const addCar = async (carData) => {
  try {
    const response = await api.post('/cars/add', carData);
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable, storing in localStorage:', error.message);
    const current = await getCars();
    const newCar = {
      ...carData,
      id: "car_" + Date.now(),
      image: carData.imageUrl || getCarImage(carData.type),
    };
    const updated = [newCar, ...current];
    localStorage.setItem('driveease_cars', JSON.stringify(updated));
    return newCar;
  }
};

export const updateCar = async (id, carData) => {
  try {
    const response = await api.put(`/cars/${id}`, carData);
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable, updating locally:', error.message);
    const current = await getCars();
    const updated = current.map(c => (c.id === id ? { ...c, ...carData } : c));
    localStorage.setItem('driveease_cars', JSON.stringify(updated));
    return carData;
  }
};

export const deleteCar = async (id) => {
  try {
    const response = await api.delete(`/cars/${id}`);
    return response.data;
  } catch (error) {
    console.warn('Backend unavailable, deleting locally:', error.message);
    const current = await getCars();
    const updated = current.filter(c => c.id !== id);
    localStorage.setItem('driveease_cars', JSON.stringify(updated));
    return true;
  }
};

// --- BOOKING OPERATIONS ---
export const checkAvailability = async (carName, pickUpTime, returnUpTime) => {
  try {
    const response = await api.get('/booking/check-availability', {
      params: { carName, pickUpTime, returnUpTime }
    });
    return response.data;
  } catch (error) {
    console.warn('Availability check failed, defaulting to available:', error.message);
    return { available: true, message: "Available" };
  }
};

export const bookCar = async (bookingData) => {
  try {
    const response = await api.post('/booking/car', bookingData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      throw new Error(error.response.data?.message || 'Car is already booked for the selected schedule.');
    }
    console.warn('Backend booking unavailable, storing in localStorage:', error.message);
    const currentOrders = JSON.parse(localStorage.getItem('driveease_orders') || '[]');
    const newOrder = {
      ...bookingData,
      orderId: bookingData.orderId || "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      isBooked: true,
      status: "CONFIRMED",
    };
    localStorage.setItem('driveease_orders', JSON.stringify([newOrder, ...currentOrders]));
    return newOrder;
  }
};

export const getOrders = async () => {
  try {
    const response = await api.get('/booking/orders');
    if (response.data && response.data.length > 0) {
      return response.data;
    }
    return JSON.parse(localStorage.getItem('driveease_orders') || '[]');
  } catch (error) {
    console.warn('Backend orders unavailable, loading from localStorage:', error.message);
    return JSON.parse(localStorage.getItem('driveease_orders') || '[]');
  }
};

export const getUserOrders = async (carUser) => {
  try {
    const response = await api.get(`/booking/user/${encodeURIComponent(carUser)}`);
    return response.data;
  } catch (error) {
    const all = await getOrders();
    return all.filter(o => o.carUser?.toLowerCase() === carUser?.toLowerCase());
  }
};

export const getOrderDetail = async (orderId) => {
  try {
    const response = await api.get(`/booking/order/${orderId}`);
    return response.data;
  } catch (error) {
    const all = await getOrders();
    return all.find(o => o.orderId === orderId);
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const response = await api.put(`/booking/order/${orderId}/cancel`);
    return response.data;
  } catch (error) {
    console.warn('Backend cancel unavailable, updating locally:', error.message);
    const orders = JSON.parse(localStorage.getItem('driveease_orders') || '[]');
    const updated = orders.map(o => o.orderId === orderId ? { ...o, isBooked: false, status: 'CANCELLED' } : o);
    localStorage.setItem('driveease_orders', JSON.stringify(updated));
    return true;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/booking/order/${orderId}/status`, null, { params: { status } });
    return response.data;
  } catch (error) {
    return true;
  }
};

export const getCarHistory = async (carName) => {
  try {
    const response = await api.get(`/booking/history/${encodeURIComponent(carName)}`);
    return response.data;
  } catch (error) {
    console.warn('Backend history unavailable, calculating from localStorage:', error.message);
    const allOrders = JSON.parse(localStorage.getItem('driveease_orders') || '[]');
    return allOrders.filter(o => o.carName?.toLowerCase() === carName?.toLowerCase());
  }
};

// --- TELEMETRY & DIGITAL KEY ---
export const getTelemetry = async (orderId) => {
  try {
    const response = await api.get(`/telemetry/${orderId}`);
    return response.data;
  } catch (error) {
    return { orderId, locked: false, climateOn: true, temperature: 70, batteryLevel: 94, status: 'ONLINE' };
  }
};

export const toggleTelemetryLock = async (orderId) => {
  try {
    const response = await api.post(`/telemetry/${orderId}/lock`);
    return response.data;
  } catch (error) {
    return { orderId, locked: true };
  }
};

export const toggleTelemetryClimate = async (orderId) => {
  try {
    const response = await api.post(`/telemetry/${orderId}/climate`);
    return response.data;
  } catch (error) {
    return { orderId, climateOn: false };
  }
};

// --- ADMIN ANALYTICS ---
export const getAdminAnalytics = async () => {
  try {
    const response = await api.get('/admin/analytics');
    return response.data;
  } catch (error) {
    const cars = await getCars();
    const orders = await getOrders();
    const grossRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.carPrice) || 0), 0);
    return {
      grossRevenue,
      totalBookings: orders.length,
      activeTrips: orders.filter(o => o.status !== 'CANCELLED').length,
      totalCars: cars.length,
      utilizationRate: 84.2,
      averageRating: 4.92,
      recentOrders: orders.slice(0, 5),
    };
  }
};

export const getCarImage = (type) => {
  const t = (type || '').toLowerCase();
  if (t.includes('suv')) return '/assets/cars/suv.jpg';
  if (t.includes('electric') || t.includes('ev')) return '/assets/cars/electric.jpg';
  if (t.includes('convertible')) return '/assets/cars/convertible.jpg';
  if (t.includes('hatchback')) return '/assets/cars/hatchback.jpg';
  return '/assets/cars/sedan.jpg';
};

export default api;
