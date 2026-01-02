import { useEffect } from "react"
import { View, Text, StyleSheet, Image, Animated, Dimensions } from "react-native"
import { colors } from "@/theme/colors"
import { typography } from "@/theme/typography"

const { width } = Dimensions.get("window")

export default function SplashScreen() {
  const fadeAnim = new Animated.Value(0)
  const scaleAnim = new Animated.Value(0.8)

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=200" }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>SkillUp</Text>
        <Text style={styles.tagline}>Learn. Grow. Consult.</Text>
      </Animated.View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Loading your learning journey...</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    width: 120,
    height: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  title: {
    fontSize: 40,
    fontFamily: typography.fontFamily.bold,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    fontFamily: typography.fontFamily.medium,
    color: "rgba(255, 255, 255, 0.9)",
  },
  footer: {
    position: "absolute",
    bottom: 50,
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
  },
})
