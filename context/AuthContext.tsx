import { createContext, useContext, useState, type ReactNode } from "react"
import * as SecureStore from "expo-secure-store"
import { loginApi, registerApi } from "../lib/userauth.api"
import Toast from "react-native-toast-message";

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
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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
    await SecureStore.deleteItemAsync("accessToken")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        signOut,
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
