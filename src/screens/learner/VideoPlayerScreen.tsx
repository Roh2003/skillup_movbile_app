import { useState, useCallback, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import YoutubePlayer from "react-native-youtube-iframe";
import { colors, spacing, borderRadius } from "@/theme/colors";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get("window");

export default function VideoPlayerScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { lessonId, courseId, lessonTitle, videoUrl } = route.params;

  const [playing, setPlaying] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    if (!url) {
      console.log("❌ No URL provided");
      return null;
    }
    
    // Handle different YouTube URL formats
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    
    console.log("RegExp match:", match);
    
    if (match && match[7] && match[7].length === 11) {
      console.log("✅ Extracted video ID:", match[7]);
      return match[7];
    }
    
    console.log("❌ Could not extract video ID");
    return null;
  };

  const videoId = getYouTubeVideoId(videoUrl);

  const onStateChange = useCallback((state: string) => {
    if (state === "ended") {
      setCompleted(true);
      setPlaying(false);
      Toast.show({
        type: "success",
        text1: "Lesson Completed!",
        text2: "Great job! Moving to next lesson...",
      });
    }
  }, []);

  const handleNextLesson = () => {
    // Navigate to next lesson (you'll need to pass next lesson data)
    Toast.show({
      type: "info",
      text1: "Next Lesson",
      text2: "Loading next lesson...",
    });
    navigation.goBack();
  };

  const handlePreviousLesson = () => {
    Toast.show({
      type: "info",
      text1: "Previous Lesson",
      text2: "Loading previous lesson...",
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.light.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {lessonTitle || "Video Lesson"}
          </Text>
          <Text style={styles.headerSubtitle}>Course Lesson</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.light.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Video Player */}
        
        <View style={styles.playerContainer}>
          {videoId ? (
              <YoutubePlayer
                height={width * 0.5625} // 16:9 aspect ratio
                width={width}
                play={playing}
                videoId={videoId}
                onChangeState={onStateChange}
                webViewStyle={styles.webView}
              />
          ) : (
            <View style={styles.noVideoContainer}>
              <Ionicons name="videocam-off-outline" size={64} color={colors.light.textTertiary} />
              <Text style={styles.noVideoText}>No video available</Text>
              <Text style={styles.noVideoSubtext}>
                {videoUrl ? "Invalid YouTube URL" : "Video URL not provided"}
              </Text>
            </View>
          )}
        </View>

        {/* Playback Controls */}
        {/* {videoId && (
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setPlaying(!playing)}
            >
              <Ionicons
                name={playing ? "pause" : "play"}
                size={32}
                color={colors.primary}
              />
              <Text style={styles.controlText}>{playing ? "Pause" : "Play"}</Text>
            </TouchableOpacity>

            {completed && (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text style={styles.completedText}>Completed</Text>
              </View>
            )}
          </View>
        )} */}

        {/* Lesson Info */}
        <View style={styles.lessonInfo}>
          <Text style={styles.lessonTitle}>{lessonTitle}</Text>
          <View style={styles.lessonMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="play-circle-outline" size={16} color={colors.primary} />
              <Text style={styles.metaText}>Video Lesson</Text>
            </View>
            {completed && (
              <View style={styles.metaItem}>
                <Ionicons name="checkmark-done" size={16} color={colors.success} />
                <Text style={[styles.metaText, { color: colors.success }]}>Completed</Text>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>About this lesson</Text>
          <Text style={styles.descriptionText}>
            Watch this video lesson to learn more about the topic. Take notes and practice along with the instructor.
          </Text>
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={handlePreviousLesson}
          >
            <Ionicons name="chevron-back" size={20} color={colors.primary} />
            <Text style={styles.navButtonText}>Previous Lesson</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={handleNextLesson}
          >
            <Text style={styles.navButtonTextWhite}>Next Lesson</Text>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.light.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginTop: 2,
  },
  moreButton: {
    padding: spacing.xs,
  },
  content: {
    flex: 1,
  },
  playerContainer: {
    width: width,
    height: width * 0.5625,
    backgroundColor: "#000",
  },
  webView: {
    backgroundColor: "#000",
  },
  noVideoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.light.surface,
  },
  noVideoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.light.text,
    marginTop: spacing.md,
  },
  noVideoSubtext: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginTop: spacing.xs,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
    backgroundColor: colors.light.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  controlButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  controlText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: `${colors.success}15`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  completedText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.success,
  },
  lessonInfo: {
    padding: spacing.lg,
    backgroundColor: colors.light.surface,
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  lessonMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
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
  descriptionContainer: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    fontSize: 15,
    color: colors.light.textSecondary,
    lineHeight: 22,
  },
  navigationContainer: {
    flexDirection: "row",
    padding: spacing.lg,
    gap: spacing.md,
  },
  navButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  nextButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },
  navButtonTextWhite: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
