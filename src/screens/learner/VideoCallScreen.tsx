import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing } from "@/theme/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useState, useEffect } from "react"
import {
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
  ClientRoleType,
} from 'react-native-agora'
import counselorService from "@/services/counselor.service"
import Toast from "react-native-toast-message"

const { width, height } = Dimensions.get('window')

export default function VideoCallScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { meetingId, token, appId, channelName } = route.params

  const [engine, setEngine] = useState<IRtcEngine | null>(null)
  const [joined, setJoined] = useState(false)
  const [remoteUid, setRemoteUid] = useState<number | null>(null)
  const [muted, setMuted] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    initAgora()
    
    // Timer
    const timer = setInterval(() => {
      setDuration(prev => prev + 1)
    }, 1000)

    return () => {
      clearInterval(timer)
      if (engine) {
        engine.leaveChannel()
        engine.release()
      }
    }
  }, [])

  const initAgora = async () => {
    try {
      // Create RTC engine
      const agoraEngine = createAgoraRtcEngine()
      
      // Initialize engine
      agoraEngine.initialize({
        appId: appId,
      })
      
      // Enable video
      agoraEngine.enableVideo()
      
      // Register event handlers
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: (_connection, elapsed) => {
          console.log('JoinChannelSuccess:', elapsed)
          setJoined(true)
        },
        onUserJoined: (_connection, uid) => {
          console.log('UserJoined:', uid)
          setRemoteUid(uid)
        },
        onUserOffline: (_connection, uid) => {
          console.log('UserOffline:', uid)
          setRemoteUid(null)
        },
      })
      
      // Set channel profile
      agoraEngine.setChannelProfile(ChannelProfileType.ChannelProfileCommunication)
      
      // Set client role (for live broadcasting, use Broadcaster)
      agoraEngine.setClientRole(ClientRoleType.ClientRoleBroadcaster)
      
      // Join channel
      agoraEngine.joinChannel(token, channelName, 0, {})
      
      setEngine(agoraEngine)
    } catch (error) {
      console.error('Agora init error:', error)
      Toast.show({
        type: 'error',
        text1: 'Connection Error',
        text2: 'Failed to join video call'
      })
    }
  }

  const toggleMute = () => {
    if (engine) {
      engine.muteLocalAudioStream(!muted)
      setMuted(!muted)
    }
  }

  const toggleVideo = () => {
    if (engine) {
      engine.muteLocalVideoStream(!videoEnabled)
      setVideoEnabled(!videoEnabled)
    }
  }

  const handleEndCall = () => {
    Alert.alert(
      'End Meeting',
      'Are you sure you want to end this meeting?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'End',
          style: 'destructive',
          onPress: async () => {
            try {
              // End meeting on backend
              await counselorService.endMeeting(meetingId)
              
              // Leave Agora channel
              if (engine) {
                await engine.leaveChannel()
                await engine.release()
              }
              
              // Navigate to summary
              navigation.replace('MeetingSummary', { 
                meetingId,
                duration 
              })
            } catch (error: any) {
              console.error('End call error:', error)
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to end meeting'
              })
            }
          }
        }
      ]
    )
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      {/* Video Container - For V4, you'll need to use native view rendering via expo-gl or similar */}
      <View style={styles.videoContainer}>
        {/* Placeholder for video views - Agora V4 requires specific native view setup */}
        <View style={styles.videoPlaceholder}>
          {remoteUid ? (
            <View style={styles.connectedView}>
              <Ionicons name="videocam" size={80} color="#FFFFFF" />
              <Text style={styles.connectedText}>Connected with ID: {remoteUid}</Text>
              <Text style={styles.videoNote}>
                📹 Video rendering requires native view setup
              </Text>
            </View>
          ) : (
            <View style={styles.waitingView}>
              <Ionicons name="person-circle-outline" size={120} color="#FFFFFF" />
              <Text style={styles.waitingText}>Waiting for other participant...</Text>
            </View>
          )}
        </View>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.durationBadge}>
            <View style={[styles.recordingDot, { backgroundColor: joined ? colors.success : colors.error }]} />
            <Text style={styles.durationText}>{formatDuration(duration)}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{joined ? 'Connected' : 'Connecting...'}</Text>
          </View>
        </View>

        {/* Bottom Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={[styles.controlButton, muted && styles.controlButtonActive]}
            onPress={toggleMute}
          >
            <Ionicons 
              name={muted ? 'mic-off' : 'mic'} 
              size={28} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.endCallButton}
            onPress={handleEndCall}
          >
            <Ionicons name="call" size={32} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, !videoEnabled && styles.controlButtonActive]}
            onPress={toggleVideo}
          >
            <Ionicons 
              name={videoEnabled ? 'videocam' : 'videocam-off'} 
              size={28} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color="#FFFFFF" />
          <Text style={styles.infoText}>
            Audio is working. Video display requires additional native setup.
          </Text>
        </View>
      </View>
      <Toast />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  videoContainer: {
    flex: 1,
  },
  videoPlaceholder: {
    width: width,
    height: height,
    backgroundColor: colors.primary,
  },
  connectedView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  connectedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: spacing.lg,
  },
  videoNote: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: spacing.md,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
    opacity: 0.8,
  },
  waitingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  waitingText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: spacing.lg,
  },
  topBar: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  durationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  statusBadge: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonActive: {
    backgroundColor: colors.error,
  },
  endCallButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ rotate: '135deg' }],
  },
  infoBanner: {
    position: 'absolute',
    bottom: 130,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: spacing.md,
    borderRadius: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#FFFFFF',
  },
})
