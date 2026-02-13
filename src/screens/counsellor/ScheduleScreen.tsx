import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { Ionicons } from "@expo/vector-icons"
import consultationService from "@/services/consultation.service"
import { CustomToast } from "@/components/CustomToast"
import { useNavigation } from "@react-navigation/native"

export default function ScheduleScreen() {
  const navigation = useNavigation<any>()
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    fetchScheduledMeetings()
    
    // Update current time every second for live countdown
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const fetchScheduledMeetings = async () => {
    try {
      setLoading(true)
      const response = await consultationService.getScheduledMeetings()

      setMeetings(response.data)
    } catch (error: any) {
      console.error('Fetch scheduled meetings error:', error)
      CustomToast.show({
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
    fetchScheduledMeetings()
  }

  const getTimeUntil = (scheduledTime: string) => {
    const scheduled = new Date(scheduledTime)
    const diff = scheduled.getTime() - currentTime.getTime()

    if (diff < 0) return { text: 'Ready to join', isReady: true }

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    const timeString = `${hours.toString().padStart(2, '0')}h : ${minutes.toString().padStart(2, '0')}m : ${seconds.toString().padStart(2, '0')}s`
    
    // Meeting can be joined 5 minutes before scheduled time
    const canJoin = diff <= 5 * 60 * 1000 // 5 minutes in milliseconds

    return { text: timeString, isReady: canJoin }
  }

  const handleJoinMeeting = async (meeting: any) => {
    const now = new Date()
    const scheduled = new Date(meeting.scheduledTime)
    const timeDiff = scheduled.getTime() - now.getTime()

    // Allow joining 5 minutes before scheduled time
    if (timeDiff > 5 * 60 * 1000) {
      const minutesUntil = Math.ceil(timeDiff / (1000 * 60))
      CustomToast.show({
        type: 'info',
        text1: 'Too Early',
        text2: `Meeting can be joined ${minutesUntil - 5} minute(s) before start time`
      })
      return
    }

    navigation.navigate("CounsellorMeetingRoom", {
      meetingId: meeting.id,
      learnerName: `${meeting.user.firstName} ${meeting.user.lastName || ''}`.trim()
    })
  }

  const renderMeeting = ({ item }: any) => {
    const userName = `${item.user.firstName || ''} ${item.user.lastName || ''}`.trim() || item.user.email
    const scheduledTime = new Date(item.scheduledTime)
    const formattedDate = scheduledTime.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
    const formattedTime = scheduledTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })

    const { text: countdownText, isReady } = getTimeUntil(item.scheduledTime)

    return (
      <View style={styles.meetingCard}>
        <View style={styles.cardTop}>
          <View style={styles.dateTime}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <Text style={styles.dateText}>{formattedDate} at {formattedTime}</Text>
          </View>
          <View style={[styles.statusBadge, isReady && styles.statusBadgeReady]}>
            <View style={[styles.pulseDot, isReady && styles.pulseDotReady]} />
            <Text style={[styles.statusText, isReady && styles.statusTextReady]}>
              {isReady ? 'Ready' : 'Upcoming'}
            </Text>
          </View>
        </View>

        <View style={styles.learnerSection}>
          <View style={styles.learnerAvatar}>
            <Ionicons name="person" size={24} color={colors.primary} />
          </View>
          <View style={styles.learnerDetails}>
            <Text style={styles.learnerName}>{userName}</Text>
            <Text style={styles.meetingType}>
              {item.consultationRequest?.requestType || 'Consultation'}
            </Text>
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>45 min</Text>
          </View>
        </View>

        {item.consultationRequest?.message && (
          <View style={styles.messageBox}>
            <Text style={styles.messageLabel}>Topic:</Text>
            <Text style={styles.messageText} numberOfLines={2}>
              {item.consultationRequest.message}
            </Text>
          </View>
        )}

        <View style={[styles.countdownBox, isReady && styles.countdownBoxReady]}>
          <Text style={[styles.countdownLabel, isReady && styles.countdownLabelReady]}>
            {isReady ? 'Ready to Join!' : 'Starts in:'}
          </Text>
          <Text style={[styles.countdownTime, isReady && styles.countdownTimeReady]}>
            {countdownText}
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.joinBtn, isReady && styles.joinBtnReady]}
          onPress={() => handleJoinMeeting(item)}
          disabled={!isReady}
        >
          <Ionicons name="videocam" size={20} color="#FFFFFF" />
          <Text style={styles.joinBtnText}>
            {isReady ? 'Join Now' : 'Join Meeting'}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading schedule...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Schedule</Text>
        <Text style={styles.subtitle}>Manage your upcoming consultations</Text>
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
            <Ionicons name="calendar-clear-outline" size={60} color={colors.light.textTertiary} />
            <Text style={styles.emptyText}>No scheduled meetings</Text>
            <Text style={styles.emptySubtext}>Scheduled meetings will appear here</Text>
          </View>
        }
      />
      {/* <CustomToast /> */}
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
  },
  subtitle: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  listContent: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  meetingCard: {
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  dateTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.light.text,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.success,
  },
  learnerSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  learnerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  learnerDetails: {
    flex: 1,
  },
  learnerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.light.text,
  },
  meetingType: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  durationBadge: {
    backgroundColor: colors.light.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.light.textSecondary,
  },
  messageBox: {
    backgroundColor: colors.light.background,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  messageLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.light.textSecondary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 13,
    color: colors.light.text,
    lineHeight: 18,
  },
  countdownBox: {
    backgroundColor: "#F5F3FF",
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  countdownLabel: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 4,
  },
  countdownTime: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    fontFamily: "System",
  },
  joinBtn: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  joinBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.light.text,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.light.textTertiary,
  },
  statusBadgeReady: {
    backgroundColor: '#FEF3C7',
  },
  pulseDotReady: {
    backgroundColor: '#F59E0B',
  },
  statusTextReady: {
    color: '#D97706',
  },
  countdownBoxReady: {
    backgroundColor: '#FEF3C7',
  },
  countdownLabelReady: {
    color: '#D97706',
  },
  countdownTimeReady: {
    color: '#D97706',
  },
  joinBtnReady: {
    backgroundColor: '#10B981',
  },
})
