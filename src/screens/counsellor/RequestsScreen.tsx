import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaProvider, Alert, ActivityIndicator, RefreshControl } from "react-native"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../../context/AuthContext"
import { useNavigation } from "@react-navigation/native"
import consultationService from "@/services/consultation.service"
import Toast from "react-native-toast-message"

export default function RequestsScreen() {
  const { user } = useAuth()
  const navigation = useNavigation<any>()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await consultationService.getCounselorRequests()

      if (response.success) {
        setRequests(response.data)
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.message || 'Failed to fetch requests'
        })
      }
    } catch (error: any) {
      console.error('Fetch requests error:', error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to fetch requests'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchRequests()
  }

  const handleAccept = async (requestId: number, learnerName: string) => {
    Alert.alert(
      "Accept Request",
      `Accept meeting request from ${learnerName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "ACCEPT",
          onPress: async () => {
            try {
              const response = await consultationService.acceptRequest(requestId)

              if (response.success) {
                Toast.show({
                  type: 'success',
                  text1: 'Request Accepted',
                  text2: 'Meeting is ready to start'
                })

                // Navigate to meeting room
                navigation.navigate("CounsellorMeetingRoom", {
                  meetingId: response.data.meetingId,
                  learnerName: learnerName,
                })

                // Refresh list
                fetchRequests()
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: response.message || 'Failed to accept request'
                })
              }
            } catch (error: any) {
              console.error('Accept request error:', error)
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || 'Failed to accept request'
              })
            }
          },
        },
      ],
    )
  }

  const handleReject = async (requestId: number, learnerName: string) => {
    Alert.alert(
      "Reject Request",
      `Reject meeting request from ${learnerName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "REJECT",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await consultationService.rejectRequest(requestId)

              if (response.success) {
                Toast.show({
                  type: 'success',
                  text1: 'Request Rejected'
                })
                fetchRequests()
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: response.message || 'Failed to reject request'
                })
              }
            } catch (error: any) {
              console.error('Reject request error:', error)
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || 'Failed to reject request'
              })
            }
          },
        },
      ],
    )
  }

  const renderRequest = ({ item }: any) => (
    <View style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.learnerInfo}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.learnerName}>
              {item.user?.username || item.user?.name || 'Learner'}
            </Text>
            <Text style={styles.requestedAt}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={[styles.typeBadge, item.requestType === 'INSTANT' && styles.instantBadge]}>
          <Ionicons 
            name={item.requestType === 'INSTANT' ? 'flash' : 'calendar'} 
            size={14} 
            color={item.requestType === 'INSTANT' ? colors.accent : colors.primary} 
          />
          <Text style={[styles.typeText, item.requestType === 'INSTANT' && styles.instantText]}>
            {item.requestType}
          </Text>
        </View>
      </View>

      {item.scheduledAt && (
        <View style={styles.scheduledTime}>
          <Ionicons name="time-outline" size={16} color={colors.primary} />
          <Text style={styles.scheduledTimeText}>
            {new Date(item.scheduledAt).toLocaleString()}
          </Text>
        </View>
      )}

      <View style={styles.messageBox}>
        <Text style={styles.messageLabel}>Message:</Text>
        <Text style={styles.messageText}>{item.message || 'No message provided'}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, styles.rejectBtn]}
          onPress={() => handleReject(item.id, item.user?.username || 'Learner')}
        >
          <Text style={styles.rejectBtnText}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.acceptBtn]}
          onPress={() => handleAccept(item.id, item.user?.username || 'Learner')}
        >
          <Text style={styles.acceptBtnText}>Accept Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  if (loading) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading requests...</Text>
        </View>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Welcome Back,</Text>
          <Text style={styles.userName}>{user?.name || user?.username || 'Counselor'}</Text>
        </View>
        <View style={styles.topBarActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Profile")}>
            <Ionicons name="person-circle-outline" size={32} color={colors.light.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Meeting Requests</Text>
        <Text style={styles.subtitle}>
          You have {requests.length} {requests.length === 1 ? 'request' : 'requests'} to review
        </Text>
      </View>

      <FlatList
        data={requests}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={renderRequest}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={colors.light.textTertiary} />
            <Text style={styles.emptyText}>No pending requests</Text>
            <Text style={styles.emptySubtext}>New meeting requests will appear here</Text>
          </View>
        }
      />
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
    marginTop: 12,
    fontSize: 16,
    color: colors.light.textSecondary,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  greeting: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.light.text,
  },
  topBarActions: {
    flexDirection: "row",
  },
  iconButton: {
    padding: spacing.xs,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
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
  },
  requestCard: {
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  requestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  learnerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  learnerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.light.text,
  },
  requestedAt: {
    fontSize: 12,
    color: colors.light.textTertiary,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  instantBadge: {
    backgroundColor: "#FFFBEB",
  },
  typeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.primary,
  },
  instantText: {
    color: colors.accent,
  },
  scheduledTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  scheduledTimeText: {
    fontSize: 14,
    color: colors.light.text,
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
    fontSize: 14,
    color: colors.light.text,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    gap: spacing.md,
  },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  rejectBtn: {
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.error,
  },
  acceptBtn: {
    backgroundColor: colors.primary,
    flex: 2,
  },
  rejectBtnText: {
    color: colors.error,
    fontWeight: "bold",
  },
  acceptBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
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
