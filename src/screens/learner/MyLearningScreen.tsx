import { View, Text, StyleSheet, FlatList, SafeAreaView, Image, TouchableOpacity } from "react-native"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { mockCourses } from "@/data/mockData"
import { useNavigation } from "@react-navigation/native"

export default function MyLearningScreen() {
  const navigation = useNavigation<any>()
  const enrolledCourses = mockCourses.filter((c) => c.enrolled)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Learning</Text>
        <Text style={styles.headerSubtitle}>Continue where you left off</Text>
      </View>

      <FlatList
        data={enrolledCourses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseCard}
            onPress={() => navigation.navigate("CourseDetail", { courseId: item.id })}
          >
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <View style={styles.info}>
              <Text style={styles.instructor}>{item.instructor}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Progress</Text>
                  <Text style={styles.progressPercent}>{item.progress}%</Text>
                </View>
                <View style={styles.progressBg}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: typeof item.progress === "number" ? `${item.progress}%` : "0%" },
                    ]}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You haven't enrolled in any courses yet.</Text>
            <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate("Courses")}>
              <Text style={styles.browseButtonText}>Browse Courses</Text>
            </TouchableOpacity>
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
    backgroundColor: colors.light.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.light.text,
    fontFamily: typography.fontFamily.bold,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamily.regular,
  },
  listContent: {
    padding: spacing.lg,
  },
  courseCard: {
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  thumbnail: {
    width: "100%",
    height: 160,
  },
  info: {
    padding: spacing.md,
  },
  instructor: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.light.text,
    marginBottom: spacing.md,
  },
  progressContainer: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.light.text,
  },
  progressBg: {
    height: 8,
    backgroundColor: colors.light.surface,
    borderRadius: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  emptyContainer: {
    padding: spacing.xxl,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: colors.light.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  browseButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  browseButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
})
