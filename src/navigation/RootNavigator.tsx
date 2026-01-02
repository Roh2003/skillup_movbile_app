import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import type { RootStackParamList, LearnerTabParamList, CounsellorTabParamList } from "../../types/navigation"

// Screens
import SplashScreen from "@/screens/SplashScreen"
import RoleSelectionScreen from "@/screens/RoleSelectionScreen"
import LearnerLoginScreen from "@/screens/learner/LearnerLoginScreen"
import LearnerRegisterScreen from "@/screens/learner/LearnerRegisterScreen"
import CounsellorLoginScreen from "@/screens/counsellor/CounsellorLoginScreen"
import HomeScreen from "@/screens/learner/HomeScreen"
import MyLearningScreen from "@/screens/learner/MyLearningScreen"
import CoursesScreen from "@/screens/learner/CoursesScreen"
import ChallengesScreen from "@/screens/learner/ChallengesScreen"
import FreeResourcesScreen from "@/screens/learner/FreeResourcesScreen"
import ConsultationScreen from "@/screens/learner/ConsultationScreen"
import RequestsScreen from "@/screens/counsellor/RequestsScreen"
import ScheduleScreen from "@/screens/counsellor/ScheduleScreen"
import EarningsScreen from "@/screens/counsellor/EarningsScreen"
import CompletedScreen from "@/screens/counsellor/CompletedScreen"

const RootStack = createNativeStackNavigator<RootStackParamList>()
const LearnerTabs = createBottomTabNavigator<LearnerTabParamList>()
const CounsellorTabs = createBottomTabNavigator<CounsellorTabParamList>()

function LearnerTabNavigator() {
  return (
    <LearnerTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6366f1",
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
        tabBarActiveTintColor: "#6366f1",
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
      {/* <RootStack.Screen name="Splash" component={SplashScreen} /> */}
      <RootStack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <RootStack.Screen name="LearnerLogin" component={LearnerLoginScreen} />
      <RootStack.Screen name="LearnerRegister" component={LearnerRegisterScreen} />
      <RootStack.Screen name="CounsellorLogin" component={CounsellorLoginScreen} />
      <RootStack.Screen name="LearnerMain" component={LearnerTabNavigator} />
      <RootStack.Screen name="CounsellorMain" component={CounsellorTabNavigator} />
    </RootStack.Navigator>
  )
}

