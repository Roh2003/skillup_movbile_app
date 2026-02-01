import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing, borderRadius, shadows } from "@/theme/colors";
import courseService from "@/services/course.service";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";

const TAB_LABELS = ["Overview", "Lessons"] as const;
const { width } = Dimensions.get("window");

export default function CourseDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { courseId } = route.params;

  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"Overview" | "Lessons">("Overview");
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourseDetails();
  }, []);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const [courseRes, lessonsRes] = await Promise.all([
        courseService.getCourseById(courseId),
        courseService.getLessons(courseId).catch(() => ({ success: false, data: [] })),
      ]);
      
      console.log("Course response:", courseRes);
      console.log("Lessons response:", lessonsRes);
      
      // Handle different response structures
      const courseData = courseRes.data || courseRes;
      
      // Try to get lessons from the separate API first, then fall back to course data
      let lessonsData = Array.isArray(lessonsRes.data) ? lessonsRes.data : 
                          Array.isArray(lessonsRes) ? lessonsRes : [];
      
      // If separate lessons API failed or returned empty, use lessons from course data
      if (lessonsData.length === 0 && courseData.lessons && Array.isArray(courseData.lessons)) {
        lessonsData = courseData.lessons;
        console.log("Using lessons from course data:", lessonsData.length);
      }
      
      console.log("Course data:", courseData);
      console.log("Lessons data:", lessonsData);
      
      setCourse(courseData);
      setLessons(lessonsData);
    } catch (error: any) {
      console.error("Fetch course error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to fetch course details",
      });
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      console.log("Enrolling in course:", courseId);
      
      const response = await courseService.enrollCourse(courseId);
      console.log("Enrollment response:", response);
      
      // Refetch course data to get updated enrollment status
      await fetchCourseDetails();
      
      setSelectedTab("Lessons");
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Successfully enrolled in course!",
      });
    } catch (error: any) {
      console.error("Enroll error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to enroll in course",
      });
    } finally {
      setEnrolling(false);
    }
  };

  const getVideoUrl = (lesson: any) => {
    console.log("=== getVideoUrl called ===");
    console.log("Lesson data:", JSON.stringify(lesson, null, 2));
    console.log("videoType:", lesson.videoType);
    console.log("videoId:", lesson.videoId);
    
    // If videoType is external, return the videoId as-is (it's the full URL)
    if (lesson.videoType === 'external') {
      console.log("✅ External video URL:", lesson.videoId);
      return lesson.videoId;
    }
    
    // For YouTube videos
    if (lesson.videoId) {
      // Check if videoId is already a full URL
      if (lesson.videoId.includes('youtube.com') || lesson.videoId.includes('youtu.be')) {
        console.log("✅ videoId is already a full URL:", lesson.videoId);
        return lesson.videoId;
      }
      
      // Otherwise, construct YouTube URL from videoId
      const url = `https://www.youtube.com/watch?v=${lesson.videoId}`;
      console.log("✅ Constructed YouTube URL from videoId:", url);
      return url;
    }
    
    console.log("❌ No videoId found");
    return '';
  };

  const handleLessonPress = (lesson: any, index: number) => {
    console.log("=== handleLessonPress called ===");
    console.log("Lesson index:", index);
    console.log("Lesson:", lesson);
    console.log("Course enrolled:", course.isEnrolled);
    
    // First lesson is always free preview
    if (!course.isEnrolled && index > 0) {
      Toast.show({
        type: "info",
        text1: "Enrollment Required",
        text2: "Please enroll to access all lessons",
      });
      return;
    }

    const videoUrl = getVideoUrl(lesson);
    console.log("Video URL to pass:", videoUrl);
    
    if (!videoUrl) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Video URL not available for this lesson",
      });
      return;
    }

    console.log("=== Navigating to VideoPlayer ===");
    console.log("Navigation params:", {
      lessonId: lesson.id,
      courseId: course.id,
      lessonTitle: lesson.title,
      videoUrl: videoUrl,
    });

    navigation.navigate("VideoPlayer", {
      lessonId: lesson.id,
      courseId: course.id,
      lessonTitle: lesson.title,
      videoUrl: videoUrl,
      videoType: lesson.videoType,
      videoId: lesson.videoId,
    });
  };

  function renderOverview() {
    return (
      <ScrollView
        style={styles.tabScroll}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Course Overview</Text>
        <Text style={styles.title}>{course.title}</Text>
        <View style={styles.overviewStatsRow}>
          <Ionicons name="stats-chart-outline" size={16} color={colors.primary} />
          <Text style={styles.metaText}>{course.level}</Text>
          <Ionicons name="time-outline" size={16} color={colors.primary} style={{ marginLeft: 16 }} />
          <Text style={styles.metaText}>{course.duration || "N/A"}</Text>
          {course.price && (
            <>
              <Ionicons name="cash-outline" size={16} color={colors.success} style={{ marginLeft: 16 }} />
              <Text style={styles.priceText}>₹{course.price}</Text>
            </>
          )}
        </View>

        <Text style={styles.sectionLabel}>Description</Text>
        <Text style={styles.description}>{course.description || "No description available"}</Text>

        <Text style={styles.sectionLabel}>Instructor</Text>
        <View style={styles.instructorCard}>
          <View style={styles.instructorAvatar}>
            <Ionicons name="person" size={24} color={colors.primary} />
          </View>
          <View style={styles.instructorInfo}>
            <Text style={styles.instructorName}>{course.instructor || "Instructor"}</Text>
            <Text style={styles.instructorRole}>Course Instructor</Text>
          </View>
        </View>

        {course.category && (
          <>
            <Text style={styles.sectionLabel}>Category</Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{course.category}</Text>
            </View>
          </>
        )}
      </ScrollView>
    );
  }

  function renderLessons() {
    return (
      <ScrollView
        style={styles.tabScroll}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Course Curriculum</Text>
        <Text style={styles.lessonCount}>{lessons.length} Lessons</Text>

        {lessons.length > 0 ? (
          lessons.map((lesson, idx) => {
            const locked = !course.isEnrolled && idx > 0;
            const iconName = locked ? "lock-closed" : "play-circle";
            const iconColor = locked ? colors.light.textTertiary : colors.primary;

            return (
              <TouchableOpacity
                key={lesson.id}
                style={[styles.lessonItem, locked && styles.lockedLesson]}
                onPress={() => handleLessonPress(lesson, idx)}
                activeOpacity={locked ? 1 : 0.7}
              >
                <View style={styles.lessonNumber}>
                  <Text style={styles.lessonNumberText}>{idx + 1}</Text>
                </View>
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonDuration}>
                    {lesson.duration || "Video lesson"}
                    {idx === 0 && !course.isEnrolled && " • Free Preview"}
                  </Text>
                </View>
                <Ionicons name={iconName as any} size={24} color={iconColor} />
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyLessons}>
            <Ionicons name="videocam-outline" size={48} color={colors.light.textTertiary} />
            <Text style={styles.emptyText}>No lessons available yet</Text>
          </View>
        )}
      </ScrollView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading course...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!course) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: course.isEnrolled ? 24 : 100 }}
      >
        {/* Hero Image with Gradient Overlay */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: course.thumbnailUrl || "https://via.placeholder.com/800x240" }}
            style={styles.heroImage}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)"]}
            style={styles.heroGradient}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Tabs */}
        <View style={styles.courseTabsBar}>
          {TAB_LABELS.map((tab) => {
            const isActive = selectedTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, isActive && styles.tabBtnActive]}
                onPress={() => setSelectedTab(tab as any)}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabBtnText, isActive && styles.tabBtnTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContentArea}>
          {selectedTab === "Overview" && renderOverview()}
          {selectedTab === "Lessons" && renderLessons()}
        </View>
      </ScrollView>

      {/* Enroll Button */}
      {!course.isEnrolled && (
        <View style={styles.bottomCta}>
          <TouchableOpacity
            style={[styles.enrollButton, enrolling && styles.enrollButtonDisabled]}
            onPress={handleEnroll}
            activeOpacity={0.8}
            disabled={enrolling}
          >
            {enrolling ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.enrollButtonText}>ENROLL NOW</Text>
                {course.price && (
                  <Text style={styles.enrollPrice}>₹{course.price}</Text>
                )}
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.light.textSecondary,
  },
  heroContainer: {
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: 240,
    resizeMode: "cover",
  },
  heroGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 240,
    justifyContent: "flex-start",
    padding: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  courseTabsBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    marginTop: -30,
    paddingVertical: 6,
    ...shadows.md,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    marginHorizontal: 6,
    backgroundColor: "transparent",
  },
  tabBtnActive: {
    backgroundColor: colors.primary,
  },
  tabBtnText: {
    fontSize: 16,
    color: colors.light.text,
    fontWeight: "500",
  },
  tabBtnTextActive: {
    color: "#FFF",
    fontWeight: "bold",
  },
  tabContentArea: {
    minHeight: width / 1.1,
    backgroundColor: "#fff",
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.md,
    padding: spacing.md,
  },
  tabScroll: {
    flex: 1,
    backgroundColor: "transparent",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: spacing.sm,
    color: colors.light.text,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
    color: colors.light.text,
  },
  overviewStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginLeft: 4,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.success,
    marginLeft: 4,
  },
  description: {
    fontSize: 15,
    color: colors.light.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  instructorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  instructorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.light.text,
  },
  instructorRole: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginTop: 2,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  lessonCount: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: spacing.md,
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
    opacity: 0.5,
  },
  lessonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.light.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  lessonNumberText: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.primary,
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
    marginTop: 2,
  },
  emptyLessons: {
    alignItems: "center",
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    fontSize: 16,
    color: colors.light.textSecondary,
    marginTop: spacing.md,
  },
  bottomCta: {
    padding: spacing.lg,
    backgroundColor: colors.light.background,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99,
    elevation: 10,
  },
  enrollButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: borderRadius.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
    ...shadows.md,
  },
  enrollButtonDisabled: {
    opacity: 0.7,
  },
  enrollButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  enrollPrice: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
