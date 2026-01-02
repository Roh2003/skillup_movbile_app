import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image, FlatList } from "react-native"
import { useAuth } from "../../../context/AuthContext"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { Ionicons } from "@expo/vector-icons"
import { mockCourses, mockCounsellors } from "@/data/mockData"
import { useNavigation } from "@react-navigation/native"

export default function HomeScreen() {
  const { user } = useAuth()
  const navigation = useNavigation<any>()

  const ongoingCourses = mockCourses.filter((c) => c.enrolled)
  const featuredCourses = mockCourses.filter((c) => !c.enrolled)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{user?.name || "Learner"}</Text>
        </View>
        <View style={styles.topBarActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Profile")}>
            <Ionicons name="person-circle-outline" size={28} color={colors.light.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Settings")}>
            <Ionicons name="settings-outline" size={26} color={colors.light.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Ongoing Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ongoing Courses</Text>
            <TouchableOpacity onPress={() => navigation.navigate("MyLearning")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={ongoingCourses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.ongoingCard}
                onPress={() =>
                  navigation.navigate("MyLearning", { screen: "CourseDetail", params: { courseId: item.id } })
                }
              >
                <Image source={{ uri: item.thumbnail }} style={styles.ongoingThumbnail} />
                <View style={styles.ongoingInfo}>
                  <Text style={styles.courseTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <View style={styles.progressWrapper}>
                    <View
                      style={[
                        styles.progressBar,
                        { width: typeof item.progress === 'number' ? `${item.progress}%` : 0 }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {item.progress}% Completed
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Featured Courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Courses</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Courses")}>
              <Text style={styles.seeAll}>Explore</Text>
            </TouchableOpacity>
          </View>
          {featuredCourses.slice(0, 2).map((course) => (
            <TouchableOpacity
              key={course.id}
              style={styles.featuredCard}
              onPress={() =>
                navigation.navigate("Courses", { screen: "CourseDetail", params: { courseId: course.id } })
              }
            >
              <Image source={{ uri: course.thumbnail }} style={styles.featuredThumbnail} />
              <View style={styles.featuredInfo}>
                <Text style={styles.featuredCategory}>{course.category}</Text>
                <Text style={styles.featuredTitle}>{course.title}</Text>
                <View style={styles.featuredMeta}>
                  <Ionicons name="time-outline" size={14} color={colors.light.textSecondary} />
                  <Text style={styles.metaText}>{course.duration}</Text>
                  <Text style={styles.metaDivider}>•</Text>
                  <Text style={styles.metaText}>{course.level}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top Counsellors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Counsellors</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Consultation")}>
              <Text style={styles.seeAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={mockCounsellors}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.counsellorCard}
                onPress={() =>
                  navigation.navigate("Consultation", { screen: "CounsellorDetail", params: { counsellorId: item.id } })
                }
              >
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={30} color={colors.primary} />
                  {item.isActive && <View style={styles.activeDot} />}
                </View>
                <Text style={styles.counsellorName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.counsellorSpec} numberOfLines={1}>
                  {item.specialization}
                </Text>
              </TouchableOpacity>
            )}
          />
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
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.light.background,
  },
  topBarActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  greeting: {
    fontSize: 14,
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamily.regular,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.light.text,
    fontFamily: typography.fontFamily.bold,
  },
  iconButton: {
    padding: spacing.xs,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.light.text,
    fontFamily: typography.fontFamily.bold,
  },
  seeAll: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },
  ongoingCard: {
    width: 200,
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    marginRight: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
    overflow: "hidden",
  },
  ongoingThumbnail: {
    width: "100%",
    height: 100,
  },
  ongoingInfo: {
    padding: spacing.sm,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.light.text,
    marginBottom: spacing.xs,
  },
  progressWrapper: {
    height: 6,
    backgroundColor: colors.light.surface,
    borderRadius: 3,
    marginBottom: 4,
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.success,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  featuredCard: {
    flexDirection: "row",
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
    overflow: "hidden",
  },
  featuredThumbnail: {
    width: 100,
    height: 100,
  },
  featuredInfo: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: "center",
  },
  featuredCategory: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 2,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.light.text,
    marginBottom: 4,
  },
  featuredMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginLeft: 4,
  },
  metaDivider: {
    marginHorizontal: 4,
    color: colors.light.textTertiary,
  },
  counsellorCard: {
    width: 120,
    alignItems: "center",
    marginRight: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
    position: "relative",
  },
  activeDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  counsellorName: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: colors.light.text,
  },
  counsellorSpec: {
    fontSize: 10,
    color: colors.light.textSecondary,
    textAlign: "center",
  },
})
