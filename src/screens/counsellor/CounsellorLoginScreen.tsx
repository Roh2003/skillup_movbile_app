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
import authService from "@/services/auth.service"

export default function CounsellorLoginScreen() {
  const navigation = useNavigation<any>()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your professional credentials")
      return
    }

    setLoading(true)
    try {
      const response = await authService.counselorLogin({ email, password })
      console.log("response", response)

      // Token is already stored by authService.counselorLogin in AsyncStorage
      // No need to store it again here
        
      Alert.alert("Success", "Login successful!", [
        {
          text: "OK",
          onPress: () => navigation.replace("CounsellorMain")
        }
      ])
    } catch (error: any) {
      console.error("Login error:", error)
      Alert.alert(
        "Login Failed", 
        error.response?.data?.message || "Invalid credentials or account not approved"
      )
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
              <Ionicons name="people-outline" size={100} color="#F59E0B" />
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Professional Portal</Text>
            </View>
            <Text style={styles.title}>Counsellor Login</Text>
            <Text style={styles.subtitle}>
              Welcome, professional! Access your dashboard to manage learner requests.
            </Text>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Professional Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="name@professional.com"
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
                    placeholder="Enter password"
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

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, loading && { opacity: 0.7 }]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.loginButtonText}>SIGN IN</Text>
                )}
              </TouchableOpacity>

              {/* Info Box */}
              <View style={styles.infoBox}>
                <Ionicons name="information-circle-outline" size={20} color={colors.light.textTertiary} />
                <Text style={styles.infoText}>
                  Counsellor accounts are created and managed by the Skillify Admin panel.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    backgroundColor: "#FEF3C7",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  badgeText: {
    color: "#F59E0B",
    fontSize: 12,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.5,
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
    lineHeight: 20,
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
  loginButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: colors.light.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 40,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: typography.fontFamily.regular,
    color: colors.light.textSecondary,
    lineHeight: 18,
  },
})
