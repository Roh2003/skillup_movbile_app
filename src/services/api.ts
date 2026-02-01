import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log("API Base URL:", API_BASE_URL);

// Request interceptor - Add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Token added to request:', config.url);
        console.log('🔑 Token (first 20 chars):', token.substring(0, 20) + '...');
      } else {
        console.log('⚠️  NO TOKEN FOUND for request:', config.url);
      }
    } catch (error) {
      console.error('❌ Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          console.error('🔒 Unauthorized - clearing token');
          break;
        case 403:
          console.error('⛔ Access forbidden - insufficient permissions');
          console.error('Error details:', error.response.data);
          break;
        case 404:
          console.error('❌ Resource not found');
          break;
        case 500:
          console.error('💥 Server error');
          break;
        default:
          console.error('An error occurred:', error.response.data);
      }
    } else if (error.request) {
      console.error('📡 Network error - no response received');
    } else {
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
