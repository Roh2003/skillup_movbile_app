
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../../../context/AuthContext"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { Ionicons } from "@expo/vector-icons"

export default function LearnerRegisterScreen() {
  const navigation = useNavigation<any>()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    skills: "",
    interestedField: "",
    careerGoal: "",
  })
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    const { name, email, password, confirmPassword } = formData

    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    setLoading(true)
    try {
      await register({
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()),
      })
    } catch (error) {
      Alert.alert("Registration Failed", "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const updateForm = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.light.text} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join SkillUp to start your learning journey.</Text>
          </View>

          <View style={styles.form}>
            {/* Basic Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  value={formData.name}
                  onChangeText={(v) => updateForm("name", v)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(v) => updateForm("email", v)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+1 234 567 890"
                  keyboardType="phone-pad"
                  value={formData.mobile}
                  onChangeText={(v) => updateForm("mobile", v)}
                />
              </View>
            </View>

            {/* Career Goals */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Learning Preferences</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Skills (comma separated)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Python, Java, Design..."
                  value={formData.skills}
                  onChangeText={(v) => updateForm("skills", v)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Interested Field</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Data Science"
                  value={formData.interestedField}
                  onChangeText={(v) => updateForm("interestedField", v)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>What do you want to become?</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. AI Engineer"
                  value={formData.careerGoal}
                  onChangeText={(v) => updateForm("careerGoal", v)}
                />
              </View>
            </View>

            {/* Security */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Security</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(v) => updateForm("password", v)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Repeat your password"
                  secureTextEntry
                  value={formData.confirmPassword}
                  onChangeText={(v) => updateForm("confirmPassword", v)}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.registerButton, loading && styles.disabledButton]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.registerButtonText}>Register</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("LearnerLogin")}>
                <Text style={styles.footerLink}>Login</Text>
              </TouchableOpacity>
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
    backgroundColor: colors.light.background,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.light.text,
    fontFamily: typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: 16,
    color: colors.light.textSecondary,
    marginTop: spacing.sm,
    fontFamily: typography.fontFamily.regular,
  },
  form: {
    gap: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    gap: spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.light.text,
    fontFamily: typography.fontFamily.medium,
  },
  input: {
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 52,
    color: colors.light.text,
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
  },
  registerButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.md,
    ...shadows.md,
  },
  disabledButton: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: typography.fontFamily.bold,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  footerText: {
    color: colors.light.textSecondary,
    fontSize: 14,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: "bold",
    fontSize: 14,
  },
})
