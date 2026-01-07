import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, TextInput } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../../../context/AuthContext"
import { mockCourses, mockCounsellors } from "@/data/mockData"
import { colors } from "@/theme/colors"
import { typography } from "@/theme/typography"

export default function HomeScreen() {
  const { user } = useAuth()
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()

  const continueWatching = mockCourses.filter((c) => c.enrolled)
  const recommended = mockCourses

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.profileCircle} onPress={() => navigation.navigate("Profile")}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80" }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.welcome}>Welcome..,</Text>
            <Text style={styles.tagline}>{user?.name || "Rohit Saundalkar"}</Text>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Notifications")}>
              <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Settings")}>
              <Ionicons name="settings-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Options")}>
              <Ionicons name="menu-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.light.textTertiary} />
          <TextInput placeholder="Search courses, mentors, topics" style={styles.searchInput} placeholderTextColor={colors.light.textTertiary} />
          <Ionicons name="options-outline" size={20} color={colors.light.textTertiary} />
        </View>

        {/* Continue Watching */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Continue Watching</Text>
          <TouchableOpacity><Text style={styles.link}>See all</Text></TouchableOpacity>
        </View>
        <FlatList
          data={continueWatching}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.continueCard} onPress={() => navigation.navigate("CourseDetail", { courseId: item.id })}>
              <Image source={{ uri: item.thumbnail }} style={styles.continueImage} />
              <View style={styles.continueInfo}>
                <Text style={styles.continueTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.metaText}>{item.level} • {item.duration}</Text>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: `${item.progress ?? 0}%` }]} />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity><Text style={styles.link}>See all</Text></TouchableOpacity>
        </View>
        <View style={styles.chipRow}>
          {["UI/UX Design", "Web Design", "App Design", "E-commerce", "Technical"].map((cat) => (
            <TouchableOpacity key={cat} style={styles.chip}>
              <Text style={styles.chipText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommended */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended</Text>
        </View>
        <View style={styles.recommendedGrid}>
          {recommended.map((course) => (
            <TouchableOpacity
              key={course.id}
              style={styles.recommendCard}
              onPress={() => navigation.navigate("CourseDetail", { courseId: course.id })}
            >
              <Image source={{ uri: course.thumbnail }} style={styles.recommendImage} />
              <View style={styles.recommendInfo}>
                <Text style={styles.recommendTitle} numberOfLines={1}>{course.title}</Text>
                <Text style={styles.metaText}>{course.duration} • {course.level}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top Counsellors */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Counsellors</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Consultation")}><Text style={styles.link}>View all</Text></TouchableOpacity>
        </View>
        <FlatList
          data={mockCounsellors}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.counsellorCard}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={22} color={colors.primary} />
                {item.isActive && <View style={styles.activeDot} />}
              </View>
              <Text style={styles.counsellorName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.counsellorSpec} numberOfLines={1}>{item.specialization}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={12} color="#FBBF24" />
                <Text style={styles.ratingText}>{item.rating?.toFixed(1) ?? "4.8"}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 9,
    marginHorizontal: 10,
    backgroundColor: colors.green[300],
    marginBottom: 10,
    borderRadius: 50,

  },
  profileCircle: {
    width: 55,
    height: 55,
    borderRadius: 30,
    overflow: "hidden",
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.green[200],
  },
  profileImage: { width: "100%", height: "100%" },
  welcome: {
    fontSize: 13,
    color: colors.light.textSecondary,
  },
  tagline: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
  },
  topActions: {
    flexDirection: "row",
    gap: 10,
    marginLeft: 12,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.light.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.light.border,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.light.text },
  sectionHeader: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
  },
  link: {
    color: colors.primary,
    fontFamily: typography.fontFamily.bold,
    fontSize: 13,
  },
  continueCard: {
    width: 240,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    overflow: "hidden",
  },
  continueImage: { width: "100%", height: 120 },
  continueInfo: { padding: 12, gap: 6 },
  continueTitle: {
    fontSize: 15,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
  },
  metaText: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  progressBg: {
    height: 6,
    backgroundColor: colors.light.border,
    borderRadius: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: colors.green[50],
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.green[200],
  },
  chipText: {
    fontSize: 13,
    color: colors.light.text,
    fontFamily: typography.fontFamily.medium,
  },
  recommendedGrid: {
    paddingHorizontal: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  recommendCard: {
    width: "48%",
    backgroundColor: colors.light.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.light.border,
    overflow: "hidden",
  },
  recommendImage: { width: "100%", height: 100 },
  recommendInfo: { padding: 10, gap: 4 },
  recommendTitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
  },
  counsellorCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: colors.light.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.light.border,
    padding: 12,
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.green[50],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },
  activeDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: "#fff",
  },
  counsellorName: {
    fontSize: 13,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
    textAlign: "center",
  },
  counsellorSpec: {
    fontSize: 12,
    color: colors.light.textSecondary,
    textAlign: "center",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: colors.light.text,
  },
})
