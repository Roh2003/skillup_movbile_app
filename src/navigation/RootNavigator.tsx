import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/theme/colors"
import type { RootStackParamList, LearnerTabParamList, CounsellorTabParamList } from "../../types/navigation"

// Auth / onboarding
import SplashScreen from "@/screens/SplashScreen"
import OnboardingScreen from "@/screens/OnboardingScreen"
import WelcomeScreen from "@/screens/WelcomeScreen"
import RoleSelectionScreen from "@/screens/RoleSelectionScreen"
import LearnerLoginScreen from "@/screens/learner/LearnerLoginScreen"
import LearnerRegisterScreen from "@/screens/learner/LearnerRegisterScreen"
import ResetPasswordScreen from "@/screens/ResetPasswordScreen"
import CounsellorLoginScreen from "@/screens/counsellor/CounsellorLoginScreen"

// Learner main
import HomeScreen from "@/screens/learner/HomeScreen"
import MyLearningScreen from "@/screens/learner/MyLearningScreen"
import CoursesScreen from "@/screens/learner/CoursesScreen"
import ChallengesScreen from "@/screens/learner/ChallengesScreen"
import FreeResourcesScreen from "@/screens/learner/FreeResourcesScreen"
import ConsultationScreen from "@/screens/learner/ConsultationScreen"

// Extra learner stack screens
import CourseDetailScreen from "@/screens/learner/CourseDetailScreen"
import VideoPlayerScreen from "@/screens/learner/VideoPlayerScreen"
import ProfileScreen from "@/screens/learner/ProfileScreen"
import NotificationsScreen from "@/screens/learner/NotificationsScreen"
import BookmarksScreen from "@/screens/learner/BookmarksScreen"
import ChatScreen from "@/screens/learner/ChatScreen"
import SettingsScreen from "@/screens/learner/SettingsScreen"
import OptionsScreen from "@/screens/learner/OptionsScreen"
import EditProfileScreen from "@/screens/learner/EditProfileScreen"
import ChallengeDetailScreen from "@/screens/learner/ChallengeDetailScreen"
import LeaderboardScreen from "@/screens/learner/LeaderboardScreen"
import MeetingRequestScreen from "@/screens/learner/MeetingRequestScreen"
import MeetingRoomScreen from "@/screens/learner/MeetingRoomScreen"

// Counsellor
import RequestsScreen from "@/screens/counsellor/RequestsScreen"
import ScheduleScreen from "@/screens/counsellor/ScheduleScreen"
import EarningsScreen from "@/screens/counsellor/EarningsScreen"
import CompletedScreen from "@/screens/counsellor/CompletedScreen"
import CounsellorMeetingRoomScreen from "@/screens/counsellor/CounsellorMeetingRoomScreen"


const RootStack = createNativeStackNavigator<RootStackParamList>()
const LearnerTabs = createBottomTabNavigator<LearnerTabParamList>()
const CounsellorTabs = createBottomTabNavigator<CounsellorTabParamList>()

function LearnerTabNavigator() {
  return (
    <LearnerTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#9ca3af",
      }}
    >
      <LearnerTabs.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <LearnerTabs.Screen
        name="MyLearning"
        component={MyLearningScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="book" size={size} color={color} />,
          title: "My Learning",
        }}
      />
      <LearnerTabs.Screen
        name="Courses"
        component={CoursesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="library" size={size} color={color} />,
        }}
      />
      <LearnerTabs.Screen
        name="Challenges"
        component={ChallengesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="trophy" size={size} color={color} />,
        }}
      />
      <LearnerTabs.Screen
        name="FreeResources"
        component={FreeResourcesScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="document-text" size={size} color={color} />,
          title: "Resources",
        }}
      />
      <LearnerTabs.Screen
        name="Consultation"
        component={ConsultationScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} />,
        }}
      />
    </LearnerTabs.Navigator>
  )
}

function CounsellorTabNavigator() {
  return (
    <CounsellorTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#F59E0B",
        tabBarInactiveTintColor: "#9ca3af",
      }}
    >
      <CounsellorTabs.Screen
        name="Requests"
        component={RequestsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="mail" size={size} color={color} />,
        }}
      />
      <CounsellorTabs.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
        }}
      />
      <CounsellorTabs.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="cash" size={size} color={color} />,
        }}
      />
      <CounsellorTabs.Screen
        name="Completed"
        component={CompletedScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="checkmark-circle" size={size} color={color} />,
        }}
      />
    </CounsellorTabs.Navigator>
  )
}

export default function RootNavigator() {
  return (
    <RootStack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <RootStack.Screen name="Splash" component={SplashScreen} />
      <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
      <RootStack.Screen name="Welcome" component={WelcomeScreen} />
      <RootStack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <RootStack.Screen name="LearnerLogin" component={LearnerLoginScreen} />
      <RootStack.Screen name="LearnerRegister" component={LearnerRegisterScreen} />
      <RootStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <RootStack.Screen name="CounsellorLogin" component={CounsellorLoginScreen} />
      <RootStack.Screen name="LearnerMain" component={LearnerTabNavigator} />
      <RootStack.Screen name="CounsellorMain" component={CounsellorTabNavigator} />
      {/* Extra learner stack screens */}
      <RootStack.Screen name="CourseDetail" component={CourseDetailScreen} />
      <RootStack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
      <RootStack.Screen name="Profile" component={ProfileScreen} />
      <RootStack.Screen name="Notifications" component={NotificationsScreen} />
      <RootStack.Screen name="Options" component={OptionsScreen} />
      <RootStack.Screen name="Bookmarks" component={BookmarksScreen} />
      <RootStack.Screen name="Chat" component={ChatScreen} />
      <RootStack.Screen name="Settings" component={SettingsScreen} />
      <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
      <RootStack.Screen name="ChallengeDetail" component={ChallengeDetailScreen} />
      <RootStack.Screen name="Leaderboard" component={LeaderboardScreen} />
      <RootStack.Screen name="MeetingRequest" component={MeetingRequestScreen} />
      <RootStack.Screen name="MeetingRoom" component={MeetingRoomScreen} />
      <RootStack.Screen name="CounsellorMeetingRoom" component={CounsellorMeetingRoomScreen} />
    </RootStack.Navigator>
  )
}
