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
import { useGoogleAuth } from '@/services/googleAuth.service';

export default function LearnerRegisterScreen() {
  const navigation = useNavigation<any>()

  const [formData, setFormData] = useState({
      firstName : "",
      lastName : "",
      phoneNo: "",
      email: "",
      username: "",
      password : "",
      confirmPassword : ""
  })

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const updateForm = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleRegister = async () => {
    const { firstName, lastName, email, username, password, phoneNo , confirmPassword} = formData

    if (!firstName || !lastName || !email || !password || !username || !phoneNo) {
      Alert.alert("Error", "Please fill required fields")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const { confirmPassword, ...registerData } = formData
      console.log("🔐 Starting registration process...")
      const response = await authService.learnerRegister(registerData)
      
      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Registration successful 🎉",
          text2: "You can now log in to your account",
        })
        navigation.navigate("LearnerLogin")
      } else {
        Toast.show({
          type: "error",
          text1: "Registration failed",
          text2: response.message || "Something went wrong",
        })
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2: error.response?.data?.message || error.message || "Something went wrong",
      })
    } finally {
      setLoading(false)
    }
  }

  const { request, response, promptAsync } = useGoogleAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignUp = async () => {
    try {
      setGoogleLoading(true);
      const result = await promptAsync();
      
      console.log("🔐 Google auth result:", result);
      
      if (result?.type === 'success' && result.authentication?.accessToken) {
        // Fetch user info from Google using the access token
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/userinfo/v2/me',
          {
            headers: { Authorization: `Bearer ${result.authentication.accessToken}` },
          }
        );
        
        const googleUser = await userInfoResponse.json();
        console.log("👤 Google user info:", googleUser);
        
        // Call backend API to register/login with Google
        const response = await authService.googleLogin({
          idToken: result.authentication.idToken || '',
          email: googleUser.email,
          firstName: googleUser.given_name || googleUser.name?.split(' ')[0] || '',
          lastName: googleUser.family_name || googleUser.name?.split(' ')[1] || '',
          googleId: googleUser.id,
          profileImage: googleUser.picture,
        });
        
        if (response.success) {
          Toast.show({
            type: "success",
            text1: "Google Sign-Up successful 🎉",
            text2: "Welcome to SkillUp!",
          });
          navigation.navigate("LearnerMain");
        } else {
          Toast.show({
            type: "error",
            text1: "Sign-Up failed",
            text2: response.message || "Something went wrong",
          });
        }
      } else if (result?.type === 'cancel') {
        console.log("🚫 User cancelled Google sign-in");
      } else {
        Toast.show({
          type: "error",
          text1: "Google Sign-Up failed",
          text2: "Could not authenticate with Google",
        });
      }
    } catch (error: any) {
      console.error("❌ Google sign-up error:", error);
      Toast.show({
        type: "error",
        text1: "Google Sign-Up failed",
        text2: error.message || "Something went wrong",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

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
              <Ionicons name="person-add-outline" size={50} color={colors.primary} />
            </View>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>
              Begin your learning adventure—create your free account today!
            </Text>

            {/* Form */}
            <View style={styles.form}>
              {/* first Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your first Name "
                  placeholderTextColor={colors.light.textTertiary}
                  value={formData.firstName}
                  onChangeText={(v) => updateForm("firstName", v)}
                />
              </View>
              { /* last name */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your last Name "
                  placeholderTextColor={colors.light.textTertiary}
                  value={formData.lastName}
                  onChangeText={(v) => updateForm("lastName", v)}
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Contact@gmail.com"
                  placeholderTextColor={colors.light.textTertiary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(v) => updateForm("email", v)}
                />
              </View>

              {/* Username Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your username"
                  placeholderTextColor={colors.light.textTertiary}
                  autoCapitalize="none"
                  value={formData.username}
                  onChangeText={(v) => updateForm("username", v)}
                /> 
              </View>

              {/* Phone Number Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 08012345678"
                  placeholderTextColor={colors.light.textTertiary}
                  keyboardType="phone-pad"
                  value={formData.phoneNo}
                  onChangeText={(v) => updateForm("phoneNo", v)}
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
                    value={formData.password}
                    onChangeText={(v) => updateForm("password", v)}
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

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="********"
                    placeholderTextColor={colors.light.textTertiary}
                    secureTextEntry={!showConfirmPassword}
                    value={formData.confirmPassword}
                    onChangeText={(v) => updateForm("confirmPassword", v)}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons
                      name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={colors.light.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[styles.signUpButton, loading && { opacity: 0.7 }]}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.signUpButtonText}>SIGN UP</Text>
                )}
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Or Sign Up With</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Social Signup */}
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                <Text style={styles.socialButtonText}>Sign Up with Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.socialButton, (googleLoading || !request) && { opacity: 0.7 }]}
                onPress={handleGoogleSignUp}
                disabled={!request || googleLoading}
              >
                {googleLoading ? (
                  <ActivityIndicator size="small" color="#4285F4" />
                ) : (
                  <Ionicons name="logo-google" size={20} color="#4285F4" />
                )}
                <Text style={styles.socialButtonText}>
                  {googleLoading ? "Signing up..." : "Sign Up with Google"}
                </Text>
              </TouchableOpacity>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already Have An Account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("LearnerLogin")}>
                  <Text style={styles.footerLink}>Sign In Here</Text>
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
    paddingVertical: 10,
  },
  illustration: {
    width: 100,
    height: 100,
    backgroundColor: colors.green[50],
    borderRadius: 50,
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
  signUpButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  signUpButtonText: {
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
