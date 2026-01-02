import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, StatusBar } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { Ionicons } from "@expo/vector-icons"

export default function RoleSelectionScreen() {
  const navigation = useNavigation<any>()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome to SkillUp</Text>
        <Text style={styles.subtitle}>Choose how you want to continue your journey</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("LearnerMain")} activeOpacity={0.8}>
          <View style={[styles.iconContainer, { backgroundColor: "#E0E7FF" }]}>
            <Ionicons name="school" size={40} color={colors.primary} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Login as Learner</Text>
            <Text style={styles.cardDescription}>Access courses, challenges, and expert consultations.</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.light.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("CounsellorLogin")} activeOpacity={0.8}>
          <View style={[styles.iconContainer, { backgroundColor: "#FEF3C7" }]}>
            <Ionicons name="people" size={40} color={colors.accent} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Login as Counsellor</Text>
            <Text style={styles.cardDescription}>Manage meeting requests and help learners grow.</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.light.textTertiary} />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600" }}
          style={styles.illustration}
          resizeMode="cover"
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  welcomeText: {
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
  optionsContainer: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.background,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.light.text,
    fontFamily: typography.fontFamily.bold,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginTop: 4,
    fontFamily: typography.fontFamily.regular,
  },
  footer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  illustration: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 100,
    opacity: 0.8,
  },
})
