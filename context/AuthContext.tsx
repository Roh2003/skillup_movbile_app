import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import * as SecureStore from "expo-secure-store"
import { loginApi, registerApi } from "../lib/userauth.api"
import authService from "../src/services/auth.service"
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserRole = "learner" | "counsellor"

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  username: string
  phoneNo?: string
  profileImage?: string
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  signOut: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // ---------------- INITIALIZE USER ON APP START ----------------
  useEffect(() => {
    loadUserFromStorage()
  }, [])

  const loadUserFromStorage = async () => {
    try {
      console.log("📱 [AuthContext] Loading user from storage...")
      console.log("all data in asyncstorage",AsyncStorage.getAllKeys())
      const userData = await AsyncStorage.getItem('userData')
      const authToken = await AsyncStorage.getItem('authToken')
      
      if (userData && authToken) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        console.log("✅ [AuthContext] User loaded from storage:", parsedUser.email)
        
        // Optionally refresh user data from API in background
        refreshUser().catch(() => {
          console.log("⚠️ [AuthContext] Background refresh failed, using cached data")
        })
      } else {
        console.log("ℹ️ [AuthContext] No user data in storage")
      }
    } catch (error) {
      console.error("❌ [AuthContext] Error loading user from storage:", error)
    }
  }

  // ---------------- LOGIN ----------------
  const login = async (email: string, password: string) => {
    setIsLoading(true)
    console.log("api is hitting is contenct also")
    try {
      const res = await loginApi({ email, password })

      console.log("response", res)
      const { user, accessToken } = res.data.data

      await SecureStore.setItemAsync("accessToken", accessToken)

      setUser(user)
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // ---------------- REGISTER ----------------
  const register = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      const res = await registerApi(data)

      const { user } = res.data.data
      setUser(user)
        Toast.show({
          type: "success",
          text1: "Registration Successful",
          text2: "You have successfully registered."
        });
    } catch (error: any) {
      console.error("Registration failed:", error.response?.data || error.message)
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: error.response?.data?.message || error.message || "Something went wrong"
        });

      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // ---------------- LOGOUT ----------------
  const signOut = async () => {
    try {
      console.log("🚪 [AuthContext] Logging out...")
      // Clear AsyncStorage
      await AsyncStorage.clear()
      // Clear SecureStore token
      await SecureStore.deleteItemAsync("accessToken").catch(() => {})
      // Clear user state
      setUser(null)
      console.log("✅ [AuthContext] Logout successful")
    } catch (error) {
      console.error("❌ [AuthContext] Logout error:", error)
      // Still clear user state even if storage fails
      setUser(null)
    }
  }

  // Alias for consistency
  const logout = signOut

  // ---------------- REFRESH USER ----------------
  const refreshUser = async () => {
    try {
      console.log("🔄 [AuthContext] Refreshing user data...")
      const response = await authService.getProfile()
      
      if (response && response.data) {
        setUser(response.data)
        console.log("✅ [AuthContext] User data refreshed successfully")
      }
    } catch (error: any) {
      console.error("❌ [AuthContext] Failed to refresh user:", error)
      // Don't throw error, just log it - user data might be stale but still valid
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        signOut,
        logout,
        refreshUser,
        isLoading,
      }}
    >
      {children}
      <Toast />
    </AuthContext.Provider>
  )
}

// ---------------- HOOK ----------------
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
