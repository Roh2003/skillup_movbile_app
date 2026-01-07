import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { Ionicons } from "@expo/vector-icons"
import LottieView from "lottie-react-native"

export default function WelcomeScreen() {
  const navigation = useNavigation<any>()

  return (
    <SafeAreaView style={styles.container}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.illustration}>
          <LottieView
            source={require("../../public/Isometric-data-analysis.json")}
            autoPlay
            loop
            style={{ width: 250, height: 240 }}
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Join SkillUp To Start Your Learning Adventure</Text>
        <Text style={styles.description}>
          Learn new skills, connect with mentors, and unlock your potential.
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.signInButton}
            onPress={() => navigation.navigate("LearnerLogin")}
          >
            <Text style={styles.signInButtonText}>SIGN IN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate("LearnerRegister")}
          >
            <Text style={styles.signUpButtonText}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  illustrationContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  illustration: {
    width: 280,
    height: 280,
    backgroundColor: colors.green[50],
    borderRadius: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 0.5,
    paddingHorizontal: 24,
    paddingBottom: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 32,
  },
  description: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
  signInButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  signInButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  signUpButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  signUpButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
})

