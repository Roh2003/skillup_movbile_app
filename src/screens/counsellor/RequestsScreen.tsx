
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Alert } from "react-native"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { mockMeetingRequests } from "@/data/mockData"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../../context/AuthContext"
import { useNavigation } from "@react-navigation/native"

export default function RequestsScreen() {
  const { user } = useAuth()
  const navigation = useNavigation<any>()

  const handleAction = (type: "accept" | "reject", name: string) => {
    Alert.alert(
      type === "accept" ? "Accept Request" : "Reject Request",
      `Are you sure you want to ${type} the request from ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: type.toUpperCase(), onPress: () => {} },
      ],
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Welcome Back,</Text>
          <Text style={styles.userName}>{user?.name}</Text>
        </View>
        <View style={styles.topBarActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Profile")}>
            <Ionicons name="person-circle-outline" size={32} color={colors.light.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Meeting Requests</Text>
        <Text style={styles.subtitle}>You have {mockMeetingRequests.length} new requests to review</Text>
      </View>

      <FlatList
        data={mockMeetingRequests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View style={styles.learnerInfo}>
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={24} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.learnerName}>{item.learnerName}</Text>
                  <Text style={styles.requestedAt}>Requested on {item.requestedAt}</Text>
                </View>
              </View>
              <View style={styles.timeBadge}>
                <Ionicons name="time-outline" size={14} color={colors.accent} />
                <Text style={styles.timeText}>
                  {item.preferredTime.split(" ")[1]} {item.preferredTime.split(" ")[2]}
                </Text>
              </View>
            </View>

            <View style={styles.messageBox}>
              <Text style={styles.messageLabel}>Message:</Text>
              <Text style={styles.messageText}>{item.message}</Text>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.btn, styles.rejectBtn]}
                onPress={() => handleAction("reject", item.learnerName)}
              >
                <Text style={styles.rejectBtnText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.acceptBtn]}
                onPress={() => handleAction("accept", item.learnerName)}
              >
                <Text style={styles.acceptBtnText}>Accept Request</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
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
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.accent,
  },
  messageBox: {
    backgroundColor: colors.light.surface,
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
})
