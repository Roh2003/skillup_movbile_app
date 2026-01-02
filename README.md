# SkillUp Mobile Application

SkillUp is an online learning and consulting platform with dedicated flows for **Learners** and **Counsellors**.

## 🚀 How to Run the Project

### 1. Prerequisites
- **Node.js** (v18 or newer)
- **Expo Go** app installed on your physical device (iOS/Android)
- **Android Studio** (for Android Emulator) or **Xcode** (for iOS Simulator)

### 2. Setup
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Start the Development Server
```bash
npm start
```
- **Mobile Device:** Scan the QR code shown in your terminal using the Expo Go app.
- **Android Emulator:** Press `a` in the terminal.
- **iOS Simulator:** Press `i` in the terminal.

### 4. Build for Production (APK/IPA)
To build a binary for distribution, you need to use **EAS Build**:
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to your Expo account
eas login

# Build for Android (generates .apk or .aab)
eas build --platform android --profile preview

# Build for iOS
eas build --platform ios
```

## 📂 Project Structure
- `/src/screens/learner`: Screens for the learner flow (Courses, Challenges, etc.)
- `/src/screens/counsellor`: Screens for the counsellor flow (Requests, Earnings, etc.)
- `/src/contexts`: Global state management for Auth and Settings.
- `/src/theme`: Design tokens for colors and typography.
