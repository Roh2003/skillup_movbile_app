import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { Ionicons } from "@expo/vector-icons"
import consultationService from "@/services/consultation.service"
import Toast from "react-native-toast-message"

export default function CompletedScreen() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [meetings, setMeetings] = useState([])

  useEffect(() => {
    fetchCompletedMeetings()
  }, [])

  const fetchCompletedMeetings = async () => {
    try {
      setLoading(true)
      const response = await consultationService.getCompletedMeetings()

      if (response.success) {
        setMeetings(response.data)
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch completed meetings'
        })
      }
    } catch (error: any) {
      console.error('Fetch completed meetings error:', error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to fetch meetings'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchCompletedMeetings()
  }

  const renderMeeting = ({ item }: any) => {
    const userName = item.user?.firstName 
      ? `${item.user.firstName} ${item.user.lastName || ''}`.trim()
      : item.user?.email || 'Learner'
    
    const completedDate = new Date(item.endTime || item.createdAt)
    const duration = item.duration ? Math.floor(item.duration / 60) : 0

    return (
      <View style={styles.meetingCard}>
        <View style={styles.cardHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.userName}>{userName}</Text>
              <Text style={styles.meetingDate}>
                {completedDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            </View>
          </View>
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={styles.completedText}>Completed</Text>
          </View>
        </View>

        <View style={styles.cardStats}>
          <View style={styles.stat}>
            <Ionicons name="time-outline" size={16} color={colors.light.textSecondary} />
            <Text style={styles.statText}>{duration} min</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="calendar-outline" size={16} color={colors.light.textSecondary} />
            <Text style={styles.statText}>
              {completedDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
          {item.consultationRequest?.requestType && (
            <View style={styles.stat}>
              <Ionicons 
                name={item.consultationRequest.requestType === 'INSTANT' ? 'flash' : 'calendar'} 
                size={16} 
                color={colors.light.textSecondary} 
              />
              <Text style={styles.statText}>{item.consultationRequest.requestType}</Text>
            </View>
          )}
        </View>

        {item.consultationRequest?.message && (
          <View style={styles.messageBox}>
            <Text style={styles.messageLabel}>Topic:</Text>
            <Text style={styles.messageText} numberOfLines={2}>
              {item.consultationRequest.message}
            </Text>
          </View>
        )}
      </View>
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading completed consultations...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Completed Consultations</Text>
        <Text style={styles.subtitle}>
          {meetings.length} consultation{meetings.length !== 1 ? 's' : ''} completed
        </Text>
      </View>

      <FlatList
        data={meetings}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderMeeting}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-done-circle-outline" size={64} color={colors.light.textTertiary} />
            <Text style={styles.emptyText}>No completed consultations yet</Text>
            <Text style={styles.emptySubtext}>Completed meetings will appear here</Text>
          </View>
        }
      />
      <Toast />
    </SafeAreaView>
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
  listContent: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  meetingCard: {
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.light.text,
  },
  meetingDate: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  completedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.success,
  },
  cardStats: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: colors.light.textSecondary,
  },
  messageBox: {
    backgroundColor: colors.light.background,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginTop: spacing.sm,
  },
  messageLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.light.textSecondary,
    marginBottom: 2,
  },
  messageText: {
    fontSize: 13,
    color: colors.light.text,
    lineHeight: 18,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
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
