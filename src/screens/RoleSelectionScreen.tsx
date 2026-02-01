import React from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { typography } from "@/theme/typography"
import { colors } from "@/theme/colors"
import { SafeAreaView } from "react-native-safe-area-context"

export default function RoleSelectionScreen() {
  const navigation = useNavigation<any>()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HERO */}
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="school" size={48} color="#FFFFFF" />
          </View>
          <Text style={styles.heroTitle}>Welcome to SkillUp by rohit</Text>
          <Text style={styles.heroSubtitle}>
            Choose your role to continue
          </Text>
        </View>
      </LinearGradient>

      {/* OPTIONS */}
      <View style={styles.optionsContainer}>
        {/* Learner Card */}
        <TouchableOpacity
          style={styles.learnerCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Welcome")}
        >
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Ionicons name="school" size={32} color={colors.primary} />
            </View>
            <View style={styles.cardBadge}>
              <Text style={styles.badgeText}>Learners</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Continue as Learner</Text>
            <Text style={styles.cardDescription}>
              Access courses, challenges, and expert consultations to enhance your skills.
            </Text>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.cardFooterText}>Sign In or Sign Up</Text>
            <Ionicons
              name="arrow-forward-circle"
              size={24}
              color={colors.primary}
            />
          </View>
        </TouchableOpacity>

        {/* Counsellor Card */}
        <TouchableOpacity
          style={styles.counsellorCard}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("CounsellorLogin")}
        >
          <View style={styles.cardHeader}>
            <View style={styles.counsellorIconContainer}>
              <Ionicons name="people" size={32} color="#F59E0B" />
            </View>
            <View style={styles.counsellorBadge}>
              <Text style={styles.counsellorBadgeText}>Professional</Text>
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Continue as Counsellor</Text>
            <Text style={styles.cardDescription}>
              Guide learners, manage sessions, and help others achieve their goals.
            </Text>
          </View>

          <View style={styles.cardFooter}>
            <Text style={styles.counsellorFooterText}>Sign In Only</Text>
            <Ionicons
              name="arrow-forward-circle"
              size={24}
              color="#F59E0B"
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  hero: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroContent: {
    alignItems: "center",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 28,
    color: "#FFFFFF",
    fontFamily: typography.fontFamily.bold,
    marginBottom: 8,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontFamily: typography.fontFamily.regular,
    textAlign: "center",
  },
  optionsContainer: {
    flex: 1,
    padding: 24,
    gap: 20,
  },
  learnerCard: {
    backgroundColor: colors.green[50],
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  counsellorCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "#FEF3C7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  counsellorIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
  },
  cardBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  counsellorBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  counsellorBadgeText: {
    color: "#F59E0B",
    fontSize: 12,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  cardContent: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: typography.fontFamily.regular,
    color: colors.light.textSecondary,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.green[200],
  },
  cardFooterText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
    color: colors.primary,
  },
  counsellorFooterText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
    color: "#F59E0B",
  },
})
