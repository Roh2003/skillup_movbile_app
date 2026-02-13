import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, borderRadius, shadows } from "@/theme/colors";
import consultationService from "@/services/consultation.service";
import { CustomToast } from "@/components/CustomToast";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function MeetingRequestScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { counselor, meetingType } = route.params;

  const [message, setMessage] = useState("");
  const [scheduledDate, setScheduledDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isInstant = meetingType === "INSTANT";

  const handleSubmit = async () => {
    if (!message.trim()) {
      CustomToast.show({
        type: "error",
        text1: "Message Required",
        text2: "Please enter a message for the counselor",
      });
      return;
    }

    try {
      setSubmitting(true);

      let response;
      if (isInstant) {
        response = await consultationService.requestInstantMeeting(
          counselor.id,
          message
        );
      } else {
        response = await consultationService.requestScheduledMeeting(
          counselor.id,
          scheduledDate.toISOString(),
          message
        );
      }

      if (response.success) {
        CustomToast.show({
          type: "success",
          text1: "Request Sent!",
          text2: `Your ${isInstant ? "instant" : "scheduled"} meeting request has been sent`,
        });
        navigation.goBack();
      } else {
        CustomToast.show({
          type: "error",
          text1: "Error",
          text2: response.message || "Failed to send request",
        });
      }
    } catch (error: any) {
      console.error("Submit request error:", error);
      CustomToast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.message || "Failed to send request",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setScheduledDate(selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (selectedTime) {
      const newDate = new Date(scheduledDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setScheduledDate(newDate);
    }
  };

  const handleSelectDate = () => {
    // For simplicity, we'll set it to tomorrow at current time
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setScheduledDate(tomorrow);
    CustomToast.show({
      type: 'info',
      text1: 'Date Selected',
      text2: 'Selected tomorrow at this time',
    });
  };

  const handleSelectTime = () => {
    // Set to 2 hours from now
    const futureTime = new Date();
    futureTime.setHours(futureTime.getHours() + 2);
    setScheduledDate(futureTime);
    CustomToast.show({
      type: 'info',
      text1: 'Time Selected',
      text2: 'Selected 2 hours from now',
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isInstant ? "Instant Meeting" : "Schedule Meeting"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Counselor Info */}
        <View style={styles.counselorCard}>
          {counselor.profileImage ? (
            <Image
              source={{ uri: counselor.profileImage }}
              style={styles.counselorAvatar}
            />
          ) : (
            <View style={styles.counselorAvatarPlaceholder}>
              <Ionicons name="person" size={32} color={colors.primary} />
            </View>
          )}
          <View style={styles.counselorInfo}>
            <Text style={styles.counselorName}>{counselor.name}</Text>
            <Text style={styles.counselorSpec}>{counselor.specialization}</Text>
            {counselor.rating && (
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={14} color="#FBBF24" />
                <Text style={styles.ratingText}>{counselor.rating.toFixed(1)}</Text>
              </View>
            )}
          </View>
          {counselor.isActive && (
            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>Active</Text>
            </View>
          )}
        </View>

        {/* Meeting Type Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name={isInstant ? "flash" : "calendar"}
              size={24}
              color={isInstant ? colors.accent : colors.primary}
            />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              {isInstant ? "Instant Meeting" : "Scheduled Meeting"}
            </Text>
            <Text style={styles.infoDescription}>
              {isInstant
                ? "The counselor will be notified immediately. If they accept, you'll join the meeting right away."
                : "Choose a date and time for your meeting. The counselor will confirm your request."}
            </Text>
          </View>
        </View>

        {/* Date & Time Picker (for scheduled meetings) */}
        {!isInstant && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Date & Time</Text>
            <View style={styles.dateTimeContainer}>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                <Text style={styles.dateTimeText}>
                  {scheduledDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color={colors.primary} />
                <Text style={styles.dateTimeText}>
                  {scheduledDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.selectedDateTime}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.selectedDateTimeText}>
                Meeting scheduled for: {formatDateTime(scheduledDate)}
              </Text>
            </View>
          </View>
        )}

        {/* Message Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Message to Counselor <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Describe what you'd like to discuss..."
            placeholderTextColor={colors.light.textTertiary}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{message.length} / 500</Text>
        </View>

        {/* Guidelines */}
        <View style={styles.guidelinesCard}>
          <Text style={styles.guidelinesTitle}>Meeting Guidelines</Text>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.success} />
            <Text style={styles.guidelineText}>Be respectful and professional</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.success} />
            <Text style={styles.guidelineText}>Prepare your questions in advance</Text>
          </View>
          <View style={styles.guidelineItem}>
            <Ionicons name="checkmark-circle-outline" size={16} color={colors.success} />
            <Text style={styles.guidelineText}>Ensure stable internet connection</Text>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="send" size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Send Request</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Date/Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={scheduledDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={scheduledDate}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.light.text,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  counselorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  counselorAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: spacing.md,
  },
  counselorAvatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E0E7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  counselorInfo: {
    flex: 1,
  },
  counselorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.light.text,
  },
  counselorSpec: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.light.text,
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: `${colors.success}15`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  activeText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.success,
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: `${colors.primary}10`,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}20`,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.light.text,
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 13,
    color: colors.light.textSecondary,
    lineHeight: 18,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  required: {
    color: colors.error,
  },
  dateTimeContainer: {
    flexDirection: "row",
    gap: spacing.md,
  },
  dateTimeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.light.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  dateTimeText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.light.text,
  },
  selectedDateTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: `${colors.success}10`,
    borderRadius: borderRadius.md,
  },
  selectedDateTimeText: {
    fontSize: 13,
    color: colors.success,
    fontWeight: "600",
  },
  messageInput: {
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    padding: spacing.md,
    fontSize: 15,
    color: colors.light.text,
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    color: colors.light.textTertiary,
    textAlign: "right",
    marginTop: spacing.xs,
  },
  guidelinesCard: {
    backgroundColor: colors.light.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  guidelinesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  guidelineItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  guidelineText: {
    fontSize: 13,
    color: colors.light.textSecondary,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.md,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
