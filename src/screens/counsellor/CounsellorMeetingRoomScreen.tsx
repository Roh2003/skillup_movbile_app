import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/theme/colors";
import Toast from "react-native-toast-message";
import consultationService from "@/services/consultation.service";

// Same structure as MeetingRoomScreen but for counselors

export default function CounsellorMeetingRoomScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { meetingId, learnerName } = route.params;

  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [remoteVideoEnabled, setRemoteVideoEnabled] = useState(false);
  const [duration, setDuration] = useState(0);
  const [connectionFailed, setConnectionFailed] = useState(false);

  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeMeeting();

    return () => {
      // Cleanup: Only clear interval, don't call handleEndCall
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
    };
  }, []);

  const initializeMeeting = async () => {
    try {
      setLoading(true);
      console.log("🎥 [CounsellorMeetingRoom] Initializing meeting with ID:", meetingId);
      
      // Call joinMeeting API to:
      // 1. Mark counselor as joined in database
      // 2. Get Agora token and channel name
      // 3. Check if both participants have joined
      console.log("📝 [CounsellorMeetingRoom] Calling joinMeeting API...");
      const response = await consultationService.joinMeeting(meetingId, 'counselor');
      console.log("📦 [CounsellorMeetingRoom] Join meeting response:", response);

      if (response.success || response.data) {
        const joinData = response.data || response;
        
        if (!joinData.canJoin) {
          throw new Error(joinData.message || "Cannot join meeting at this time");
        }

        const { token, channelName, appId, meetingStatus, waitingFor } = joinData;
        
        console.log("✅ [CounsellorMeetingRoom] Got Agora credentials");
        console.log("  - Channel:", channelName);
        console.log("  - Token (first 20 chars):", token?.substring(0, 20));
        console.log("  - Meeting Status:", meetingStatus);
        console.log("  - Waiting For:", waitingFor);
        
        // Navigate to unified video call screen
        navigation.replace("UnifiedVideoCall", {
          meetingId,
          token,
          appId,
          channelName,
          userType: 'counselor',
          participantName: learnerName || 'Learner'
        });
      } else {
        throw new Error(response.message || "Failed to join meeting");
      }
    } catch (error: any) {
      console.error("❌ [CounsellorMeetingRoom] Initialize meeting error:", error);
      console.error("Error details:", error.response?.data);
      
      setConnectionFailed(true);
      
      Toast.show({
        type: "error",
        text1: "Connection Failed",
        text2: error.response?.data?.message || error.message || "Failed to connect to meeting",
      });
      
      // Wait a bit before navigating back to show the error toast
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const startDurationTimer = () => {
    durationInterval.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleToggleMute = () => {
    setMuted(!muted);
    Toast.show({
      type: "info",
      text1: muted ? "Microphone On" : "Microphone Off",
    });
  };

  const handleToggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    Toast.show({
      type: "info",
      text1: videoEnabled ? "Camera Off" : "Camera On",
    });
  };

  const handleSwitchCamera = () => {
    Toast.show({
      type: "info",
      text1: "Camera Switched",
    });
  };

  const handleEndCall = () => {
    // Don't show alert if connection failed
    if (connectionFailed) {
      return;
    }

    Alert.alert(
      "End Call",
      "Are you sure you want to end this consultation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Call",
          style: "destructive",
          onPress: async () => {
            try {
              if (durationInterval.current) {
                clearInterval(durationInterval.current);
              }

              await consultationService.endMeeting(meetingId);
              
              Toast.show({
                type: "success",
                text1: "Call Ended",
                text2: `Duration: ${formatDuration(duration)}`,
              });
              
              navigation.goBack();
            } catch (error) {
              console.error("End call error:", error);
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Connecting to meeting...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Remote Video View (Learner) */}
      <View style={styles.remoteVideoContainer}>
        {remoteVideoEnabled ? (
          <View style={styles.videoPlaceholder}>
            <Ionicons name="videocam" size={48} color="#FFFFFF" />
            <Text style={styles.placeholderText}>Learner Video</Text>
          </View>
        ) : (
          <View style={styles.videoPlaceholder}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={64} color={colors.primary} />
            </View>
            <Text style={styles.placeholderName}>{learnerName || "Learner"}</Text>
          </View>
        )}

        {/* Connection Status */}
        <View style={styles.statusBadge}>
          <View style={styles.connectedDot} />
          <Text style={styles.statusText}>Connected</Text>
        </View>

        {/* Duration Timer */}
        <View style={styles.durationBadge}>
          <Ionicons name="time-outline" size={16} color="#FFFFFF" />
          <Text style={styles.durationText}>{formatDuration(duration)}</Text>
        </View>
      </View>

      {/* Local Video View (Self) */}
      <View style={styles.localVideoContainer}>
        {videoEnabled ? (
          <View style={styles.localVideo}>
            <Ionicons name="person" size={32} color="#FFFFFF" />
          </View>
        ) : (
          <View style={[styles.localVideo, styles.videoOff]}>
            <Ionicons name="videocam-off" size={32} color="#FFFFFF" />
          </View>
        )}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, muted && styles.controlButtonActive]}
          onPress={handleToggleMute}
        >
          <Ionicons
            name={muted ? "mic-off" : "mic"}
            size={28}
            color={muted ? colors.error : "#FFFFFF"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, !videoEnabled && styles.controlButtonActive]}
          onPress={handleToggleVideo}
        >
          <Ionicons
            name={videoEnabled ? "videocam" : "videocam-off"}
            size={28}
            color={!videoEnabled ? colors.error : "#FFFFFF"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleSwitchCamera}
        >
          <Ionicons name="camera-reverse" size={28} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={handleEndCall}
        >
          <Ionicons name="call" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A2E",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#FFFFFF",
  },
  remoteVideoContainer: {
    flex: 1,
    backgroundColor: "#0F0F1E",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  videoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  placeholderText: {
    marginTop: 16,
    fontSize: 16,
    color: "#FFFFFF80",
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#2A2A3E",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  placeholderName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  statusBadge: {
    position: "absolute",
    top: 20,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  durationBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  durationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  localVideoContainer: {
    position: "absolute",
    top: 80,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFFFFF50",
  },
  localVideo: {
    flex: 1,
    backgroundColor: "#2A2A3E",
    justifyContent: "center",
    alignItems: "center",
  },
  videoOff: {
    backgroundColor: "#1A1A2E",
  },
  controls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: spacing.lg,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2A2A3E",
    justifyContent: "center",
    alignItems: "center",
  },
  controlButtonActive: {
    backgroundColor: colors.error,
  },
  endCallButton: {
    backgroundColor: colors.error,
    width: 64,
    height: 64,
    borderRadius: 32,
  },
});
