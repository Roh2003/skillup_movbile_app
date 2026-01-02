import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from "react-native"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { mockScheduledMeetings } from "@/data/mockData"
import { Ionicons } from "@expo/vector-icons"

export default function ScheduleScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Schedule</Text>
        <Text style={styles.subtitle}>Manage your upcoming consultations</Text>
      </View>

      <FlatList
        data={mockScheduledMeetings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.meetingCard}>
            <View style={styles.cardTop}>
              <View style={styles.dateTime}>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                <Text style={styles.dateText}>{item.scheduledTime}</Text>
              </View>
              <View style={styles.statusBadge}>
                <View style={styles.pulseDot} />
                <Text style={styles.statusText}>Upcoming</Text>
              </View>
            </View>

            <View style={styles.learnerSection}>
              <View style={styles.learnerAvatar}>
                <Ionicons name="person" size={24} color={colors.primary} />
              </View>
              <View style={styles.learnerDetails}>
                <Text style={styles.learnerName}>{item.learnerName}</Text>
                <Text style={styles.meetingType}>One-on-one Career Consulting</Text>
              </View>
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{item.duration} min</Text>
              </View>
            </View>

            <View style={styles.countdownBox}>
              <Text style={styles.countdownLabel}>Starts in:</Text>
              <Text style={styles.countdownTime}>02h : 45m : 12s</Text>
            </View>

            <TouchableOpacity style={styles.joinBtn}>
              <Ionicons name="videocam" size={20} color="#FFFFFF" />
              <Text style={styles.joinBtnText}>Join Meeting</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-clear-outline" size={60} color={colors.light.textTertiary} />
            <Text style={styles.emptyText}>No scheduled meetings for today.</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
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
    marginBottom: spacing.lg,
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
    backgroundColor: colors.light.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.light.textSecondary,
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
    color: colors.light.textTertiary,
  },
})
