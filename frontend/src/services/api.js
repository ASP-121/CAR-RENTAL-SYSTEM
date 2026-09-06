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

export const getCars = async () => {
  try {
    const response = await api.get('/cars');
    if (response.data && response.data.length > 0) {
      return response.data.map(car => ({
        ...car,
        image: getCarImage(car.type),
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
      image: getCarImage(carData.type),
    };
    const updated = [newCar, ...current];
    localStorage.setItem('driveease_cars', JSON.stringify(updated));
    return true;
  }
};

export const bookCar = async (bookingData) => {
  try {
    const response = await api.post('/booking/car', bookingData);
    return response.data;
  } catch (error) {
    console.warn('Backend booking unavailable, storing in localStorage:', error.message);
    const currentOrders = JSON.parse(localStorage.getItem('driveease_orders') || '[]');
    const newOrder = {
      ...bookingData,
      orderId: "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      isBooked: true,
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

export const getCarImage = (type) => {
  const t = (type || '').toLowerCase();
  if (t.includes('suv')) return '/assets/cars/suv.jpg';
  if (t.includes('electric') || t.includes('ev')) return '/assets/cars/electric.jpg';
  if (t.includes('convertible')) return '/assets/cars/convertible.jpg';
  if (t.includes('hatchback')) return '/assets/cars/hatchback.jpg';
  return '/assets/cars/sedan.jpg';
};

export default api;
