
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from "react-native"
import { colors, spacing, borderRadius } from "@/theme/colors"
import { useRoute, useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaProvider } from "react-native-safe-area-context"
import contestService from "@/services/contest.service"
import { CustomToast } from "@/components/CustomToast"

export default function ChallengeDetailScreen() {
  const route = useRoute<any>()
  const navigation = useNavigation<any>()
  const { contestId } = route.params

  const [contest, setContest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)

  useEffect(() => {
    fetchContest()
  }, [])

  useEffect(() => {
    if (contest && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [contest, timeRemaining])

  const fetchContest = async () => {
    try {
      setLoading(true)
      const response = await contestService.getContestById(contestId)
      
      console.log("Contest detail response:", response)
      if (!response.data) {
        throw new Error("Contest data not found.")
      }
      setContest(response.data)
        // Set timer in seconds
      setTimeRemaining((response.data.durationMinutes || 30) * 60)

      // Start the contest attempt
      try {
        await contestService.startContest(contestId)
        console.log("Contest attempt started")
      } catch (startError) {
        console.error("Failed to start contest attempt:", startError)
        // Don't block the user - submitContest will create the attempt if needed
      }

    } catch (error: any) {
      console.error('Fetch contest error:', error)
      CustomToast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to fetch contest'
      })
      navigation.goBack()
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      
      // Prepare answers in the format expected by backend
      const questions = contest.ContestQuestion || []
      const answers = questions.map((q: any) => ({
        questionId: q.id,
        selectedOption: selectedAnswers[q.id] || '',
      }))

      // Calculate time taken in seconds
      const totalDuration = (contest.durationMinutes || 30) * 60
      const timeTaken = totalDuration - timeRemaining

      const response = await contestService.submitContest(contestId, answers, timeTaken)
      
      // Response structure: {status: true, data: {score: number}, message: "..."}
      setScore(response.data?.score || 0)
      setIsFinished(true)
      CustomToast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Contest submitted successfully!'
      })
    } catch (error: any) {
      console.error('Submit contest error:', error)
      CustomToast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to submit contest'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleNext = () => {
    const questions = contest.ContestQuestion || []
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleOptionSelect = (questionId: number, option: string) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: option,
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading contest...</Text>
        </View>
      </SafeAreaProvider>
    )
  }

  if (!contest) return null

  const questions = contest.ContestQuestion || []
  
  // Safety check for empty questions
  if (questions.length === 0) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="help-circle-outline" size={64} color={colors.light.textTertiary} />
          <Text style={styles.loadingText}>No questions available for this contest</Text>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.submitButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaProvider>
    )
  }
  
  if (isFinished) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.resultContainer}>
          <Ionicons name="trophy" size={80} color={colors.accent} />
          <Text style={styles.resultTitle}>Contest Completed!</Text>
          <Text style={styles.resultScore}>
            Your Score: {score}/{contest.totalMarks || questions.length}
          </Text>
          <Text style={styles.resultMessage}>
            {score >= (contest.totalMarks || questions.length) * 0.7
              ? "Excellent work! 🎉"
              : score >= (contest.totalMarks || questions.length) * 0.5
              ? "Good effort! Keep practicing 💪"
              : "Keep learning and try again! 📚"}
          </Text>
          <View style={styles.resultActions}>
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={() => navigation.navigate("Leaderboard", { contestId })}
            >
              <Ionicons name="podium" size={20} color={colors.primary} />
              <Text style={styles.secondaryButtonText}>View Leaderboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.doneButton} onPress={() => navigation.goBack()}>
              <Text style={styles.doneButtonText}>Finish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaProvider>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const answeredCount = Object.keys(selectedAnswers).length

  return (
    <SafeAreaProvider style={styles.container}>
      {/* Header with timer */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.light.text} />
        </TouchableOpacity>
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={20} color={timeRemaining < 60 ? colors.error : colors.primary} />
          <Text style={[styles.timerText, timeRemaining < 60 && styles.timerWarning]}>
            {formatTime(timeRemaining)}
          </Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressLine,
            { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` },
          ]}
        />
      </View>

      <ScrollView style={styles.quizContent} showsVerticalScrollIndicator={false}>
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <Text style={styles.answeredCount}>
            Answered: {answeredCount}/{questions.length}
          </Text>
        </View>
        
        <Text style={styles.questionText}>{currentQuestion.questionText}</Text>

        <View style={styles.optionsList}>
          {/* Convert optionA, optionB, optionC, optionD to array */}
          {[
            { label: 'A', value: currentQuestion.optionA },
            { label: 'B', value: currentQuestion.optionB },
            { label: 'C', value: currentQuestion.optionC },
            { label: 'D', value: currentQuestion.optionD },
          ]
            .filter(opt => opt.value) // Only show options that exist
            .map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion.id] === option.label
              
              return (
                <TouchableOpacity
                  key={option.label}
                  style={[styles.optionCard, isSelected && styles.selectedOption]}
                  onPress={() => handleOptionSelect(currentQuestion.id, option.label)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.optionLabel, isSelected && styles.selectedLabel]}>
                    <Text style={[styles.optionLabelText, isSelected && styles.selectedLabelText]}>
                      {option.label}
                    </Text>
                  </View>
                  <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                    {option.value}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )
            })}
        </View>
      </ScrollView>

      {/* Footer with navigation */}
      <View style={styles.footer}>
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}
            onPress={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <Ionicons 
              name="chevron-back" 
              size={20} 
              color={currentQuestionIndex === 0 ? colors.light.textTertiary : colors.primary} 
            />
            <Text style={[styles.navButtonText, currentQuestionIndex === 0 && styles.disabledText]}>
              Previous
            </Text>
          </TouchableOpacity>

          {currentQuestionIndex === questions.length - 1 ? (
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Submit Contest</Text>
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.navButton}
              onPress={handleNext}
            >
              <Text style={styles.navButtonText}>Next</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaProvider>
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
    marginTop: 12,
    fontSize: 16,
    color: colors.light.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  backButton: {
    padding: 4,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.light.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.md,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  timerWarning: {
    color: colors.error,
  },
  progressContainer: {
    height: 4,
    backgroundColor: colors.light.surface,
    width: "100%",
  },
  progressLine: {
    height: "100%",
    backgroundColor: colors.primary,
  },
  quizContent: {
    flex: 1,
    padding: spacing.lg,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  questionNumber: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "bold",
  },
  answeredCount: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.light.text,
    marginBottom: spacing.xl,
    lineHeight: 28,
  },
  optionsList: {
    gap: spacing.md,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.light.border,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: "#F5F3FF",
  },
  optionLabel: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.light.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  selectedLabel: {
    backgroundColor: colors.primary,
  },
  optionLabelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.light.textSecondary,
  },
  selectedLabelText: {
    color: '#FFFFFF',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: colors.light.text,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: "600",
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  disabledButton: {
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
  disabledText: {
    color: colors.light.textTertiary,
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.light.text,
    marginTop: spacing.lg,
  },
  resultScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: spacing.md,
  },
  resultMessage: {
    fontSize: 16,
    color: colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  resultActions: {
    width: '100%',
    gap: spacing.md,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.light.surface,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  doneButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
})
