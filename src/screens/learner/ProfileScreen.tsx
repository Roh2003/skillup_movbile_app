import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../../context/AuthContext"
import { useNavigation } from "@react-navigation/native"

export default function ProfileScreen() {
  const { user, logout } = useAuth()
  const navigation = useNavigation<any>()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <Image
          source={{ uri: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name || "Learner"}</Text>
        <Text style={styles.email}>{user?.email || "name123@gmail.com"}</Text>

        {/* Primary edit button */}
        <TouchableOpacity
          style={styles.editPrimaryButton}
          onPress={() => navigation.navigate("EditProfile")}
        >
          <Ionicons name="create-outline" size={16} color={colors.primary} />
          <Text style={styles.editPrimaryText}>Edit personal details</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menu}>
        {[
          { icon: "person-circle-outline", label: "Account Setting", route: "EditProfile" },
          { icon: "options-outline", label: "Learning Preferences" },
          { icon: "ribbon-outline", label: "Certificates" },
          { icon: "chatbox-ellipses-outline", label: "Feedback and Reviews" },
          { icon: "help-circle-outline", label: "Support and Help" },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            style={styles.menuItem}
            onPress={item.route ? () => navigation.navigate(item.route) : undefined}
          >
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon as any} size={20} color={colors.primary} />
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.light.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>SIGN OUT</Text>
        </TouchableOpacity>
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
  headerTitle: {
    fontSize: 22,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
  },
  profileCard: {
    alignItems: "center",
    paddingVertical: 24,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
  },
  email: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginTop: 4,
  },
  editPrimaryButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.green[50],
  },
  editPrimaryText: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: typography.fontFamily.medium,
  },
  menu: {
    paddingHorizontal: 16,
    gap: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.light.surface,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  menuLabel: {
    fontSize: 15,
    color: colors.light.text,
    fontFamily: typography.fontFamily.medium,
  },
  footer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  logoutButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
  },
})


