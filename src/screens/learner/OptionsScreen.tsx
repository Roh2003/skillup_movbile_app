import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { useNavigation } from "@react-navigation/native"

export default function OptionsScreen() {
  const navigation = useNavigation<any>()

  const items = [
    { icon: "bookmark-outline", label: "Bookmarks", route: "Bookmarks" },
    { icon: "chatbubbles-outline", label: "Chat", route: "Chat" },
    { icon: "settings-outline", label: "Settings", route: "Settings" },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Options</Text>
      </View>

      <View style={styles.list}>
        {items.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.row}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={styles.rowLeft}>
              <Ionicons name={item.icon as any} size={20} color={colors.primary} />
              <Text style={styles.rowLabel}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.light.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.light.surface,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.light.border,
    marginBottom: 10,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rowLabel: {
    fontSize: 15,
    color: colors.light.text,
    fontFamily: typography.fontFamily.medium,
  },
})




