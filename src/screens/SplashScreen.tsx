import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Image, Animated } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import LottieView from "lottie-react-native"
import { colors } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { useNavigation } from "@react-navigation/native"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { RootStackParamList } from "../../types/navigation"

export default function SplashScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  const logoAnim = useRef(new Animated.Value(0)).current
  const textAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start()

    const timer = setTimeout(() => {
      navigation.replace("Onboarding")
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <LinearGradient
      colors={[colors.primaryDark, colors.primary]}
      style={styles.container}
    >
      {/* Illustration (supporting, not hero) */}
      <LottieView
        source={require("../../public/OnlineLearning.json")}
        autoPlay
        loop
        style={styles.lottie}
      />

      {/* Brand */}
      <Animated.View
        style={[
          styles.brand,
          {
            opacity: logoAnim,
            transform: [
              {
                scale: logoAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../../public/skilluplogo.png")}
            style={styles.logo}
          />
        </View>

        <Animated.View
          style={{
            opacity: textAnim,
            transform: [
              {
                translateY: textAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [8, 0],
                }),
              },
            ],
          }}
        >
          <Text style={styles.title}>SkillUp</Text>
          <Text style={styles.tagline}>Learn. Grow. Consult.</Text>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  lottie: {
    width: 280,
    height: 280,
    marginBottom: 30,
    opacity: 0.9,
  },

  brand: {
    alignItems: "center",
  },

  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  logo: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    borderRadius: 44,
  },

  title: {
    fontSize: 34,
    fontFamily: typography.fontFamily.bold,
    color: "#fff",
    textAlign: "center",
  },

  tagline: {
    fontSize: 15,
    fontFamily: typography.fontFamily.medium,
    color: "rgba(255,255,255,0.8)",
    marginTop: 6,
    textAlign: "center",
  },
})
