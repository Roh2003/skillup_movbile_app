import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useState, useEffect } from "react"
import counselorService from "@/services/counselor.service"

export default function MeetingSummaryScreen() {
    const navigation = useNavigation<any>()
    const route = useRoute<any>()
    const { meetingId, duration: routeDuration } = route.params

    const [meeting, setMeeting] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMeetingDetails()
    }, [])

    const fetchMeetingDetails = async () => {
        try {
            const response = await counselorService.getMeetingById(meetingId)
            setMeeting(response.data)
        } catch (error) {
            console.error('Fetch meeting error:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins} min ${secs} sec`
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handleDone = () => {
        // Navigate back to home or consultations
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
        })
    }

    const handleViewConsultationsHistory = () => {
        navigation.navigate('MyConsultations')
    }

    if (loading || !meeting) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Loading summary...</Text>
                </View>
            </SafeAreaView>
        )
    }

    const durationToShow = meeting.duration || routeDuration || 0

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {/* Success Icon */}
                <View style={styles.headerSection}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="checkmark-circle" size={80} color={colors.success} />
                    </View>
                    <Text style={styles.title}>Meeting Completed!</Text>
                    <Text style={styles.subtitle}>Your consultation session has ended</Text>
                </View>

                {/* Counselor Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Counselor</Text>
                    <View style={styles.counselorCard}>
                        <Ionicons name="person-circle" size={56} color={colors.primary} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.counselorName}>{meeting.counselor.name}</Text>
                            <Text style={styles.counselorSpecialization}>{meeting.counselor.specialization}</Text>
                        </View>
                    </View>
                </View>

                {/* Meeting Details */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Meeting Details</Text>

                    <View style={styles.detailsCard}>
                        <View style={styles.detailRow}>
                            <View style={styles.detailIconContainer}>
                                <Ionicons name="calendar-outline" size={24} color={colors.primary} />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Date & Time</Text>
                                <Text style={styles.detailValue}>
                                    {meeting.startTime ? formatDate(meeting.startTime) : formatDate(meeting.createdAt)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailRow}>
                            <View style={styles.detailIconContainer}>
                                <Ionicons name="time-outline" size={24} color={colors.primary} />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Duration</Text>
                                <Text style={styles.detailValue}>{formatDuration(durationToShow)}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailRow}>
                            <View style={styles.detailIconContainer}>
                                <Ionicons name="document-text-outline" size={24} color={colors.primary} />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Type</Text>
                                <Text style={styles.detailValue}>
                                    {meeting.consultationRequest.requestType === 'INSTANT' ? 'Instant Consultation' : 'Scheduled Meeting'}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailRow}>
                            <View style={styles.detailIconContainer}>
                                <Ionicons name="checkmark-done-outline" size={24} color={colors.success} />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Status</Text>
                                <Text style={[styles.detailValue, { color: colors.success }]}>Completed</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Feedback Section (Optional) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Rate Your Experience</Text>
                    <View style={styles.ratingCard}>
                        <Text style={styles.ratingText}>How was your consultation?</Text>
                        <View style={styles.starsContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} style={styles.starButton}>
                                    <Ionicons name="star-outline" size={36} color={colors.accent} />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.ratingSubtext}>Coming soon: Rate and review your counselor</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.bottomActions}>
                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleViewConsultationsHistory}
                >
                    <Ionicons name="time-outline" size={20} color={colors.primary} />
                    <Text style={styles.secondaryButtonText}>View History</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleDone}
                >
                    <Text style={styles.primaryButtonText}>Done</Text>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: colors.light.textSecondary,
    },
    headerSection: {
        alignItems: 'center',
        paddingVertical: spacing.xl * 2,
        backgroundColor: colors.light.surface,
    },
    iconContainer: {
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.light.text,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: 16,
        color: colors.light.textSecondary,
    },
    section: {
        padding: spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.light.text,
        marginBottom: spacing.md,
    },
    counselorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        backgroundColor: colors.light.surface,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        ...shadows.sm,
    },
    counselorName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.light.text,
    },
    counselorSpecialization: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
    },
    detailsCard: {
        backgroundColor: colors.light.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        ...shadows.sm,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.sm,
    },
    detailIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F5F3FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 13,
        color: colors.light.textSecondary,
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.light.text,
    },
    divider: {
        height: 1,
        backgroundColor: colors.light.border,
        marginVertical: spacing.sm,
    },
    ratingCard: {
        backgroundColor: colors.light.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
        ...shadows.sm,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.light.text,
        marginBottom: spacing.md,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    starButton: {
        padding: spacing.xs,
    },
    ratingSubtext: {
        fontSize: 12,
        color: colors.light.textSecondary,
        fontStyle: 'italic',
    },
    bottomActions: {
        flexDirection: 'row',
        gap: spacing.sm,
        padding: spacing.md,
        backgroundColor: colors.light.surface,
        borderTopWidth: 1,
        borderTopColor: colors.light.border,
    },
    secondaryButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        backgroundColor: '#F5F3FF',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
    primaryButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary,
        ...shadows.md,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
})
