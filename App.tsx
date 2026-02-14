import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import RootNavigator from '@/navigation/RootNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureGoogleSignIn } from '@/services/googleAuth.service';
import { ToastProvider } from '@/components/CustomToast';

export default function App() {
  // Configure Google Sign-In when app starts
  useEffect(() => {
    try {
      configureGoogleSignIn();
    } catch (error) {
      console.warn('Google Sign-In configuration failed:', error);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ToastProvider>
        <AuthProvider>
          <SettingsProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </SettingsProvider>
        </AuthProvider>
      </ToastProvider>
    </GestureHandlerRootView>
  );
}

