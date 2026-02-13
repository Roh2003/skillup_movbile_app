import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Platform } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useState } from "react"
import DateTimePicker from '@react-native-community/datetimepicker'
import counselorService from "@/services/counselor.service"
import { CustomToast } from "@/components/CustomToast"

export default function ScheduleMeetingScreen() {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { counselor } = route.params

  const [date, setDate] = useState(new Date())
  const [time, setTime] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios')
    if (selectedDate) {
      setDate(selectedDate)
    }
  }

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios')
    if (selectedTime) {
      setTime(selectedTime)
    }
  }

  const handleSubmit = async () => {
    // Combine date and time
    const scheduledDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    )

    // Validate future date
    if (scheduledDateTime <= new Date()) {
      CustomToast.show({
        type: 'error',
        text1: 'Invalid Time',
        text2: 'Please select a future date and time'
      })
      return
    }

    try {
      setSubmitting(true)
      await counselorService.createConsultationRequest({
        counselorId: counselor.id,
        requestType: 'SCHEDULED',
        scheduledAt: scheduledDateTime.toISOString(),
        message: message || 'Scheduled consultation request'
      })

      CustomToast.show({
        type: 'success',
        text1: 'Request Sent',
        text2: 'Your meeting request has been sent to the counselor'
      })

      // Navigate to MyConsultations
      navigation.navigate('MyConsultations')
    } catch (error: any) {
      console.error('Schedule error:', error)
      CustomToast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to schedule meeting'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
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
        <Text style={styles.headerTitle}>Schedule Meeting</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Counselor Info */}
        <View style={styles.counselorCard}>
          <View style={styles.counselorInfo}>
            <Ionicons name="person-circle" size={48} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.counselorName}>{counselor.name}</Text>
              <Text style={styles.counselorSpecialization}>{counselor.specialization}</Text>
            </View>
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <TouchableOpacity 
            style={styles.inputButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <Text style={styles.inputButtonText}>{formatDate(date)}</Text>
            <Ionicons name="chevron-down" size={20} color={colors.light.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <TouchableOpacity 
            style={styles.inputButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={styles.inputButtonText}>{formatTime(time)}</Text>
            <Ionicons name="chevron-down" size={20} color={colors.light.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Message */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Message (Optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Add a message for the counselor..."
            placeholderTextColor={colors.light.textTertiary}
            multiline
            numberOfLines={4}
            value={message}
            onChangeText={setMessage}
            textAlignVertical="top"
          />
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={colors.primary} />
          <Text style={styles.infoText}>
            The counselor will receive your request and can accept or decline it. 
            You'll be notified once they respond.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.submitButtonText}>Send Request</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Time Picker */}
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
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
  content: {
    flex: 1,
  },
  counselorCard: {
    backgroundColor: colors.light.surface,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  counselorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
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
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.light.text,
    marginBottom: spacing.md,
  },
  inputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.light.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  inputButtonText: {
    flex: 1,
    fontSize: 16,
    color: colors.light.text,
  },
  textArea: {
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 15,
    color: colors.light.text,
    minHeight: 100,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: '#EFF6FF',
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1E40AF',
    lineHeight: 20,
  },
  bottomActions: {
    padding: spacing.md,
    backgroundColor: colors.light.surface,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.md,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
})
