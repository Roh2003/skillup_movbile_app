import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/theme/colors"
import { typography } from "@/theme/typography"

const mockNotifications = [
  { id: "1", icon: "checkmark-done-outline", title: "Course Completed", subtitle: "UI/UX Design course finished", time: "5 min ago", color: "#22C55E" },
  { id: "2", icon: "time-outline", title: "Due date is near", subtitle: "Wireframe Design assignment", time: "2 hr ago", color: "#F97316" },
  { id: "3", icon: "ribbon-outline", title: "Certificate", subtitle: "Available to download", time: "1 day ago", color: "#3B82F6" },
]

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Pause All Notifications</Text>
          <View style={styles.switch}>
            <View style={styles.switchThumb} />
          </View>
        </View>
      </View>

      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row}>
            <View style={[styles.iconCircle, { backgroundColor: `${item.color}22` }]}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
            <View style={styles.textCol}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowSubtitle} numberOfLines={1}>{item.subtitle}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  title: {
    fontSize: 22,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleLabel: {
    fontSize: 13,
    color: colors.light.textSecondary,
  },
  switch: {
    width: 46,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  switchThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    alignSelf: "flex-end",
  },
  list: { paddingHorizontal: 16, paddingVertical: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textCol: { flex: 1 },
  rowTitle: {
    fontSize: 15,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
  },
  rowSubtitle: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  time: {
    fontSize: 11,
    color: colors.light.textTertiary,
  },
})


