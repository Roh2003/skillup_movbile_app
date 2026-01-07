import React, { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { Ionicons } from "@expo/vector-icons"
import LottieView from "lottie-react-native"

const { width } = Dimensions.get("window")

const onboardingData = [
  {
    id: 1,
    title: "Discover a New way to Learn",
    description: "Personalized courses and hands-on challenges—unlock your potential with interactive and engaging learning experiences.",
    lottie: require("../../public/new-way-to-learn.json"),
    icon: "Ionicons:school-outline",
  },
  {
    id: 2,
    title: "Elevate Your Skill With Us",
    description: "Advance your knowledge and gain career-ready skills from curated content and tracked progress. Grow into the version of yourself you aspire to be.",
    lottie: require("../../public/Revenue.json"),
    icon: "Ionicons:rocket-outline",
  },
  {
    id: 3,
    title: "Real-World Experts",
    description: "Learn directly from leading professionals and industry experts. Get insights, advice, and mentorship from those who’ve done it before.",
    lottie: require("../../public/SKILLED-TEAM.json"),
    icon: "Ionicons:people-outline",
  },
  {
    id: 4,
    title: "Earn Certificates",
    description: "Showcase your achievements with verified certificates—demonstrate your skills and boost your professional profile with every course you complete.",
    lottie: require("../../public/Certificate.json"),
    icon: "Ionicons:certificate-outline",
  },
]

export default function OnboardingScreen() {
  const navigation = useNavigation<any>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const imageScrollRef = useRef<ScrollView>(null)

  // Only for images (center illustrations)
  const handleImageScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x
    const idx = Math.round(offsetX / width)
    setCurrentIndex(idx)
  }

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1
      imageScrollRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      })
    } else {
      navigation.replace("RoleSelection")
    }
  }

  const handleSkip = () => {
    navigation.replace("RoleSelection")
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header fixed Skip Button */}
      {currentIndex < onboardingData.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>SKIP</Text>
        </TouchableOpacity>
      )}

      {/* The entire onboarding screen is a single page, only image can scroll horizontally */}
      <View style={styles.pageWrapper}>
        {/* Illustrations Center (scrollable horizontally only for illustration area) */}
        <View style={styles.illustrationScrollWrapper}>
          <ScrollView
            ref={imageScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            scrollEventThrottle={16}
            style={styles.illustrationScroll}
            contentContainerStyle={{ alignItems: "center" }}
          >
            {onboardingData.map((item) => (
              <View key={item.id} style={styles.illustrationContainer}>
                <View style={styles.illustration}>
                  {"lottie" in item && item.lottie ? (
                    <LottieView
                      source={item.lottie}
                      autoPlay
                      loop
                      style={{ width: 250, height: 240 }}
                    />
                  ) : (
                    <Ionicons name={item.icon as any} size={130} color={colors.primary} />
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Title, Description, Pagination, Continue are fixed */}
        <View style={styles.content}>
          <Text style={styles.title}>{onboardingData[currentIndex].title}</Text>
          <Text style={styles.description}>{onboardingData[currentIndex].description}</Text>

          <View style={styles.pagination}>
            {onboardingData.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === currentIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
            <Text style={styles.continueButtonText}>CONTINUE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  pageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 90,
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  skipText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  // Illustration scroll area
  illustrationScrollWrapper: {
    width: "100%",
    height: 300,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 64,
  },
  illustrationScroll: {
    width: width,
    height: 300,
  },
  illustrationContainer: {
    width: width,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 0,
  },
  illustration: {
    width: 300,
    height: 300,
    backgroundColor: colors.green[50],
    borderRadius: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    paddingBottom: 40,
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 28,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 36,
  },
  description: {
    fontSize: 16,
    fontFamily: typography.fontFamily.regular,
    color: colors.light.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.light.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
})

