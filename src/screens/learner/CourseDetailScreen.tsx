import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView } from "react-native"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { Ionicons } from "@expo/vector-icons"
import { mockCourses } from "@/data/mockData"
import { useRoute, useNavigation } from "@react-navigation/native"

export default function CourseDetailScreen() {
  const route = useRoute<any>()
  const navigation = useNavigation<any>()
  const { courseId } = route.params
  const course = mockCourses.find((c) => c.id === courseId)

  if (!course) return null

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: course.thumbnail }} style={styles.heroImage} />

        <View style={styles.content}>
          <Text style={styles.category}>{course.category}</Text>
          <Text style={styles.title}>{course.title}</Text>

          <View style={styles.meta}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={styles.metaText}>{course.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="stats-chart-outline" size={20} color={colors.primary} />
              <Text style={styles.metaText}>{course.level}</Text>
            </View>
          </View>

          <View style={styles.instructorBox}>
            <View style={styles.instructorAvatar}>
              <Ionicons name="person" size={24} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.instructorLabel}>Instructor</Text>
              <Text style={styles.instructorName}>{course.instructor}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>About this course</Text>
          <Text style={styles.description}>{course.description}</Text>

          <Text style={styles.sectionTitle}>Curriculum</Text>
          {course.curriculum?.map((lesson, index) => (
            <TouchableOpacity
              key={lesson.id}
              style={[styles.lessonItem, lesson.locked && styles.lockedLesson]}
              onPress={() => !lesson.locked && navigation.navigate("VideoPlayer", { lessonId: lesson.id })}
            >
              <View style={styles.lessonNumber}>
                <Text style={styles.lessonNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonDuration}>{lesson.duration}</Text>
              </View>
              <Ionicons
                name={lesson.locked ? "lock-closed" : lesson.completed ? "checkmark-circle" : "play-circle"}
                size={24}
                color={lesson.locked ? colors.light.textTertiary : lesson.completed ? colors.success : colors.primary}
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {!course.enrolled && (
        <View style={styles.bottomCta}>
          <TouchableOpacity style={styles.enrollButton}>
            <Text style={styles.enrollButtonText}>Enroll Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  heroImage: {
    width: "100%",
    height: 250,
  },
  content: {
    padding: spacing.lg,
  },
  category: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.light.text,
    marginVertical: spacing.sm,
  },
  meta: {
    flexDirection: "row",
    gap: spacing.xl,
    marginVertical: spacing.md,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  metaText: {
    fontSize: 14,
    color: colors.light.textSecondary,
  },
  instructorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginVertical: spacing.md,
    gap: spacing.md,
  },
  instructorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
  },
  instructorLabel: {
    fontSize: 12,
    color: colors.light.textTertiary,
  },
  instructorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.light.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: 15,
    color: colors.light.textSecondary,
    lineHeight: 22,
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  lockedLesson: {
    opacity: 0.6,
  },
  lessonNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.light.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  lessonNumberText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.light.textSecondary,
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.light.text,
  },
  lessonDuration: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  bottomCta: {
    padding: spacing.lg,
    backgroundColor: colors.light.background,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  enrollButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  enrollButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
})
