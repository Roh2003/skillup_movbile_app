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
import { colors, spacing, borderRadius } from "@/theme/colors";
import { CustomToast } from "@/components/CustomToast"
import consultationService from "@/services/consultation.service";
import { AGORA_APP_ID } from "../../../constants/config";

// Note: You'll need to install react-native-agora
// For now, this is a placeholder structure showing the UI and logic flow

export default function MeetingRoomScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { meetingId, counselorName } = route.params;

  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [muted, setMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [remoteVideoEnabled, setRemoteVideoEnabled] = useState(false);
  const [duration, setDuration] = useState(0);
  const [agoraToken, setAgoraToken] = useState<string | null>(null);
  const [channelName, setChannelName] = useState<string | null>(null);

  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeMeeting();

    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
      handleEndCall();
    };
  }, []);

  const initializeMeeting = async () => {
    try {
      setLoading(true);
      const response = await consultationService.getMeetingDetails(meetingId);

      if (response.success) {
        const { agoraToken, channelName } = response.data;
        setAgoraToken(agoraToken);
        setChannelName(channelName);

        // Here you would initialize Agora SDK
        // await initializeAgora(agoraToken, channelName);
        
        setConnected(true);
        startDurationTimer();
        
        CustomToast.show({
          type: "success",
          text1: "Connected",
          text2: "Video call connected successfully",
        });
      } else {
        throw new Error(response.message || "Failed to get meeting details");
      }
    } catch (error: any) {
      console.error("Initialize meeting error:", error);
      CustomToast.show({
        type: "error",
        text1: "Connection Failed",
        text2: error.response?.data?.message || "Failed to connect to meeting",
      });
      navigation.goBack();
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
    // Agora: engine.muteLocalAudioStream(!muted);
    CustomToast.show({
      type: "info",
      text1: muted ? "Microphone On" : "Microphone Off",
    });
  };

  const handleToggleVideo = () => {
    setVideoEnabled(!videoEnabled);
    // Agora: engine.muteLocalVideoStream(!videoEnabled);
    CustomToast.show({
      type: "info",
      text1: videoEnabled ? "Camera Off" : "Camera On",
    });
  };

  const handleSwitchCamera = () => {
    // Agora: engine.switchCamera();
    CustomToast.show({
      type: "info",
      text1: "Camera Switched",
    });
  };

  const handleEndCall = async () => {
    Alert.alert(
      "End Call",
      "Are you sure you want to end this call?",
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

              // Agora: engine.leaveChannel();
              
              await consultationService.endMeeting(meetingId);
              
              CustomToast.show({
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
      {/* Remote Video View (Counselor) */}
      <View style={styles.remoteVideoContainer}>
        {remoteVideoEnabled ? (
          <View style={styles.videoPlaceholder}>
            {/* Agora Remote Video View would go here */}
            <Ionicons name="videocam" size={48} color="#FFFFFF" />
            <Text style={styles.placeholderText}>Counselor Video</Text>
          </View>
        ) : (
          <View style={styles.videoPlaceholder}>
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={64} color={colors.primary} />
            </View>
            <Text style={styles.placeholderName}>{counselorName || "Counselor"}</Text>
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
            {/* Agora Local Video View would go here */}
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
