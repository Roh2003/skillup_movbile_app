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
    console.log('🔐 [authService] Calling learner login API...');
    const response = await api.post('/user/auth/login', credentials);
    console.log('📦 [authService] Login response:', response.data);

    if (response.data && response.data.data && response.data.data.authToken) {
      const token = response.data.data.authToken;
      console.log('💾 [authService] Saving token to AsyncStorage...');
      console.log('🔑 [authService] Token (first 20 chars):', token.substring(0, 20) + '...');

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userType', 'learner');
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.user));

      console.log('✅ [authService] Token saved successfully');
    } else {
      console.error('❌ [authService] No token in response!');
      console.error('Response structure:', JSON.stringify(response.data, null, 2));
    }

    return response.data;
  },

  // Learner register
  async learnerRegister(data: RegisterData) {
    const response = await api.post('/user/auth/register', data);
    if (response.data.success && response.data.data.accessToken) {
      await AsyncStorage.setItem('authToken', response.data.data.accessToken);
      await AsyncStorage.setItem('userType', 'learner');
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // Counselor login
  async counselorLogin(credentials: LoginCredentials) {
    console.log('🔐 [authService] Calling counselor login API...');
    const response = await api.post('/admin/counselor/login', credentials);
    console.log('📦 [authService] Counselor login response:', response.data);

    if (response.data && response.data.data && response.data.data.authToken) {
      const token = response.data.data.authToken;
      console.log('💾 [authService] Saving counselor token to AsyncStorage...');
      console.log('🔑 [authService] Token (first 20 chars):', token.substring(0, 20) + '...');

      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('userType', 'counselor');
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.counselor));

      console.log('✅ [authService] Counselor token saved successfully');
    } else {
      console.error('❌ [authService] No token in counselor response!');
      console.error('Response structure:', JSON.stringify(response.data, null, 2));
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

  // Get user profile from API
  async getProfile() {
    console.log('📥 [authService] Fetching user profile...');
    const response = await api.get('/user/auth/profile');
    console.log('📦 [authService] Profile response:', response.data);
    
    if (response.data && response.data.data) {
      // Update local storage with fresh data
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.data));
      console.log('✅ [authService] Profile fetched and cached successfully');
    }
    
    return response.data;
  },

  // Update user profile
  async updateProfile(profileData: any) {
    console.log('📤 [authService] Updating user profile...');
    console.log('Profile data:', profileData);
    
    const response = await api.post('/user/auth/update-profile', profileData);
    console.log('📦 [authService] Update profile response:', response.data);
    
    if (response.data && response.data.data) {
      // Update local storage with new data
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.data));
      console.log('✅ [authService] Profile updated and cached successfully');
    }
    
    return response.data;
  },

  async googleLogin(googleUser: {
    idToken: string;
    email: string;
    firstName: string;
    lastName: string;
    googleId: string;
    profileImage?: string;
  }) {
    const response = await api.post('/user/auth/google', googleUser);
    if (response.data?.data?.authToken) {
      await AsyncStorage.setItem('authToken', response.data.data.authToken);
      await AsyncStorage.setItem('userType', 'learner');
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.user));
    }
    return response.data;
  }
};

export default authService;
