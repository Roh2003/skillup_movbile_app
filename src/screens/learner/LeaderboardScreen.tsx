import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Image } from "react-native"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useState, useEffect } from "react"
import { useRoute } from "@react-navigation/native"
import contestService from "@/services/contest.service"
import {CustomToast} from "@/components/CustomToast"
import { LinearGradient } from "expo-linear-gradient"

export default function LeaderboardScreen() {
  const route = useRoute<any>()
  const { contestId } = route.params

  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await contestService.getLeaderboard(contestId)
      setLeaderboard(response.data)
    } catch (error: any) {
      console.error('Fetch leaderboard error:', error)
      CustomToast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to fetch leaderboard'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchLeaderboard()
  }

  const getPodiumColor = (rank: number) => {
    switch (rank) {
      case 1: return ['#FFD700', '#FFA500'] // Gold
      case 2: return ['#C0C0C0', '#A8A8A8'] // Silver
      case 3: return ['#CD7F32', '#B8860B'] // Bronze
      default: return [colors.light.surface, colors.light.surface]
    }
  }

  const renderPodium = () => {
    const top3 = leaderboard.slice(0, 3)
    console.log("top 3", top3)
    if (top3.length === 0) return null

    return (
      <View style={styles.podiumContainer}>
        {/* 2nd Place */}
        {top3[1] && (
          <View style={[styles.podiumItem, styles.secondPlace]}>
            <LinearGradient
              colors={getPodiumColor(2)}
              style={styles.podiumAvatar}
            >
              {top3[1].user.profileImage ? (
                <Image source={{ uri: top3[1].user.profileImage }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={32} color="#FFFFFF" />
              )}
            </LinearGradient>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>2</Text>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{top3[1].user?.username || 'User'}</Text>
            <Text style={styles.podiumScore}>{top3[1].score} pts</Text>
          </View>
        )}

        {/* 1st Place */}
        {top3[0] && (
          <View style={[styles.podiumItem, styles.firstPlace]}>
            <Ionicons name="trophy" size={24} color="#FFD700" style={styles.crownIcon} />
            <LinearGradient
              colors={getPodiumColor(1)}
              style={[styles.podiumAvatar, styles.firstPlaceAvatar]}
            >
              {top3[0].user?.profileImage ? (
                <Image source={{ uri: top3[0].user.profileImage }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={40} color="#FFFFFF" />
              )}
            </LinearGradient>
            <View style={[styles.rankBadge, styles.firstRankBadge]}>
              <Text style={styles.rankText}>1</Text>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{top3[0].user?.username || 'User'}</Text>
            <Text style={styles.podiumScore}>{top3[0].score} pts</Text>
          </View>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <View style={[styles.podiumItem, styles.thirdPlace]}>
            <LinearGradient
              colors={getPodiumColor(3)}
              style={styles.podiumAvatar}
            >
              {top3[2].user?.profileImage ? (
                <Image source={{ uri: top3[2].user.profileImage }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={32} color="#FFFFFF" />
              )}
            </LinearGradient>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>3</Text>
            </View>
            <Text style={styles.podiumName} numberOfLines={1}>{top3[2].user?.username || 'User'}</Text>
            <Text style={styles.podiumScore}>{top3[2].score} pts</Text>
          </View>
        )}
      </View>
    )
  }

  const renderLeaderboardItem = ({ item, index }: any) => {
    const rank = index + 1
    const isTopThree = rank <= 3

    return (
      <View style={[styles.leaderboardItem, isTopThree && styles.topThreeItem]}>
        <View style={[styles.rankContainer, isTopThree && styles.topThreeRank]}>
          <Text style={[styles.rankNumber, isTopThree && styles.topThreeRankText]}>{rank}</Text>
        </View>
        
        <View style={styles.userInfo}>
          {item.user?.profileImage ? (
            <Image source={{ uri: item.user.profileImage }} style={styles.userAvatar} />
          ) : (
            <View style={styles.userAvatarPlaceholder}>
              <Ionicons name="person" size={20} color={colors.primary} />
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.user?.username || 'User'}</Text>
            {item.timeTaken && (
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={12} color={colors.light.textSecondary} />
                <Text style={styles.timeText}>{Math.floor(item.timeTaken / 60)}m {item.timeTaken % 60}s</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreValue, isTopThree && styles.topThreeScore]}>{item.score || 0}</Text>
          <Text style={styles.scoreLabel}>pts</Text>
        </View>
      </View>
    )
  }

  const renderTableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderTitle}>All Participants</Text>
      <View style={styles.tableHeaderRow}>
        <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>Rank</Text>
        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Participant</Text>
        <Text style={[styles.tableHeaderText, { flex: 1, textAlign: 'right' }]}>Score</Text>
      </View>
    </View>
  )

  if (loading) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading leaderboard...</Text>
        </View>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="podium" size={32} color={colors.primary} />
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Text style={styles.headerSubtitle}>{leaderboard.length} participants</Text>
      </View>

      <FlatList
        data={leaderboard}
        keyExtractor={(item: any, index) => `${item.userId}-${index}`}
        ListHeaderComponent={
          <>
            {renderPodium()}
            {leaderboard.length > 0 && renderTableHeader()}
          </>
        }
        renderItem={renderLeaderboardItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={64} color={colors.light.textTertiary} />
            <Text style={styles.emptyText}>No participants yet</Text>
            <Text style={styles.emptySubtext}>Be the first to take this contest!</Text>
          </View>
        }
      />
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
    marginTop: 12,
    fontSize: 16,
    color: colors.light.textSecondary,
  },
  header: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.light.text,
    marginTop: spacing.sm,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginTop: spacing.xs,
  },
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    gap: spacing.md,
  },
  podiumItem: {
    alignItems: 'center',
    width: 100,
  },
  firstPlace: {
    marginBottom: 20,
  },
  secondPlace: {
    marginBottom: 10,
  },
  thirdPlace: {
    marginBottom: 0,
  },
  crownIcon: {
    marginBottom: spacing.xs,
  },
  podiumAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    ...shadows.md,
  },
  firstPlaceAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  rankBadge: {
    position: 'absolute',
    top: 20,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  firstRankBadge: {
    top: 30,
  },
  rankText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.light.text,
  },
  podiumName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  podiumScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginTop: 2,
  },
  listContent: {
    padding: spacing.lg,
  },
  tableHeader: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  tableHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.light.text,
    marginBottom: spacing.md,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.light.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  topThreeItem: {
    backgroundColor: '#FFF9E6',
    borderColor: '#FFD700',
    borderWidth: 2,
    ...shadows.md,
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  topThreeRank: {
    backgroundColor: '#FFD700',
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.light.text,
  },
  topThreeRankText: {
    color: '#FFFFFF',
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.md,
  },
  userAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.light.text,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  timeText: {
    fontSize: 11,
    color: colors.light.textSecondary,
  },
  scoreContainer: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  topThreeScore: {
    fontSize: 20,
    color: '#FFD700',
  },
  scoreLabel: {
    fontSize: 10,
    color: colors.light.textSecondary,
    marginTop: 2,
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
