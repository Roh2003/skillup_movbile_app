import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { useNavigation } from "@react-navigation/native"

export default function SettingsScreen() {
  const navigation = useNavigation<any>()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {[
          { icon: "moon-outline", label: "Dark Mode" },
          { icon: "notifications-outline", label: "Notification Setting", onPress: () => navigation.navigate("Notifications") },
          { icon: "shield-checkmark-outline", label: "Privacy Setting" },
          { icon: "settings-outline", label: "General Setting" },
          { icon: "language-outline", label: "Language Preferences" },
          { icon: "volume-high-outline", label: "Sound Effects" },
          { icon: "card-outline", label: "Payment Method" },
          { icon: "help-circle-outline", label: "Help Centre" },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.row} onPress={item.onPress}>
            <View style={styles.rowLeft}>
              <Ionicons name={item.icon as any} size={20} color={colors.primary} />
              <Text style={styles.rowLabel}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.light.textTertiary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    paddingBottom: 16,
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


