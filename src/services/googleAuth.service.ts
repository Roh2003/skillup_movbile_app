import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

// Configure Google Sign-In
// Call this once when app starts (e.g., in App.tsx or _layout.tsx)
export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    offlineAccess: true, // If you need server-side access
    scopes: ['profile', 'email'],
  });
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    console.log('🔐 Starting Google Sign-In...');
    
    // Check if play services are available
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    
    // Sign in
    const response = await GoogleSignin.signIn();
    
    console.log('✅ Google Sign-In successful:', response);
    
    if (response.type === 'success' && response.data) {
      const { user, idToken } = response.data;
      
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.givenName || user.name?.split(' ')[0] || '',
          lastName: user.familyName || user.name?.split(' ')[1] || '',
          profileImage: user.photo || undefined,
          name: user.name || '',
        },
        idToken: idToken || undefined,
      };
    }
    
    return {
      success: false,
      error: 'Sign-in was not successful',
    };
  } catch (error: any) {
    console.error('❌ Google Sign-In error:', error);
    
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      return {
        success: false,
        error: 'User cancelled the login flow',
        cancelled: true,
      };
    } else if (error.code === statusCodes.IN_PROGRESS) {
      return {
        success: false,
        error: 'Sign-in is already in progress',
      };
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      return {
        success: false,
        error: 'Play services not available or outdated',
      };
    } else {
      return {
        success: false,
        error: error.message || 'Something went wrong',
      };
    }
  }
};

// Sign out from Google
export const signOutFromGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    console.log('✅ Google Sign-Out successful');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Google Sign-Out error:', error);
    return { success: false, error: error.message };
  }
};

// Check if user is signed in
export const isGoogleSignedIn = async () => {
  try {
    const currentUser = await GoogleSignin.getCurrentUser();
    return currentUser !== null;
  } catch (error) {
    return false;
  }
};
