import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useState, useEffect } from "react"
import counselorService from "@/services/counselor.service"
import { CustomToast } from "@/components/CustomToast"
type TabType = 'PENDING' | 'SCHEDULED' | 'COMPLETED'

export default function MyConsultationsScreen() {
  const navigation = useNavigation<any>()
  const [activeTab, setActiveTab] = useState<TabType>('PENDING')
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchMeetings()
  }, [activeTab])

  const fetchMeetings = async () => {
    try {
      setLoading(true)
      const response = await counselorService.getMyMeetings(activeTab)
      console.log("response: ", response)
      setMeetings(response.data || [])
      console.log("meetings: ", meetings)
    } catch (error: any) {
      console.error('Fetch meetings error:', error)
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
    fetchMeetings()
  }

  const handleJoinMeeting = (meeting: any) => {
    // Check if meeting is ready to join
    const now = new Date()
    const meetingTime = new Date(meeting.scheduledTime || meeting.createdAt)
    
    if (meeting.status === 'SCHEDULED' && now < meetingTime) {
      const waitMinutes = Math.ceil((meetingTime.getTime() - now.getTime()) / 60000)
      CustomToast.show({
        type: 'info',
        text1: 'Too Early',
        text2: `Meeting starts in ${waitMinutes} minute(s)`
      })
      return
    }

    if (meeting.status === 'COMPLETED') {
      navigation.navigate('MeetingSummary', { meeting })
      return
    }

    // Navigate to waiting room
    navigation.navigate('WaitingRoom', { meetingId: meeting.id })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_REQUEST': return '#FF9800' // Orange for pending requests
      case 'PENDING': return colors.accent
      case 'SCHEDULED': return colors.primary
      case 'ONGOING': return colors.success
      case 'COMPLETED': return colors.light.textSecondary
      case 'CANCELLED': return colors.error
      default: return colors.light.textTertiary
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING_REQUEST': return 'hourglass-outline' // Waiting for acceptance
      case 'PENDING': return 'time-outline'
      case 'SCHEDULED': return 'calendar-outline'
      case 'ONGOING': return 'videocam'
      case 'COMPLETED': return 'checkmark-circle'
      case 'CANCELLED': return 'close-circle'
      default: return 'help-circle-outline'
    }
  }

  const canJoin = (meeting: any) => {
    // Pending requests cannot be joined (not accepted yet)
    if (meeting.type === 'request' || meeting.status === 'PENDING_REQUEST') {
      return false
    }
    
    if (meeting.status === 'COMPLETED' || meeting.status === 'CANCELLED') {
      return false
    }
    
    if (meeting.status === 'SCHEDULED') {
      const now = new Date()
      const meetingTime = new Date(meeting.scheduledTime)
      return now >= meetingTime
    }
    
    return true // PENDING or ONGOING
  }

  const renderMeetingCard = ({ item }: any) => (
    <TouchableOpacity 
      style={styles.meetingCard}
      onPress={() => handleJoinMeeting(item)}
      activeOpacity={0.7}
    >
      <View style={styles.meetingHeader}>
        <View style={styles.counselorInfo}>
          <Ionicons name="person-circle" size={40} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.counselorName}>{item.counselor.name}</Text>
            <Text style={styles.specialization}>{item.counselor.specialization}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Ionicons name={getStatusIcon(item.status) as any} size={16} color={getStatusColor(item.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.meetingDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.light.textSecondary} />
          <Text style={styles.detailText}>
            {item.scheduledTime ? formatDate(item.scheduledTime) : formatDate(item.createdAt)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="document-text-outline" size={16} color={colors.light.textSecondary} />
          <Text style={styles.detailText}>
            {item.consultationRequest?.requestType || 'Consultation'}
          </Text>
        </View>
      </View>

      {item.consultationRequest?.message && (
        <Text style={styles.messageText} numberOfLines={2}>
          {item.consultationRequest.message}
        </Text>
      )}

      {/* Action Button */}
      <TouchableOpacity 
        style={[
          styles.actionButton,
          !canJoin(item) && styles.actionButtonDisabled
        ]}
        onPress={() => handleJoinMeeting(item)}
        disabled={!canJoin(item)}
      >
        <Ionicons 
          name={item.status === 'COMPLETED' ? 'eye-outline' : 'videocam'} 
          size={18} 
          color={canJoin(item) ? '#FFFFFF' : colors.light.textTertiary}
        />
        <Text style={[
          styles.actionButtonText,
          !canJoin(item) && styles.actionButtonTextDisabled
        ]}>
          {item.status === 'PENDING_REQUEST' ? 'Awaiting Approval' :
           item.status === 'COMPLETED' ? 'View Summary' : 
           item.status === 'CANCELLED' ? 'Cancelled' :
           canJoin(item) ? 'Join Meeting' : 'Starts Soon'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )

  const tabs = [
    { key: 'PENDING' as TabType, label: 'Pending', icon: 'time-outline' },
    { key: 'SCHEDULED' as TabType, label: 'Upcoming', icon: 'calendar-outline' },
    { key: 'COMPLETED' as TabType, label: 'Completed', icon: 'checkmark-circle' },
  ]

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Consultations</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Ionicons name="refresh" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Ionicons 
              name={tab.icon as any} 
              size={20} 
              color={activeTab === tab.key ? colors.primary : colors.light.textSecondary}
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.key && styles.tabTextActive
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading meetings...</Text>
        </View>
      ) : (
        <FlatList
          data={meetings}
          keyExtractor={(item: any) => item.id}
          renderItem={renderMeetingCard}
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
              <Ionicons 
                name={
                  activeTab === 'PENDING' ? 'time-outline' :
                  activeTab === 'SCHEDULED' ? 'calendar-outline' :
                  'checkmark-circle-outline'
                } 
                size={64} 
                color={colors.light.textTertiary} 
              />
              <Text style={styles.emptyText}>No {activeTab.toLowerCase()} meetings</Text>
              <Text style={styles.emptySubtext}>
                {activeTab === 'PENDING' && 'Pending requests will appear here'}
                {activeTab === 'SCHEDULED' && 'Your upcoming meetings will appear here'}
                {activeTab === 'COMPLETED' && 'Your completed consultations will appear here'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.light.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
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
  listContent: {
    padding: spacing.lg,
  },
  meetingCard: {
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  meetingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  counselorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  counselorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.light.text,
  },
  specialization: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  meetingDetails: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 13,
    color: colors.light.textSecondary,
  },
  messageText: {
    fontSize: 13,
    color: colors.light.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
  },
  actionButtonDisabled: {
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionButtonTextDisabled: {
    color: colors.light.textTertiary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 3,
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
    textAlign: 'center',
  },
})
