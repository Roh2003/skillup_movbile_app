import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const authService = {
  // Learner login
  async learnerLogin(credentials: LoginCredentials) {
    const response = await api.post('/user/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      await AsyncStorage.setItem('authToken', response.data.data.token);
      await AsyncStorage.setItem('userType', 'learner');
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Learner register
  async learnerRegister(data: RegisterData) {
    const response = await api.post('/user/auth/register', data);
    if (response.data.success && response.data.data.token) {
      await AsyncStorage.setItem('authToken', response.data.data.token);
      await AsyncStorage.setItem('userType', 'learner');
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Counselor login
  async counselorLogin(credentials: LoginCredentials) {
    const response = await api.post('/admin/counselor/login', credentials);
    if (response.data.success && response.data.data.token) {
      await AsyncStorage.setItem('authToken', response.data.data.token);
      await AsyncStorage.setItem('userType', 'counselor');
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.counselor));
    }
    return response.data;
  },

  // Logout
  async logout() {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userType');
    await AsyncStorage.removeItem('userData');
  },

  // Get current user
  async getCurrentUser() {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Get user type
  async getUserType() {
    return await AsyncStorage.getItem('userType');
  },

  // Check if authenticated
  async isAuthenticated() {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  },
};

export default authService;
