import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, PermissionsAndroid } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing } from "@/theme/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useState, useEffect, useRef } from "react"
import {
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  RtcSurfaceView,
  VideoSourceType,
} from 'react-native-agora'
import counselorService from "@/services/counselor.service"
import consultationService from "@/services/consultation.service"
import { CustomToast } from "@/components/CustomToast"


interface RouteParams {
  meetingId: string
  token: string
  appId: string
  channelName: string
  userType: 'user' | 'counselor'
  participantName?: string
}

export default function UnifiedVideoCallScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { meetingId, token, appId, channelName, userType, participantName } = route.params as RouteParams

  const agoraEngineRef = useRef<IRtcEngine | null>(null)
  const [isJoined, setIsJoined] = useState(false)
  const [remoteUid, setRemoteUid] = useState<number | null>(null)
  const [muted, setMuted] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [duration, setDuration] = useState(0)
  const durationInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    requestPermissionsAndInit()
    
    // Start duration timer
    durationInterval.current = setInterval(() => {
      setDuration(prev => prev + 1)
    }, 1000)

    return () => {
      cleanup()
    }
  }, [])

  const requestPermissionsAndInit = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ])

        if (
          granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('✅ Camera and microphone permissions granted')
          initAgora()
        } else {
          console.log('❌ Permissions denied')
          Alert.alert(
            'Permissions Required',
            'Camera and microphone permissions are required for video calls',
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          )
        }
      } catch (err) {
        console.warn(err)
      }
    } else {
      initAgora()
    }
  }

  const initAgora = async () => {
    try {
      console.log("🎥 [UnifiedVideoCall] Initializing Agora...")
      console.log("  - App ID:", appId?.substring(0, 10))
      console.log("  - Channel:", channelName)
      console.log("  - User Type:", userType)

      // Create & initialize the Agora RTC engine
      const engine = createAgoraRtcEngine()
      
      engine.initialize({
        appId: appId,
        channelProfile: ChannelProfileType.ChannelProfileCommunication,
      })

      agoraEngineRef.current = engine

      // IMPORTANT: Enable video and audio BEFORE joining
      console.log("📹 Enabling video...")
      engine.enableVideo()
      
      console.log("🎤 Enabling audio...")
      engine.enableAudio()

      // Start local video preview
      console.log("👁️ Starting preview...")
      engine.startPreview()

      // Register event handlers BEFORE joining
      engine.registerEventHandler({
        onJoinChannelSuccess: (connection, elapsed) => {
          console.log('✅ [Agora] Successfully joined channel:', channelName)
          console.log('   Connection:', connection)
          console.log('   Elapsed:', elapsed)
          setIsJoined(true)
          
          CustomToast.show({
            type: 'success',
            text1: 'Connected',
            text2: 'You are now in the meeting'
          })
        },
        
        onUserJoined: (connection, uid, elapsed) => {
          console.log('👤 [Agora] Remote user joined:', uid)
          setRemoteUid(uid)
          
          CustomToast.show({
            type: 'info',
            text1: 'Participant Joined',
            text2: `${participantName || 'Other participant'} joined the meeting`
          })
        },
        
        onUserOffline: (connection, uid, reason) => {
          console.log('👋 [Agora] Remote user left:', uid, 'Reason:', reason)
          setRemoteUid(null)
          
          CustomToast.show({
            type: 'info',
            text1: 'Participant Left',
            text2: `${participantName || 'Other participant'} left the meeting`
          })
        },

        onError: (err, msg) => {
          console.error('❌ [Agora] Error:', err, msg)
        },
      })

      // Join the channel
      console.log("🔄 [Agora] Joining channel...")
      await engine.joinChannel(token, channelName, 0, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      })

      console.log("✅ [Agora] Join channel command sent")

    } catch (error) {
      console.error('❌ [UnifiedVideoCall] Agora initialization error:', error)
      CustomToast.show({
        type: 'error',
        text1: 'Connection Error',
        text2: 'Failed to initialize video call'
      })
    }
  }

  const cleanup = async () => {
    try {
      if (durationInterval.current) {
        clearInterval(durationInterval.current)
      }

      if (agoraEngineRef.current) {
        console.log("🧹 [UnifiedVideoCall] Cleaning up Agora...")
        await agoraEngineRef.current.leaveChannel()
        agoraEngineRef.current.unregisterEventHandler({})
        agoraEngineRef.current.release()
      }
    } catch (error) {
      console.error('Cleanup error:', error)
    }
  }

  const toggleMute = () => {
    if (agoraEngineRef.current) {
      const newMutedState = !muted
      agoraEngineRef.current.muteLocalAudioStream(newMutedState)
      setMuted(newMutedState)
      
      CustomToast.show({
        type: 'info',
        text1: newMutedState ? 'Microphone Off' : 'Microphone On'
      })
    }
  }

  const toggleVideo = () => {
    if (agoraEngineRef.current) {
      const newVideoState = !videoEnabled
      agoraEngineRef.current.muteLocalVideoStream(!newVideoState)
      setVideoEnabled(newVideoState)
      
      CustomToast.show({
        type: 'info',
        text1: newVideoState ? 'Camera On' : 'Camera Off'
      })
    }
  }

  const switchCamera = () => {
    if (agoraEngineRef.current) {
      agoraEngineRef.current.switchCamera()
      CustomToast.show({
        type: 'info',
        text1: 'Camera Switched'
      })
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
              if (userType === 'counselor') {
                await consultationService.endMeeting(meetingId)
              } else {
                await counselorService.endMeeting(meetingId)
              }
              
              // Cleanup Agora
              await cleanup()
              
              // Navigate back or to summary
              navigation.goBack()
              
              CustomToast.show({
                type: 'success',
                text1: 'Meeting Ended',
                text2: `Duration: ${formatDuration(duration)}`
              })
            } catch (error: any) {
              console.error('End call error:', error)
              await cleanup()
              navigation.goBack()
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
      {/* Remote Video (Full Screen) */}
      <View style={styles.fullscreenVideo}>
        {remoteUid !== null ? (
          <RtcSurfaceView
            canvas={{
              uid: remoteUid,
              sourceType: VideoSourceType.VideoSourceRemote,
            }}
            style={styles.videoView}
          />
        ) : (
          <View style={styles.waitingView}>
            <Ionicons name="person-circle-outline" size={120} color="#FFFFFF" />
            <Text style={styles.waitingText}>Waiting for {participantName || 'other participant'}...</Text>
          </View>
        )}
      </View>

      {/* Local Video (Small Preview) */}
      <View style={styles.localVideoContainer}>
        {videoEnabled ? (
          <RtcSurfaceView
            canvas={{
              uid: 0,
              sourceType: VideoSourceType.VideoSourceCamera,
            }}
            style={styles.localVideo}
            zOrderMediaOverlay={true}
          />
        ) : (
          <View style={[styles.localVideo, styles.videoOff]}>
            <Ionicons name="videocam-off" size={32} color="#FFFFFF" />
          </View>
        )}
      </View>

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.durationBadge}>
          <View style={[styles.recordingDot, { backgroundColor: isJoined ? colors.success : colors.error }]} />
          <Text style={styles.durationText}>{formatDuration(duration)}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{isJoined ? 'Connected' : 'Connecting...'}</Text>
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

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={switchCamera}
        >
          <Ionicons name="camera-reverse" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  fullscreenVideo: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  videoView: {
    flex: 1,
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
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  localVideoContainer: {
    position: 'absolute',
    top: 80,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFFFFF50',
  },
  localVideo: {
    flex: 1,
    backgroundColor: '#2a2a3e',
  },
  videoOff: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
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
    gap: 20,
    paddingHorizontal: spacing.lg,
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
})
