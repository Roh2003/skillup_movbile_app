# Google Authentication for Learner Registration

Add Google Sign-In capability to the mobile app's learner registration flow, allowing users to register/login with their Google account.

---

## User Review Required

> [!IMPORTANT]
> **Google Cloud Console Setup Required**  
> Before implementation, you need to create a Google Cloud project and configure OAuth credentials:
> 1. Go to [Google Cloud Console](https://console.cloud.google.com/)
> 2. Create a new project or select existing
> 3. Enable **Google Sign-In API**
> 4. Create OAuth 2.0 credentials (Web application type)
> 5. Add authorized redirect URI: `https://auth.expo.io/@your-username/skillup`

> [!WARNING]
> **Schema Change**  
> The `User.password` field is currently required. This implementation will make it optional to support OAuth users who don't have a password.

---

## Proposed Changes

### Database Schema

#### [MODIFY] [schema.prisma](file:///c:/web_dev/final_year_project/Backend/prisma/schema.prisma)

Add OAuth fields to the User model:

```diff
model User {
  id                Int                @id @default(autoincrement())
  firstName         String?            @map("first_name")
  lastName          String?            @map("last_name")
  ...
  email             String             @unique
  username          String             @unique
- password          String
+ password          String?            // Optional for OAuth users
+ 
+ // OAuth fields
+ googleId          String?            @unique @map("google_id")
+ authProvider      AuthProvider       @default(LOCAL)
  ...
}

+enum AuthProvider {
+  LOCAL
+  GOOGLE
+}
```

---

### Backend API

#### [MODIFY] [auth.controller.ts](file:///c:/web_dev/final_year_project/Backend/src/controllers/auth.controller.ts)

Add new `googleAuth` endpoint that:
- Receives Google `idToken` from mobile app
- Verifies token with Google's API
- Creates new user or logs in existing user
- Returns JWT auth token

```typescript
// New function to add
export const googleAuth = async (req: Request, res: Response) => {
  const { idToken, email, firstName, lastName, googleId, profileImage } = req.body;
  
  // 1. Verify idToken with Google (optional but recommended)
  // 2. Check if user exists by googleId or email
  // 3. If exists: login and return token
  // 4. If not: create user with authProvider=GOOGLE, no password
  // 5. Return user + authToken
}
```

#### [MODIFY] [auth.routes.ts](file:///c:/web_dev/final_year_project/Backend/src/routes/subRoutes/auth.routes.ts)

Add route for Google auth:
```typescript
router.post('/google', googleAuth);
```

---

### Mobile Application

#### [NEW] Install Required Packages

```bash
npx expo install expo-auth-session expo-crypto expo-web-browser
```

> [!NOTE]
> `expo-auth-session` works with Expo Go and development builds without native code changes.

#### [NEW] [google.service.ts](file:///c:/web_dev/final_year_project/mobile_application/src/services/google.service.ts)

Create new service to handle Google OAuth:

```typescript
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: 'YOUR_WEB_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID', // Optional
  });
  
  return { request, response, promptAsync };
};
```

#### [MODIFY] [auth.service.ts](file:///c:/web_dev/final_year_project/mobile_application/src/services/auth.service.ts)

Add method to handle Google auth with backend:

```typescript
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
```

#### [MODIFY] [LearnerRegisterScreen.tsx](file:///c:/web_dev/final_year_project/mobile_application/src/screens/learner/LearnerRegisterScreen.tsx)

Update the Google button to be functional:

```typescript
import { useGoogleAuth } from '@/services/google.service';

// Inside component:
const { request, response, promptAsync } = useGoogleAuth();

const handleGoogleSignUp = async () => {
  const result = await promptAsync();
  if (result?.type === 'success') {
    // Extract user info and call authService.googleLogin()
  }
};

// Update button:
<TouchableOpacity 
  style={styles.socialButton}
  onPress={handleGoogleSignUp}
  disabled={!request}
>
  <Ionicons name="logo-google" size={20} color="#4285F4" />
  <Text style={styles.socialButtonText}>Sign Up with Google</Text>
</TouchableOpacity>
```

#### [MODIFY] [.env](file:///c:/web_dev/final_year_project/mobile_application/.env)

Add Google OAuth credentials:

```env
GOOGLE_WEB_CLIENT_ID=your_web_client_id_here
GOOGLE_ANDROID_CLIENT_ID=your_android_client_id_here
```

---

## Verification Plan

### Manual Testing (Primary)

Since Google OAuth requires real Google credentials and user interaction, testing will be manual:

1. **Setup Verification**
   - Confirm Google Cloud Console has OAuth credentials configured
   - Verify redirect URIs are set correctly

2. **Registration Flow Test**
   - Open the app and navigate to Learner Registration
   - Tap "Sign Up with Google" button
   - Google sign-in popup should appear
   - After signing in, user should be redirected to the app
   - User should be logged in and see home screen
   - Check database: new user created with `authProvider=GOOGLE`

3. **Returning User Test**  
   - Logout from app
   - Tap "Sign Up with Google" again with same account
   - Should login (not create duplicate user)
   - Verify same user ID in database

4. **Edge Case: Existing Email**
   - Register with email manually first
   - Try Google sign-in with same email
   - Expected: Link accounts or show appropriate error

### Database Verification

After Google sign-up, run this query to verify user creation:

```sql
SELECT id, email, "google_id", "auth_provider", password 
FROM users 
WHERE "google_id" IS NOT NULL;
```

Expected: User exists with `google_id` populated, `auth_provider = 'GOOGLE'`, `password = NULL`.
