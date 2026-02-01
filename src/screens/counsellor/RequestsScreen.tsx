import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, Switch, Image } from "react-native"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../../context/AuthContext"
import { useNavigation } from "@react-navigation/native"
import consultationService from "@/services/consultation.service"
import Toast from "react-native-toast-message"
import { SafeAreaView } from "react-native-safe-area-context"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function RequestsScreen() {
  const { user } = useAuth()
  const navigation = useNavigation<any>()

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({})
  const [refreshing, setRefreshing] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const [togglingStatus, setTogglingStatus] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  useEffect(() => {
    fetchRequests()
    fetchProfile()
    // clearAllAsyncStorage()
  }, [])

  const clearAllAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('✅ AsyncStorage completely cleared');
  } catch (error) {
    console.error('❌ Failed to clear AsyncStorage', error);
  }
};

const logAllAsyncStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const data = await AsyncStorage.multiGet(keys);

    console.log('🔐 AsyncStorage FULL DATA ↓↓↓');
    data.forEach(([key, value]) => {
      console.log(`${key} =>`, value);
    });
  } catch (error) {
    console.error('Error reading AsyncStorage', error);
  }
};

  const fetchProfile = async () => {
    try {
      console.log("fetch profile calling")
      const response = await consultationService.getCounselorProfile()
      console.log("response", response)
      setData(response.data)
        setIsOnline(response.data.isActive)
        setProfileImage(response.data.profileImage)
      
    } catch (error) {
      console.error('Fetch profile error:', error)
    }
  }

  const fetchRequests = async () => {
    try {
      logAllAsyncStorage()
      setLoading(true)
      const response = await consultationService.getCounselorRequests()
      setRequests(response.requests)

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

  const toggleOnlineStatus = async () => {
    try {
      setTogglingStatus(true)
      const newStatus = !isOnline
      const response = await consultationService.toggleAvailability(newStatus)


        setIsOnline(response.data.isActive)
        Toast.show({
          type: 'success',
          text1: newStatus ? 'You are now Online' : 'You are now Offline',
          text2: newStatus ? 'You can receive consultation requests' : 'You won\'t receive new requests'
        })

    } catch (error: any) {
      console.error('Toggle status error:', error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update status'
      })
    } finally {
      setTogglingStatus(false)
    }
  }

  const handleAccept = async (requestId: number, learnerName: string, requestType: string, scheduledAt?: string) => {
    const isScheduled = requestType === 'SCHEDULED'
    const alertTitle = isScheduled ? "Accept Scheduled Meeting?" : "Accept Request"
    const alertMessage = isScheduled 
      ? `Accept meeting with ${learnerName} scheduled for ${scheduledAt ? new Date(scheduledAt).toLocaleString() : 'later'}?`
      : `Accept instant meeting request from ${learnerName}?`

    Alert.alert(
      alertTitle,
      alertMessage,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "ACCEPT",
          onPress: async () => {
            try {
              const response = await consultationService.acceptRequest(requestId)

              if (isScheduled) {
                // For scheduled meetings, just show confirmation - don't navigate to meeting room yet
                Toast.show({
                  type: 'success',
                  text1: 'Scheduled Meeting Accepted',
                  text2: `Meeting scheduled for ${scheduledAt ? new Date(scheduledAt).toLocaleDateString() : 'later'}. Join from Schedule tab when time comes.`
                })
              } else {
                // For instant meetings, navigate immediately
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
              }

                // Refresh list
                fetchRequests()
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
                Toast.show({
                  type: 'success',
                  text1: 'Request Rejected'
                })
                fetchRequests()
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

  const renderRequest = ({ item }: any) => {
    const userName = item.user?.firstName 
      ? `${item.user.firstName} ${item.user.lastName || ''}`.trim()
      : item.user?.email || 'Learner'
    
    return (
      <View style={styles.requestCard}>
        <View style={styles.requestHeader}>
          <View style={styles.learnerInfo}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.learnerName}>
                {userName}
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
            onPress={() => handleReject(item.id, userName)}
          >
            <Text style={styles.rejectBtnText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.acceptBtn]}
            onPress={() => handleAccept(item.id, userName, item.requestType, item.scheduledAt)}
          >
            <Text style={styles.acceptBtnText}>Accept Request</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading requests...</Text>
        </View>
      </SafeAreaView>
    )
  }

  console.log("data", data)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Welcome Back,</Text>
          <Text style={styles.userName}>{data?.name || 'Counselor'}</Text>
        </View>
        <View style={styles.topBarActions}>
          <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate("Profile")}>
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Ionicons name="person" size={24} color={colors.primary} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Online/Offline Toggle */}
      <View style={styles.statusCard}>
        <View style={styles.statusLeft}>
          <View style={[styles.statusDot, isOnline && styles.statusDotOnline]} />
          <View>
            <Text style={styles.statusLabel}>Availability Status</Text>
            <Text style={[styles.statusValue, isOnline && styles.statusValueOnline]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
        <Switch
          value={isOnline}
          onValueChange={toggleOnlineStatus}
          disabled={togglingStatus}
          trackColor={{ false: colors.light.border, true: colors.success }}
          thumbColor={isOnline ? '#FFFFFF' : '#f4f3f4'}
        />
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
  profileButton: {
    padding: spacing.xs,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  profilePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.error,
  },
  statusDotOnline: {
    backgroundColor: colors.success,
  },
  statusLabel: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.error,
  },
  statusValueOnline: {
    color: colors.success,
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
