import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token to all outgoing API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('driveease_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('driveease_token');
      localStorage.removeItem('driveease_user');
      window.dispatchEvent(new Event('authChange'));
      if (window.location.pathname !== '/auth' && window.location.pathname !== '/') {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

// Default car catalog fallback for display when catalog is empty
export const DEFAULT_CARS = [
  {
    id: "car_1",
    name: "Model 3 Performance",
    company: "Tesla",
    price: 4999,
    rating: 4.95,
    type: "Electric",
    seats: 5,
    range: "490 km",
    acceleration: "3.1s",
    fuelType: "Electric",
    image: "/assets/cars/electric.jpg",
  },
  {
    id: "car_2",
    name: "C-Class Sedan",
    company: "Mercedes-Benz",
    price: 6499,
    rating: 4.88,
    type: "Sedan",
    seats: 5,
    range: "850 km",
    acceleration: "5.3s",
    fuelType: "Gasoline",
    image: "/assets/cars/sedan.jpg",
  },
  {
    id: "car_3",
    name: "X5 xDrive40i",
    company: "BMW",
    price: 8499,
    rating: 4.92,
    type: "SUV",
    seats: 7,
    range: "750 km",
    acceleration: "4.8s",
    fuelType: "Hybrid",
    image: "/assets/cars/suv.jpg",
  },
  {
    id: "car_4",
    name: "911 Carrera Cabriolet",
    company: "Porsche",
    price: 18999,
    rating: 4.99,
    type: "Convertible",
    seats: 4,
    range: "650 km",
    acceleration: "3.8s",
    fuelType: "Gasoline",
    image: "/assets/cars/convertible.jpg",
  },
  {
    id: "car_5",
    name: "Golf GTI Clubsport",
    company: "Volkswagen",
    price: 3499,
    rating: 4.79,
    type: "Hatchback",
    seats: 5,
    range: "700 km",
    acceleration: "5.6s",
    fuelType: "Gasoline",
    image: "/assets/cars/hatchback.jpg",
  },
];

// --- AUTHENTICATION & USER HELPERS ---
export const getToken = () => {
  return localStorage.getItem('driveease_token');
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('driveease_token', token);
  } else {
    localStorage.removeItem('driveease_token');
  }
};

export const getCurrentUser = () => {
  const stored = localStorage.getItem('driveease_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
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
  localStorage.removeItem('driveease_token');
  localStorage.removeItem('driveease_user');
  window.dispatchEvent(new Event('authChange'));
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data && response.data.success) {
      if (response.data.token) {
        setToken(response.data.token);
      }
      if (response.data.user) {
        setCurrentUser(response.data.user);
      }
    }
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message || 'Unable to connect to authentication server.';
    return { success: false, message: msg };
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    if (response.data && response.data.success) {
      if (response.data.token) {
        setToken(response.data.token);
      }
      if (response.data.user) {
        setCurrentUser(response.data.user);
      }
    }
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
    return { success: false, message: msg };
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    if (response.data) {
      setCurrentUser(response.data);
    }
    return response.data;
  } catch (error) {
    return getCurrentUser();
  }
};

export const updateUserProfile = async (userData) => {
  const response = await api.put('/auth/profile', userData);
  if (response.data) {
    setCurrentUser(response.data);
  }
  return response.data;
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
    console.warn('Backend unavailable or catalog empty:', error.message);
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

export const getMyCars = async () => {
  const response = await api.get('/cars/my-cars');
  return response.data || [];
};

export const addCar = async (carData) => {
  const response = await api.post('/cars/add', carData);
  return response.data;
};

export const updateCar = async (id, carData) => {
  const response = await api.put(`/cars/${id}`, carData);
  return response.data;
};

export const deleteCar = async (id) => {
  const response = await api.delete(`/cars/${id}`);
  return response.data;
};

// --- BOOKING OPERATIONS ---
export const checkAvailability = async (carName, pickUpTime, returnUpTime) => {
  const response = await api.get('/booking/check-availability', {
    params: { carName, pickUpTime, returnUpTime }
  });
  return response.data;
};

// --- DYNAMIC PRICING ENGINE ---
export const calculateDynamicPrice = async (carName, pickUpTime, returnUpTime) => {
  try {
    const response = await api.get('/booking/calculate-price', {
      params: { carName, pickUpTime, returnUpTime }
    });
    return response.data;
  } catch (error) {
    console.warn('Dynamic pricing fallback:', error.message);
    return null;
  }
};

export const bookCar = async (bookingData) => {
  const response = await api.post('/booking/car', bookingData);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/booking/orders');
  return response.data || [];
};

export const getUserOrders = async () => {
  const response = await api.get('/booking/user');
  return response.data || [];
};

export const getOwnerOrders = async () => {
  const response = await api.get('/booking/owner-orders');
  return response.data || [];
};

export const getOrderDetail = async (orderId) => {
  const response = await api.get(`/booking/order/${orderId}`);
  return response.data;
};

export const cancelOrder = async (orderId) => {
  const response = await api.put(`/booking/order/${orderId}/cancel`);
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/booking/order/${orderId}/status`, null, { params: { status } });
  return response.data;
};

export const getCarHistory = async (carName) => {
  const response = await api.get(`/booking/history/${encodeURIComponent(carName)}`);
  return response.data;
};

// --- TELEMETRY & DIGITAL KEY ---
export const getTelemetry = async (orderId) => {
  const response = await api.get(`/telemetry/${orderId}`);
  return response.data;
};

export const toggleTelemetryLock = async (orderId) => {
  const response = await api.post(`/telemetry/${orderId}/lock`);
  return response.data;
};

export const toggleTelemetryClimate = async (orderId) => {
  const response = await api.post(`/telemetry/${orderId}/climate`);
  return response.data;
};

export const setTelemetryTemperature = async (orderId, temp) => {
  const response = await api.post(`/telemetry/${orderId}/temperature`, null, { params: { temp } });
  return response.data;
};

// --- ADMIN ANALYTICS ---
export const getAdminAnalytics = async () => {
  const response = await api.get('/admin/analytics');
  return response.data;
};

// --- BUY & SELL MARKETPLACE OPERATIONS ---
export const getSaleListings = async (filters = {}) => {
  const response = await api.get('/marketplace/cars', { params: filters });
  return response.data || [];
};

export const getSaleListingById = async (id) => {
  const response = await api.get(`/marketplace/cars/${id}`);
  return response.data;
};

export const createSaleListing = async (carData) => {
  const response = await api.post('/marketplace/cars/sell', carData);
  return response.data;
};

export const updateSaleListing = async (id, carData) => {
  const response = await api.put(`/marketplace/cars/${id}`, carData);
  return response.data;
};

export const deleteSaleListing = async (id) => {
  const response = await api.delete(`/marketplace/cars/${id}`);
  return response.data;
};

export const getMySaleListings = async () => {
  const response = await api.get('/marketplace/my-listings');
  return response.data || [];
};

export const submitPurchaseInquiry = async (inquiryData) => {
  const response = await api.post('/marketplace/inquiries', inquiryData);
  return response.data;
};

export const getMyPurchaseInquiries = async () => {
  const response = await api.get('/marketplace/my-inquiries');
  return response.data || [];
};

export const updateInquiryStatus = async (id, status) => {
  const response = await api.put(`/marketplace/inquiries/${id}/status`, null, { params: { status } });
  return response.data;
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
