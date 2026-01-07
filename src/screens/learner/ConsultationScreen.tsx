
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from "react-native"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { mockCounsellors } from "@/data/mockData"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useState } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"


export default function ConsultationScreen() {
  const navigation = useNavigation<any>()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCounsellors = mockCounsellors.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specialization.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
          />
        </View>
      </View>

      <FlatList
        data={filteredCounsellors}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.counsellorCard}
            onPress={() => navigation.navigate("CounsellorDetail", { counsellorId: item.id })}
          >
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={32} color={colors.primary} />
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: item.isActive ? colors.success : colors.light.textTertiary },
                  ]}
                />
              </View>
            </View>

            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={14} color={colors.accent} />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>
              <Text style={styles.specialization}>{item.specialization}</Text>
              {/* <Text style={styles.experience}>{item.experience} Experience</Text> */}

              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="videocam" size={18} color={colors.primary} />
                  <Text style={styles.actionText}>Video Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="calendar" size={18} color={colors.primary} />
                  <Text style={styles.actionText}>Schedule</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaProvider>
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
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  avatarContainer: {
    marginRight: spacing.md,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
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
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.sm,
    backgroundColor: "#F5F3FF",
  },
  actionText: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.primary,
  },
})
