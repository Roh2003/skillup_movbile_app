import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from "react-native"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useState, useEffect } from "react"
import contestService from "@/services/contest.service"
import Toast from "react-native-toast-message"

export default function ChallengesScreen() {
  const navigation = useNavigation<any>()
  const [contests, setContests] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchContests()
  }, [])

  const fetchContests = async () => {
    try {
      setLoading(true)
      const response = await contestService.getAllContests()
      console.log("Contests response:", response)
      
      // Backend returns {status: true, data: [...], message: "..."}
      const contestData = Array.isArray(response.data) ? response.data : []
      console.log("Contest data:", contestData)
      setContests(contestData)

    } catch (error: any) {
      console.error('Fetch contests error:', error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to fetch contests'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchContests()
  }

  const getDifficultyColor = (totalMarks: number) => {
    if (totalMarks <= 50) return { bg: '#DBEAFE', text: colors.primary }
    if (totalMarks <= 100) return { bg: '#FEF3C7', text: colors.accent }
    return { bg: '#FEE2E2', text: colors.error }
  }

  const getDifficultyLabel = (totalMarks: number) => {
    if (totalMarks <= 50) return 'Easy'
    if (totalMarks <= 100) return 'Medium'
    return 'Hard'
  }

  const isContestActive = (startTime: string, endTime: string) => {
    const now = new Date()
    const start = new Date(startTime)
    const end = new Date(endTime)
    return now >= start && now <= end
  }

  const renderContestCard = (contest: any) => {
    const difficultyColors = getDifficultyColor(contest.totalMarks || 0)
    const isActive = isContestActive(contest.startTime, contest.endTime)
    const hasAttempted = contest.hasAttempted || false
    
    const handleCardPress = () => {
      if (hasAttempted) {
        // If already attempted, go directly to leaderboard
        navigation.navigate("Leaderboard", { contestId: contest.id })
      } else {
        // Otherwise, go to contest detail to attempt
        navigation.navigate("ChallengeDetail", { contestId: contest.id })
      }
    }

    return (
      <TouchableOpacity
        key={contest.id}
        style={[styles.challengeCard, hasAttempted && styles.attemptedCard]}
        onPress={handleCardPress}
        activeOpacity={0.7}
      >
        <View style={[styles.iconBox, { backgroundColor: hasAttempted ? "#F0FDF4" : (isActive ? "#E0E7FF" : "#F3F4F6") }]}>
          <Ionicons 
            name={hasAttempted ? "checkmark-circle" : (isActive ? "trophy" : "calendar")} 
            size={24} 
            color={hasAttempted ? "#22C55E" : (isActive ? colors.primary : colors.light.textTertiary)} 
          />
        </View>
        <View style={styles.challengeInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.challengeTitle} numberOfLines={1}>{contest.title}</Text>
            {hasAttempted ? (
              <View style={styles.attemptedBadge}>
                <Ionicons name="checkmark-done" size={12} color="#22C55E" />
                <Text style={styles.attemptedText}>Completed</Text>
              </View>
            ) : isActive && (
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            )}
          </View>
          <Text style={styles.challengeDesc} numberOfLines={2}>
            {contest.description || 'Test your knowledge and skills'}
          </Text>
          <View style={styles.badgeRow}>
            {hasAttempted && contest.userAttempt?.score !== undefined && (
              <>
                <View style={styles.scoreBadge}>
                  <Ionicons name="star" size={10} color="#FFD700" />
                  <Text style={styles.scoreText}>
                    {contest.userAttempt.score}/{contest.totalMarks || 0}
                  </Text>
                </View>
                <Text style={styles.questionCount}>•</Text>
              </>
            )}
            <View style={[styles.difficultyBadge, { backgroundColor: difficultyColors.bg }]}>
              <Text style={[styles.difficultyText, { color: difficultyColors.text }]}>
                {getDifficultyLabel(contest.totalMarks || 0)}
              </Text>
            </View>
            <Text style={styles.questionCount}>
              {contest.totalMarks || 0} Points
            </Text>
            <Text style={styles.questionCount}>•</Text>
            <Text style={styles.questionCount}>
              {contest.durationMinutes || 30} mins
            </Text>
          </View>
        </View>
        <Ionicons 
          name={hasAttempted ? "podium" : "chevron-forward"} 
          size={20} 
          color={hasAttempted ? "#22C55E" : colors.light.textTertiary} 
        />
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading contests...</Text>
        </View>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Challenges</Text>
        <Text style={styles.subtitle}>Test your skills and compete with others</Text>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        {contests.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Contests</Text>
            {contests.map((contest: any) => renderContestCard(contest))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={64} color={colors.light.textTertiary} />
            <Text style={styles.emptyText}>No contests available</Text>
            <Text style={styles.emptySubtext}>Check back later for new challenges</Text>
          </View>
        )}
      </ScrollView>
      <Toast />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.light.textSecondary,
  },
  header: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.light.text,
    fontFamily: typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: 14,
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamily.regular,
    marginTop: spacing.xs,
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
  attemptedCard: {
    backgroundColor: '#F9FAFB',
    borderColor: '#22C55E',
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.light.text,
    flex: 1,
  },
  attemptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
    gap: 4,
  },
  attemptedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#22C55E',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.error,
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.error,
  },
  challengeDesc: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginBottom: spacing.xs,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  scoreText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#D97706',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  questionCount: {
    fontSize: 10,
    color: colors.light.textTertiary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.light.text,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginTop: spacing.xs,
  },
})
