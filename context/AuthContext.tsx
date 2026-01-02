import { createContext, useContext, useState, type ReactNode } from "react"

type UserRole = "learner" | "counsellor" | null

interface AuthContextType {
  user: any
  role: UserRole
  signIn: (userData: any, role: UserRole) => void
  login: (email: string, password: string, role: UserRole) => Promise<void>
  register: (userData: any) => Promise<void>
  signOut: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [role, setRole] = useState<UserRole>(null)
  const [isLoading, setIsLoading] = useState(false)

  const signIn = (userData: any, userRole: UserRole) => {
    setIsLoading(true)
    // Mock login logic
    setTimeout(() => {
      setUser(userData)
      setRole(userRole)
      setIsLoading(false)
    }, 1000)
  }

  const login = async (email: string, password: string, userRole: UserRole) => {
    setIsLoading(true)
    try {
      // Mock API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Mock user data - replace with actual API response
      const userData = {
        email,
        name: email.split("@")[0], // Mock name from email
      }
      
      setUser(userData)
      setRole(userRole)
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any) => {
    setIsLoading(true)
    try {
      // Mock API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // After registration, automatically sign in
      setUser(userData)
      setRole("learner") // Default to learner role for registration
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
    setRole(null)
  }

  return <AuthContext.Provider value={{ user, role, signIn, login, register, signOut, isLoading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
