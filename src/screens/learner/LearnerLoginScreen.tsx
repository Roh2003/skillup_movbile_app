import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { typography } from "@/theme/typography"
import { colors } from "@/theme/colors"
import { SafeAreaView } from "react-native-safe-area-context"
import Toast from "react-native-toast-message"
import authService from "@/services/auth.service"
import { useAuth } from "../../../context/AuthContext"

export default function LearnerLoginScreen() {
  const navigation = useNavigation<any>()
  const { refreshUser } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password")
      return
    }
    setLoading(true)
    try {
      console.log("🔐 Starting login process...")
      const response = await authService.learnerLogin({ email, password })
      navigation.navigate("LearnerMain")

        Toast.show({
          type: "success",
          text1: "Login successful 🎉",
          text2: "Welcome back to SkillUp",
        })
        
        // Refresh user state in AuthContext to trigger navigation
        if (refreshUser) {
          await refreshUser()
        }
    } catch (error: any) {
      console.error("Login error:", error)
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: error.response?.data?.message || "Invalid email or password",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.light.text} />
            </TouchableOpacity>
          </View>

          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <View style={styles.illustration}>
              <Ionicons name="school-outline" size={100} color={colors.primary} />
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.subtitle}>
              Lorem ipsum dolor sit amet a aconsectetur
            </Text>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="name123@gmail.com"
                  placeholderTextColor={colors.light.textTertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="********"
                    placeholderTextColor={colors.light.textTertiary}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={colors.light.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity 
                style={styles.forgotPassword}
                onPress={() => navigation.navigate("ResetPassword")}
              >
                <Text style={styles.forgotPasswordText}>Forget Password?</Text>
              </TouchableOpacity>

              {/* Sign In Button */}
              <TouchableOpacity
                style={[styles.signInButton, loading && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.signInButtonText}>SIGN IN</Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or Sign In With</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Login */}
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                <Text style={styles.socialButtonText}>Sign In with Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={20} color="#4285F4" />
                <Text style={styles.socialButtonText}>Sign In with Google</Text>
              </TouchableOpacity>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Don't Have An Account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("LearnerRegister")}>
                  <Text style={styles.footerLink}>Sign Up Here</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  illustrationContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  illustration: {
    width: 200,
    height: 200,
    backgroundColor: colors.green[50],
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.light.textSecondary,
    marginBottom: 32,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.light.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    color: colors.light.text,
    borderWidth: 1,
    borderColor: colors.green[200],
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.green[200],
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    color: colors.light.text,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: colors.primary,
  },
  signInButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.light.border,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.light.textSecondary,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.light.border,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  socialButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: colors.light.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
  },
  footerText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.light.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
  },
})
