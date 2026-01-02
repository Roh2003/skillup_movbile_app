import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Dimensions } from "react-native"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { Ionicons } from "@expo/vector-icons"
import { mockCompletedMeetings } from "@/data/mockData"

const { width } = Dimensions.get("window")

export default function EarningsScreen() {
  const totalEarnings = mockCompletedMeetings.reduce((sum, m) => sum + (m.earnings || 0), 0)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
            <Text style={styles.statValue}>${totalEarnings}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#ECFDF5" }]}>
              <Ionicons name="checkmark-done" size={24} color={colors.success} />
            </View>
            <Text style={styles.statLabel}>Meetings</Text>
            <Text style={styles.statValue}>{mockCompletedMeetings.length}</Text>
          </View>
        </View>

        {/* Filters */}
        <View style={styles.filterBar}>
          {["10 Days", "1 Month", "1 Year"].map((filter, i) => (
            <TouchableOpacity key={filter} style={[styles.filterBtn, i === 0 && styles.activeFilter]}>
              <Text style={[styles.filterText, i === 0 && styles.activeFilterText]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Performance Chart Mock */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Revenue Growth</Text>
          <View style={styles.mockChart}>
            {/* Mock visual representation of a chart */}
            {[40, 70, 45, 90, 65, 80, 50, 85].map((h, i) => (
              <View key={i} style={[styles.chartBar, { height: h }]} />
            ))}
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
          {mockCompletedMeetings.map((meeting) => (
            <View key={meeting.id} style={styles.transactionCard}>
              <View style={styles.transIcon}>
                <Ionicons name="cash-outline" size={20} color={colors.success} />
              </View>
              <View style={styles.transDetails}>
                <Text style={styles.transLearner}>{meeting.learnerName}</Text>
                <Text style={styles.transDate}>{meeting.scheduledTime.split(" ")[0]}</Text>
              </View>
              <Text style={styles.transAmount}>+${meeting.earnings}</Text>
            </View>
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
})
