import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { mockChallenges } from "@/data/mockData"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

export default function ChallengesScreen() {
  const navigation = useNavigation<any>()
  const dailyChallenges = mockChallenges.filter((c) => c.type === "daily")
  const codingChallenges = mockChallenges.filter((c) => c.type === "coding")

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Challenges</Text>
        <Text style={styles.subtitle}>Improve your skills with daily problems</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Challenges</Text>
          {dailyChallenges.map((challenge: any) => (
            <TouchableOpacity
              key={challenge.id}
              style={styles.challengeCard}
              onPress={() => navigation.navigate("ChallengeDetail", { challengeId: challenge.id })}
            >
              <View style={[styles.iconBox, { backgroundColor: "#E0E7FF" }]}>
                <Ionicons name="calendar" size={24} color={colors.primary} />
              </View>
              <View style={styles.challengeInfo}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.challengeDesc}>{challenge.description}</Text>
                <View style={styles.badgeRow}>
                  <View style={styles.difficultyBadge}>
                    <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
                  </View>
                  <Text style={styles.questionCount}>{challenge.questions.length} Questions</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.light.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coding Challenges</Text>
          {codingChallenges.map((challenge) => (
            <TouchableOpacity
              key={challenge.id}
              style={styles.challengeCard}
              onPress={() => navigation.navigate("ChallengeDetail", { challengeId: challenge.id })}
            >
              <View style={[styles.iconBox, { backgroundColor: "#FEF3C7" }]}>
                <Ionicons name="code-slash" size={24} color={colors.accent} />
              </View>
              <View style={styles.challengeInfo}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.challengeDesc}>{challenge.description}</Text>
                <View style={styles.badgeRow}>
                  <View style={[styles.difficultyBadge, { backgroundColor: "#D1FAE5" }]}>
                    <Text style={[styles.difficultyText, { color: colors.success }]}>{challenge.difficulty}</Text>
                  </View>
                  <Text style={styles.questionCount}>{challenge.questions.length} Tasks</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.light.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.light.text,
    fontFamily: typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: 14,
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamily.regular,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.light.text,
    marginBottom: spacing.md,
  },
  challengeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.light.text,
  },
  challengeDesc: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "#DBEAFE",
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.primary,
  },
  questionCount: {
    fontSize: 10,
    color: colors.light.textTertiary,
  },
})
