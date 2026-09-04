import axios from 'axios';

// Base API configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.REACT_APP_API_URL ||
  'http://localhost:5001/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Inject JWT token into Authorization header if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle global errors like expired tokens (401)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login if unauthenticated on protected actions
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/* ==========================================================================
   AUTHENTICATION API
   ========================================================================== */
export const loginUser = (credentials) => API.post('/auth/login', credentials);
export const registerUser = (userData) => API.post('/auth/register', userData);
export const getUserProfile = () => API.get('/auth/profile');
export const updateUserProfile = (profileData) => API.put('/auth/profile', profileData);

/* ==========================================================================
   CROP LOTS & MARKETPLACE API
   ========================================================================== */
export const getCropLots = (params) => API.get('/produce', { params });
export const getCropById = (id) => API.get(`/produce/${id}`);
export const getCropLotById = getCropById;
export const createCropLot = (cropData) => API.post('/produce', cropData);
export const updateCropLot = (id, cropData) => API.put(`/produce/${id}`, cropData);
export const deleteCropLot = (id) => API.delete(`/produce/${id}`);

/* ==========================================================================
   FPO POOLING & AGGREGATION API
   ========================================================================== */
export const poolCropLots = (poolData) => API.put('/produce/pool', poolData);
export const getPooledConsignments = () => API.get('/produce', { params: { isPooled: true } });

/* ==========================================================================
   ROUTE OPTIMIZATION & LOGISTICS (VRP)
   ========================================================================== */
export const optimizeRoute = (routeData) => API.post('/logistics/trip', routeData);
export const getActiveTrips = () => API.get('/logistics/trip');
export const updateTripLocation = (tripId, locationData) =>
  API.put(`/logistics/trip/${tripId}/location`, locationData);

/* ==========================================================================
   AI QUALITY ASSESSMENT API
   ========================================================================== */
export const assessCropQuality = (formData) =>
  API.post('/produce', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

/* ==========================================================================
   ORDERS & BIDDING API
   ========================================================================== */
export const createOrder = (orderData) => API.post('/orders', orderData);
export const getUserOrders = () => API.get('/orders');
export const placeBid = (cropId, bidData) => API.post(`/produce/${cropId}/bids`, bidData);
export const getMandiPriceForecast = (params) => API.get('/admin/analytics', { params });
export const releaseEscrow = (orderId, payload) =>
  API.put(`/orders/${orderId}/release-escrow`, payload);

/* ==========================================================================
   FILE UPLOAD API
   ========================================================================== */
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.url || data.path;
};

export default API;
