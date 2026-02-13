import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { useNavigation } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useState, useEffect } from "react"
import courseService from "@/services/course.service"
import { CustomToast } from "@/components/CustomToast"
import { Ionicons } from "@expo/vector-icons"


export default function MyLearningScreen() {
  const navigation = useNavigation<any>()
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchEnrolledCourses()
  }, [])

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true)
      const response = await courseService.getEnrolledCourses()
      console.log("Enrolled courses:", response)
      setEnrolledCourses(response.data || [])
    } catch (error: any) {
      console.error('Fetch enrolled courses error:', error)
      CustomToast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to fetch enrolled courses'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchEnrolledCourses()
  }

  if (loading) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your courses...</Text>
        </View>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Learning</Text>
        <Text style={styles.headerSubtitle}>Continue where you left off</Text>
      </View>

      <FlatList
        data={enrolledCourses}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }: any) => (
          <TouchableOpacity
            style={styles.courseCard}
            onPress={() => navigation.navigate("CourseDetail", { courseId: item.id })}
          >
            <Image source={{ uri: item.thumbnailUrl || 'https://via.placeholder.com/400x180' }} style={styles.thumbnail} />
            <View style={styles.info}>
              <Text style={styles.instructor}>{item.instructor || 'Instructor'}</Text>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>Progress</Text>
                  <Text style={styles.progressPercent}>{item.progress || 0}%</Text>
                </View>
                <View style={styles.progressBg}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${item.progress || 0}%` },
                    ]}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={64} color={colors.light.textTertiary} />
            <Text style={styles.emptyText}>You haven't enrolled in any courses yet.</Text>
            <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate("Courses")}>
              <Text style={styles.browseButtonText}>Browse Courses</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    paddingTop: 20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.light.textSecondary,
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
