import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing, borderRadius } from "@/theme/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useState, useEffect, useRef } from "react"
import counselorService from "@/services/counselor.service"
import { CustomToast } from "@/components/CustomToast"


export default function WaitingRoomScreen() {
    const navigation = useNavigation<any>()
    const route = useRoute<any>()
    const { meetingId } = route.params

    const [meeting, setMeeting] = useState<any>(null)
    const [joining, setJoining] = useState(true)
    const [agoraCredentials, setAgoraCredentials] = useState<any>(null)
    const pollInterval = useRef<any>(null)

    useEffect(() => {
        joinAndPollMeeting()

        return () => {
            if (pollInterval.current) {
                clearInterval(pollInterval.current)
            }
        }
    }, [])

    const joinAndPollMeeting = async () => {
        try {
            console.log("🚪 [WaitingRoom] Attempting to join meeting:", meetingId);
            console.log("📝 [WaitingRoom] Calling counselorService.joinMeeting with userType: user");
            
            // Call join meeting API
            const response = await counselorService.joinMeeting(meetingId)
            
            console.log("📦 [WaitingRoom] Join meeting response:", JSON.stringify(response, null, 2));

            if (response.data && response.data.canJoin) {
                console.log("✅ [WaitingRoom] Can join meeting");
                setAgoraCredentials(response.data)

                // Check if both joined
                if (response.data.meetingStatus === 'ONGOING') {
                    console.log("🎥 [WaitingRoom] Meeting is ONGOING - starting video call");
                    // Both participants ready, start video call
                    navigation.replace('UnifiedVideoCall', {
                        meetingId,
                        token: response.data.token,
                        appId: response.data.appId,
                        channelName: response.data.channelName,
                        userType: 'user',
                        participantName: 'Counselor'
                    })
                } else {
                    console.log("⏳ [WaitingRoom] Waiting for other participant");
                    // Waiting for other participant
                    setMeeting({ status: 'WAITING', waitingFor: response.data.waitingFor })

                    // Start polling for meeting status
                    console.log("🔄 [WaitingRoom] Starting polling...");
                    pollInterval.current = setInterval(async () => {
                        try {
                            const pollResponse = await counselorService.getMeetingById(meetingId)
                            const meetingData = pollResponse.data

                            console.log("📊 [WaitingRoom] Poll response:", {
                                counselorJoined: meetingData.counselorJoined,
                                userJoined: meetingData.userJoined
                            });

                            // Check if both have joined
                            if (meetingData.counselorJoined && meetingData.userJoined) {
                                console.log("✅ [WaitingRoom] Both joined! Starting video call");
                                clearInterval(pollInterval.current)

                                // Navigate to video call
                                navigation.replace('UnifiedVideoCall', {
                                    meetingId,
                                    token: response.data.token,
                                    appId: response.data.appId,
                                    channelName: response.data.channelName,
                                    userType: 'user',
                                    participantName: 'Counselor'
                                })
                            }
                        } catch (pollError) {
                            console.error('❌ [WaitingRoom] Poll error:', pollError)
                        }
                    }, 3000) // Poll every 3 seconds
                }
            } else {
                console.warn("⚠️ [WaitingRoom] Cannot join meeting - response:", response);
            }
        } catch (error: any) {
            console.error('❌ [WaitingRoom] Join meeting error:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            console.error('Error message:', error.message);

            if (error.response?.data?.data) {
                // Time validation error
                const { waitTime, scheduledTime } = error.response.data.data
                console.log("⏰ [WaitingRoom] Time validation error - too early");
                CustomToast.show({
                    type: 'info',
                    text1: 'Too Early',
                    text2: error.response.data.message || `Meeting starts in ${waitTime} minute(s)`
                })
                setTimeout(() => navigation.goBack(), 2000)
            } else {
                console.log("🚨 [WaitingRoom] General error - showing error CustomToast");
                CustomToast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: error.response?.data?.message || error.message || 'Failed to join meeting'
                })
                setTimeout(() => navigation.goBack(), 2000)
            }
        } finally {
            setJoining(false)
        }
    }

    const handleCancel = () => {
        if (pollInterval.current) {
            clearInterval(pollInterval.current)
        }
        navigation.goBack()
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Animated Waiting Indicator */}
                <View style={styles.waitingCircle}>
                    <View style={styles.outerRing}>
                        <View style={styles.middleRing}>
                            <View style={styles.innerCircle}>
                                {joining ? (
                                    <ActivityIndicator size="large" color={colors.primary} />
                                ) : (
                                    <Ionicons name="videocam" size={48} color={colors.primary} />
                                )}
                            </View>
                        </View>
                    </View>
                </View>

                {/* Status Text */}
                <Text style={styles.mainText}>
                    {joining ? 'Joining Meeting...' :
                        meeting?.status === 'WAITING' ?
                            `Waiting for ${meeting.waitingFor === 'counselor' ? 'counselor' : 'participant'}...` :
                            'Preparing...'}
                </Text>

                <Text style={styles.subText}>
                    {joining ? 'Please wait while we connect you' :
                        'The meeting will start automatically when both participants join'}
                </Text>

                {/* Info Cards */}
                {!joining && (
                    <View style={styles.infoCards}>
                        <View style={styles.infoCard}>
                            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                            <Text style={styles.infoCardText}>You're in the waiting room</Text>
                        </View>

                        {meeting?.waitingFor && (
                            <View style={styles.infoCard}>
                                <Ionicons name="time-outline" size={24} color={colors.accent} />
                                <Text style={styles.infoCardText}>
                                    Waiting for {meeting.waitingFor === 'counselor' ? 'counselor' : 'other participant'} to join
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {/* Tips */}
                <View style={styles.tipsContainer}>
                    <Text style={styles.tipsTitle}>While you wait:</Text>
                    <View style={styles.tip}>
                        <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
                        <Text style={styles.tipText}>Make sure you're in a quiet environment</Text>
                    </View>
                    <View style={styles.tip}>
                        <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
                        <Text style={styles.tipText}>Check your internet connection</Text>
                    </View>
                    <View style={styles.tip}>
                        <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
                        <Text style={styles.tipText}>Prepare any questions you have</Text>
                    </View>
                </View>

                {/* Cancel Button */}
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancel}
                >
                    <Text style={styles.cancelButtonText}>Leave Waiting Room</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light.background,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    waitingCircle: {
        marginBottom: spacing.xl,
    },
    outerRing: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: `${colors.primary}10`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    middleRing: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: `${colors.primary}20`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: `${colors.primary}30`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.light.text,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    subText: {
        fontSize: 15,
        color: colors.light.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
        paddingHorizontal: spacing.lg,
    },
    infoCards: {
        width: '100%',
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        backgroundColor: colors.light.surface,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.light.border,
    },
    infoCardText: {
        flex: 1,
        fontSize: 14,
        color: colors.light.text,
    },
    tipsContainer: {
        width: '100%',
        backgroundColor: '#F5F3FF',
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.xl,
        borderWidth: 1,
        borderColor: `${colors.primary}30`,
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.light.text,
        marginBottom: spacing.md,
    },
    tip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: colors.light.textSecondary,
    },
    cancelButton: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: colors.error,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.error,
    },
})
