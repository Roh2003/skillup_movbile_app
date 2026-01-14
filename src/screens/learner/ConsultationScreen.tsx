
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl, Image } from "react-native"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useState, useEffect } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import counselorService from "@/services/counselor.service"
import Toast from "react-native-toast-message"

export default function ConsultationScreen() {
  const navigation = useNavigation<any>()
  const [searchQuery, setSearchQuery] = useState("")
  const [counselors, setCounselors] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchCounselors()
  }, [])

  const fetchCounselors = async () => {
    try {
      setLoading(true)
      const response = await counselorService.getAllCounselors()
      

      setCounselors(response.data)

    } catch (error: any) {
      console.error('Fetch counselors error:', error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to fetch counselors'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchCounselors()
  }

  const filteredCounselors = counselors.filter((c: any) =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleVideoCall = (counselor: any) => {
    if (!counselor.isActive) {
      Toast.show({
        type: 'info',
        text1: 'Counselor Offline',
        text2: 'This counselor is currently not available'
      })
      return
    }
    
    // Navigate to meeting request screen
    navigation.navigate("MeetingRequest", { 
      counselor,
      meetingType: 'INSTANT'
    })
  }

  const handleSchedule = (counselor: any) => {
    // Navigate to meeting request screen with scheduled type
    navigation.navigate("MeetingRequest", { 
      counselor,
      meetingType: 'SCHEDULED'
    })
  }

  const renderCounselorCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.counsellorCard}
      activeOpacity={0.9}
      onPress={() => navigation.navigate("CounselorProfile", { counselor: item })}
    >
      <View style={styles.avatarContainer}>
        {item.profileImage ? (
          <Image 
            source={{ uri: item.profileImage }} 
            style={styles.avatar}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={32} color={colors.primary} />
          </View>
        )}
        <View
          style={[
            styles.statusDot,
            { backgroundColor: item.isActive ? colors.success : colors.light.textTertiary },
          ]}
        />
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.name}</Text>
          {item.rating && (
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color={colors.accent} />
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            </View>
          )}
        </View>
        <Text style={styles.specialization}>{item.specialization}</Text>
        {item.experience && (
          <Text style={styles.experience}>{item.experience} years experience</Text>
        )}

        {/* Status Badge */}
        <View style={styles.statusBadge}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: item.isActive ? colors.success : colors.light.textTertiary }
          ]} />
          <Text style={[
            styles.statusText,
            { color: item.isActive ? colors.success : colors.light.textSecondary }
          ]}>
            {item.isActive ? 'ONLINE' : 'OFFLINE'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  if (loading && !refreshing) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading counselors...</Text>
        </View>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Consult Experts</Text>
        <Text style={styles.subtitle}>Get professional guidance for your career</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.light.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search counsellors or specialties..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.light.textTertiary}
          />
        </View>
      </View>

      <FlatList
        data={filteredCounselors}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderCounselorCard}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={colors.light.textTertiary} />
            <Text style={styles.emptyText}>No counselors found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search</Text>
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
    marginBottom: spacing.md,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.surface,
    paddingHorizontal: spacing.md,
    height: 50,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    ...shadows.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16,
    color: colors.light.text,
  },
  listContent: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  counsellorCard: {
    flexDirection: "row",
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  avatarContainer: {
    marginRight: spacing.md,
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  statusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.light.text,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.accent,
  },
  specialization: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
    marginTop: 2,
  },
  experience: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginTop: 2,
  },
  actions: {
    flexDirection: "row",
    marginTop: spacing.md,
    gap: spacing.md,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: borderRadius.md,
    backgroundColor: "#F5F3FF",
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
  },
  actionBtnDisabled: {
    backgroundColor: colors.light.surface,
    borderColor: colors.light.border,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.primary,
  },
  actionTextDisabled: {
    color: colors.light.textTertiary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: 6,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
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
