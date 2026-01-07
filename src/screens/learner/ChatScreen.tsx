import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/theme/colors"
import { typography } from "@/theme/typography"

const mockChats = [
  { id: "1", name: "Mentor John", lastMessage: "See you in the next session!", time: "2 min" },
  { id: "2", name: "UI/UX Group", lastMessage: "New resources uploaded.", time: "1 hr" },
  { id: "3", name: "Career Coach", lastMessage: "How is your portfolio going?", time: "3 hr" },
]

export default function ChatScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat</Text>
        <Ionicons name="chatbubbles-outline" size={22} color={colors.primary} />
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.light.textTertiary} />
        <Text style={styles.searchPlaceholder}>Search text</Text>
      </View>

      <FlatList
        data={mockChats}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={22} color={colors.primary} />
            </View>
            <View style={styles.chatInfo}>
              <View style={styles.chatTop}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatTime}>{item.time}</Text>
              </View>
              <Text style={styles.chatMessage} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
    paddingHorizontal: 14,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: colors.light.textTertiary,
  },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.green[50],
    justifyContent: "center",
    alignItems: "center",
  },
  chatInfo: { flex: 1 },
  chatTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  chatName: {
    fontSize: 15,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
  },
  chatTime: { fontSize: 11, color: colors.light.textTertiary },
  chatMessage: {
    fontSize: 13,
    color: colors.light.textSecondary,
  },
})


