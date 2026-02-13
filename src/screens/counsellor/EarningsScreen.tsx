import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, RefreshControl } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { Ionicons } from "@expo/vector-icons"
import consultationService from "@/services/consultation.service"
import { CustomToast } from "@/components/CustomToast"

const { width } = Dimensions.get("window")

export default function EarningsScreen() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [revenueData, setRevenueData] = useState<any>(null)
  const [selectedFilter, setSelectedFilter] = useState(0)

  useEffect(() => {
    fetchRevenue()
  }, [])

  const fetchRevenue = async () => {
    try {
      setLoading(true)
      const response = await consultationService.getCounselorRevenue()

      if (response.success) {
        setRevenueData(response.data)
      } else {
        CustomToast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to fetch revenue data'
        })
      }
    } catch (error: any) {
      console.error('Fetch revenue error:', error)
      CustomToast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to fetch revenue'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchRevenue()
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading earnings...</Text>
        </View>
      </SafeAreaView>
    )
  }

  const totalEarnings = revenueData?.totalRevenue || 0
  const totalMeetings = revenueData?.totalMeetings || 0
  const meetings = revenueData?.meetings || []
  const revenuePerMeeting = revenueData?.revenuePerMeeting || 200

  return (
    <SafeAreaView style={styles.container}>
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
        <View style={styles.header}>
          <Text style={styles.title}>Earnings Dashboard</Text>
          <Text style={styles.subtitle}>Track your performance and revenue</Text>
        </View>

        {/* Total Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#E0E7FF" }]}>
              <Ionicons name="wallet" size={24} color={colors.primary} />
            </View>
            <Text style={styles.statLabel}>Total Revenue</Text>
            <Text style={styles.statValue}>₹{totalEarnings}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#ECFDF5" }]}>
              <Ionicons name="checkmark-done" size={24} color={colors.success} />
            </View>
            <Text style={styles.statLabel}>Meetings</Text>
            <Text style={styles.statValue}>{totalMeetings}</Text>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterBar}>
          {["All Time", "This Month", "This Week"].map((filter, i) => (
            <TouchableOpacity 
              key={filter} 
              style={[styles.filterBtn, selectedFilter === i && styles.activeFilter]}
              onPress={() => setSelectedFilter(i)}
            >
              <Text style={[styles.filterText, selectedFilter === i && styles.activeFilterText]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Performance Chart Mock */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Revenue Growth</Text>
          <View style={styles.mockChart}>
            {/* Mock visual representation of earnings */}
            {meetings.length > 0 ? (
              meetings.slice(0, 7).map((m: any, i: number) => (
                <View key={i} style={[styles.chartBar, { height: 40 + (i * 10) }]} />
              ))
            ) : (
              [40, 50, 45, 60, 55, 70, 65].map((h, i) => (
                <View key={i} style={[styles.chartBar, { height: h }]} />
              ))
            )}
          </View>
          <View style={styles.chartLabels}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((l) => (
              <Text key={l} style={styles.chartLabel}>
                {l}
              </Text>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Earnings</Text>
          {meetings.length > 0 ? (
            meetings.slice(0, 10).map((meeting: any) => (
              <View key={meeting.id} style={styles.transactionCard}>
                <View style={styles.transIcon}>
                  <Ionicons name="cash-outline" size={20} color={colors.success} />
                </View>
                <View style={styles.transDetails}>
                  <Text style={styles.transLearner}>{meeting.userName}</Text>
                  <Text style={styles.transDate}>
                    {new Date(meeting.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </Text>
                </View>
                <Text style={styles.transAmount}>+₹{meeting.revenue}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptySection}>
              <Ionicons name="wallet-outline" size={48} color={colors.light.textTertiary} />
              <Text style={styles.emptyText}>No earnings yet</Text>
              <Text style={styles.emptySubtext}>Complete consultations to start earning</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: spacing.xxl,
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
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.light.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.light.text,
  },
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light.surface,
  },
  activeFilter: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.light.textSecondary,
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  chartContainer: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: spacing.lg,
  },
  mockChart: {
    height: 120,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  chartBar: {
    width: 15,
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  chartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingHorizontal: 5,
  },
  chartLabel: {
    fontSize: 10,
    color: colors.light.textTertiary,
  },
  section: {
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: spacing.md,
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  transIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  transDetails: {
    flex: 1,
  },
  transLearner: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.light.text,
  },
  transDate: {
    fontSize: 12,
    color: colors.light.textTertiary,
  },
  transAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.success,
  },
  emptySection: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.light.text,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.light.textTertiary,
    marginTop: spacing.xs,
  },
})
