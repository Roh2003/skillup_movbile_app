import { View, StyleSheet, TouchableOpacity, Text, StatusBar } from "react-native"
import { Video, ResizeMode } from "expo-av"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"


export default function VideoPlayerScreen() {
  const navigation = useNavigation()

  return (
    <SafeAreaProvider style={styles.container}>
      <StatusBar hidden />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.videoTitle}>Lesson 1: Introduction</Text>
      </View>

      <View style={styles.videoContainer}>
        <Video
          style={styles.video}
          source={{ uri: "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4" }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          isLooping={false}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.infoText}>Auto-playing next lesson in 5s...</Text>
      </View>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    zIndex: 10,
  },
  backButton: {
    marginRight: 16,
  },
  videoTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  video: {
    width: "100%",
    aspectRatio: 16 / 9,
  },
  footer: {
    padding: 24,
    alignItems: "center",
  },
  infoText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
  },
})
