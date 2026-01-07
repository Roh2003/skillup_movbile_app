import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video } from "expo-av";
import { colors, spacing, borderRadius, shadows } from "@/theme/colors";

// Demo data for one Course with lessons, overview, and reviews
const DEMO_COURSE = {
  id: "1",
  title: "Wireframe Design",
  category: "Design",
  level: "Beginner",
  duration: "10 lessons",
  enrolled: false,
  thumbnail:
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
  instructor: "Jane Doe",
  rating: 4.8,
  reviewsCount: 123,
  overview:
    "Learn how to create effective wireframes and streamline your product design process. In this course, you will get hands-on experience with real-world case studies, tips, and best practices.",
  requirements: "No prior design experience needed. Laptop & Figma are recommended.",
  reviews: [
    {
      id: "r1",
      user: "Hema New",
      userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      date: "2 days ago",
      text: "Course is well-structured and clear. Lot's of new ideas and real world examples. Totally worth it.",
      likes: 28,
    },
    {
      id: "r2",
      user: "Name Here",
      userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4,
      date: "3 days ago",
      text: "Great instructor, clean explanations.",
      likes: 12,
    },
  ],
  curriculum: [
    {
      id: "l1",
      title: "Welcome",
      duration: "2 min",
      video: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    },
    {
      id: "l2",
      title: "Course Introduction",
      duration: "11 min",
      video: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    },
    {
      id: "l3",
      title: "What is Wireframing?",
      duration: "14 min",
      video: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    },
    {
      id: "l4",
      title: "How to Link Fidelity Wireframes?",
      duration: "21 min",
      video: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    },
    {
      id: "l5",
      title: "App Wireframe Design",
      duration: "18 min",
      video: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
    },
  ],
};

const TAB_LABELS = ["Overview", "Lesson", "Review"] as const;
const { width } = Dimensions.get("window");

export default function CourseDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [course, setCourse] = useState(DEMO_COURSE);
  const [selectedTab, setSelectedTab] = useState<"Overview" | "Lesson" | "Review">(
    "Overview"
  );
  const [showDemoVideo, setShowDemoVideo] = useState(false);

  // Handle "enrollment"
  const enroll = () => {
    setCourse({ ...course, enrolled: true });
    setSelectedTab("Lesson");
  };

  // Tab disabling logic (not used, but left if needed for future)
  const tabDisabled = (tab: (typeof TAB_LABELS)[number]) => {
    return false;
  };

  // Which lesson items should be locked for not enrolled users
  const lessonLocked = (lessonIndex: number) => !course.enrolled && lessonIndex > 0;

  // Renderers

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
          <Ionicons name="star" color="#FFAC33" size={16} />
          <Text style={styles.ratingText}>
            {course.rating} ({course.reviewsCount})
          </Text>
          <Ionicons name="stats-chart-outline" size={16} color={colors.primary} style={{ marginLeft: 16 }} />
          <Text style={styles.metaText}>{course.level}</Text>
          <Ionicons name="time-outline" size={16} color={colors.primary} style={{ marginLeft: 16 }} />
          <Text style={styles.metaText}>{course.duration}</Text>
        </View>
        <Text style={styles.sectionLabel}>Description</Text>
        <Text style={styles.description}>{course.overview}</Text>
        <Text style={styles.sectionLabel}>Requirements</Text>
        <Text style={styles.requirementsText}>{course.requirements}</Text>
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
        {course.curriculum.map((lesson, idx) => {
          const locked = lessonLocked(idx);
          let iconName = locked ? "lock-closed" : "play-circle";
          let iconColor = locked ? colors.light.textTertiary : colors.primary;

          return (
            <TouchableOpacity
              key={lesson.id}
              style={[styles.lessonItem, locked && styles.lockedLesson]}
              onPress={() => {
                if (locked) return;
                if (idx === 0 && !course.enrolled) {
                  setShowDemoVideo(true);
                } else {
                  // @ts-ignore: navigation type not strictly checked here
                  navigation.navigate?.("VideoPlayer", { lessonId: lesson.id });
                }
              }}
              activeOpacity={locked ? 1 : 0.7}
            >
              <View style={styles.lessonNumber}>
                <Text style={styles.lessonNumberText}>{idx + 1}</Text>
              </View>
              <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonDuration}>{lesson.duration}</Text>
              </View>
              <Ionicons name={iconName as any} size={24} color={iconColor} />
            </TouchableOpacity>
          );
        })}
        {/* Demo video modal inline */}
        {showDemoVideo && (
          <View style={styles.demoVideoWrapper}>
            <Text style={styles.demoVideoLabel}>Demo Video Preview</Text>
            <Video
              source={{ uri: course.curriculum[0].video }}
              style={styles.demoVideo}
              useNativeControls
              resizeMode="contain"
              isLooping={false}
            />
            <TouchableOpacity
              onPress={() => setShowDemoVideo(false)}
              style={styles.closeVideoBtn}
            >
              <Ionicons name="close-circle" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    );
  }

  function renderReviews() {
    return (
      <ScrollView
        style={styles.tabScroll}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Reviews</Text>
        {course.reviews.map((review) => (
          <View style={styles.reviewItem} key={review.id}>
            <View style={styles.reviewHeader}>
              <Image
                source={{ uri: review.userAvatar }}
                style={styles.reviewAvatar}
              />
              <View style={styles.reviewUserCol}>
                <Text style={styles.reviewUser}>{review.user}</Text>
                <View style={styles.reviewStarsRow}>
                  {[...Array(5)].map((_, i) => (
                    <Ionicons
                      key={i}
                      name="star"
                      size={13}
                      color={i < review.rating ? "#FFAC33" : "#E2E8F0"}
                      style={{ marginRight: 2 }}
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <Text style={styles.reviewText}>{review.text}</Text>
            <View style={styles.reviewFooter}>
              <Ionicons name="thumbs-up-outline" size={16} color={colors.primary} />
              <Text style={styles.reviewLikes}>{review.likes}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Image source={{ uri: course.thumbnail }} style={styles.heroImage} />
        <View style={styles.courseTabsBar}>
          {TAB_LABELS.map((tab) => {
            const isActive = selectedTab === tab;
            const disabled = tabDisabled(tab);
            return (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabBtn,
                  isActive && styles.tabBtnActive,
                  disabled && styles.tabBtnDisabled,
                ]}
                onPress={() => !disabled && setSelectedTab(tab as any)}
                disabled={!!disabled}
                activeOpacity={disabled ? 1 : 0.8}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    isActive && styles.tabBtnTextActive,
                    disabled && styles.tabBtnTextDisabled,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.tabContentArea}>
          {selectedTab === "Overview" && renderOverview()}
          {selectedTab === "Lesson" && renderLessons()}
          {selectedTab === "Review" && renderReviews()}
        </View>
      </ScrollView>
      {!course.enrolled && (
        <View style={styles.bottomCta}>
          <TouchableOpacity style={styles.enrollButton} onPress={enroll} activeOpacity={0.8}>
            <Text style={styles.enrollButtonText}>GET ENROLLED</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  heroImage: {
    width: "100%",
    height: 240,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginBottom: spacing.md,
    resizeMode: "cover",
  },
  courseTabsBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    marginTop: -40,
    paddingVertical: 6,
    ...shadows.sm,
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
  tabBtnDisabled: {
    opacity: 0.45,
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
  tabBtnTextDisabled: {
    color: colors.light.textTertiary,
  },
  tabContentArea: {
    minHeight: width / 1.1,
    backgroundColor: "#fff",
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    // no shadow, flat body
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
  sectionLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
    color: colors.light.textTertiary,
  },
  overviewStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    gap: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFAC33",
    marginLeft: 4,
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginLeft: 4,
  },
  description: {
    fontSize: 15,
    color: colors.light.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  requirementsText: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: spacing.sm,
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
    opacity: 0.4,
  },
  lessonNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.light.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
    borderWidth: 1,
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
  demoVideoWrapper: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(10,10,40,0.95)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
    padding: spacing.lg,
  },
  demoVideoLabel: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 18,
  },
  demoVideo: {
    width: width * 0.85,
    height: width * 0.48,
    borderRadius: borderRadius.md,
    backgroundColor: "#222",
    marginBottom: 18,
  },
  closeVideoBtn: {
    marginTop: 4,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.38)",
    borderRadius: 32,
    padding: 4,
  },
  reviewItem: {
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E0E7FF",
    marginRight: 10,
  },
  reviewUserCol: {
    flex: 1,
    marginLeft: 4,
    justifyContent: "center",
  },
  reviewUser: {
    fontSize: 15,
    fontWeight: "bold",
    color: colors.primary,
  },
  reviewStarsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  reviewDate: {
    fontSize: 11,
    color: colors.light.textTertiary,
    marginLeft: 6,
  },
  reviewText: {
    fontSize: 14,
    color: colors.light.text,
    marginBottom: 6,
  },
  reviewFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewLikes: {
    marginLeft: 5,
    fontSize: 13,
    color: colors.light.textSecondary,
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
    justifyContent: "center",
    alignItems: "center",
    ...shadows.md,
  },
  enrollButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

