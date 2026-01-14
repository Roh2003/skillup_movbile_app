import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useState } from "react"
import counselorService from "@/services/counselor.service"
import Toast from "react-native-toast-message"

export default function CounselorProfileScreen() {
    const navigation = useNavigation<any>()
    const route = useRoute<any>()
    const { counselor } = route.params

    const [requesting, setRequesting] = useState(false)

    const handleInstantConsultation = async () => {
        if (!counselor.isActive) {
            Toast.show({
                type: 'info',
                text1: 'Counselor Offline',
                text2: 'This counselor is currently not available for instant consultation'
            })
            return
        }

        try {
            setRequesting(true)
            const response = await counselorService.createConsultationRequest({
                counselorId: counselor.id,
                requestType: 'INSTANT',
                message: 'Request for instant consultation'
            })

            Toast.show({
                type: 'success',
                text1: 'Request Sent',
                text2: 'Your consultation request has been sent'
            })

            // Navigate to MyConsultations screen
            navigation.navigate('MyConsultations')
        } catch (error: any) {
            console.error('Request error:', error)
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.response?.data?.message || 'Failed to send request'
            })
        } finally {
            setRequesting(false)
        }
    }

    const handleScheduleConsultation = () => {
        // Navigate to schedule meeting screen
        navigation.navigate('ScheduleMeeting', { counselor })
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Counselor Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        {counselor.profileImage ? (
                            <Image
                                source={{ uri: counselor.profileImage }}
                                style={styles.avatar}
                            />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Ionicons name="person" size={56} color={colors.primary} />
                            </View>
                        )}
                        <View style={[
                            styles.statusBadgeLarge,
                            { backgroundColor: counselor.isActive ? colors.success : colors.light.textTertiary }
                        ]} />
                    </View>

                    <Text style={styles.name}>{counselor.name}</Text>
                    <Text style={styles.specialization}>{counselor.specialization}</Text>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        {counselor.rating && (
                            <View style={styles.statItem}>
                                <Ionicons name="star" size={20} color={colors.accent} />
                                <Text style={styles.statValue}>{counselor.rating.toFixed(1)}</Text>
                                <Text style={styles.statLabel}>Rating</Text>
                            </View>
                        )}
                        <View style={styles.statItem}>
                            <Ionicons name="briefcase" size={20} color={colors.primary} />
                            <Text style={styles.statValue}>{counselor.experience || 0}</Text>
                            <Text style={styles.statLabel}>Years Exp</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="people" size={20} color={colors.success} />
                            <Text style={styles.statValue}>{counselor.totalMeetings || 0}</Text>
                            <Text style={styles.statLabel}>Sessions</Text>
                        </View>
                    </View>

                    {/* Status */}
                    <View style={[
                        styles.statusContainer,
                        { backgroundColor: counselor.isActive ? '#D1FAE5' : '#F3F4F6' }
                    ]}>
                        <View style={[
                            styles.statusDot,
                            { backgroundColor: counselor.isActive ? colors.success : colors.light.textTertiary }
                        ]} />
                        <Text style={[
                            styles.statusText,
                            { color: counselor.isActive ? colors.success : colors.light.textSecondary }
                        ]}>
                            {counselor.isActive ? 'ONLINE - Available Now' : 'OFFLINE - Schedule a Meeting'}
                        </Text>
                    </View>
                </View>

                {/* Bio Section */}
                {counselor.bio && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.bioText}>{counselor.bio}</Text>
                    </View>
                )}

                {/* Employment Type */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Employment Type</Text>
                    <View style={styles.tagContainer}>
                        <View style={styles.tag}>
                            <Ionicons name="time" size={16} color={colors.primary} />
                            <Text style={styles.tagText}>{counselor.employmentType || 'Full-Time'}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.bottomActions}>
                {counselor.isActive && (
                    <TouchableOpacity
                        style={styles.instantButton}
                        onPress={handleInstantConsultation}
                        disabled={requesting}
                    >
                        {requesting ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <>
                                <Ionicons name="videocam" size={20} color="#FFFFFF" />
                                <Text style={styles.instantButtonText}>Start Instant Consultation</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={counselor.isActive ? styles.scheduleButton : styles.scheduleButtonPrimary}
                    onPress={handleScheduleConsultation}
                >
                    <Ionicons name="calendar" size={20} color={counselor.isActive ? colors.primary : "#FFFFFF"} />
                    <Text style={counselor.isActive ? styles.scheduleButtonText : styles.scheduleButtonTextWhite}>
                        Schedule Meeting
                    </Text>
                </TouchableOpacity>
            </View>
            <Toast />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.light.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.light.border,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.light.text,
    },
    profileCard: {
        backgroundColor: colors.light.surface,
        padding: spacing.xl,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.light.border,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: colors.light.border,
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#E0E7FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: colors.light.border,
    },
    statusBadgeLarge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.light.text,
        marginBottom: 4,
    },
    specialization: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '600',
        marginBottom: spacing.lg,
    },
    statsRow: {
        flexDirection: 'row',
        gap: spacing.xl,
        marginBottom: spacing.lg,
    },
    statItem: {
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.light.text,
    },
    statLabel: {
        fontSize: 12,
        color: colors.light.textSecondary,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        gap: 8,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    section: {
        padding: spacing.lg,
        backgroundColor: colors.light.surface,
        marginTop: spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.light.text,
        marginBottom: spacing.md,
    },
    bioText: {
        fontSize: 15,
        color: colors.light.textSecondary,
        lineHeight: 24,
    },
    tagContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: '#F5F3FF',
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: `${colors.primary}30`,
    },
    tagText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
    },
    bottomActions: {
        padding: spacing.md,
        backgroundColor: colors.light.surface,
        borderTopWidth: 1,
        borderTopColor: colors.light.border,
        gap: spacing.sm,
    },
    instantButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        ...shadows.md,
    },
    instantButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    scheduleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#F5F3FF',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    scheduleButtonPrimary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        ...shadows.md,
    },
    scheduleButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
    scheduleButtonTextWhite: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
})
