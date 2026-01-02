
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native"
import { colors, spacing, borderRadius } from "@/theme/colors"
import { mockChallenges } from "@/data/mockData"
import { useRoute, useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"

export default function ChallengeDetailScreen() {
  const route = useRoute<any>()
  const navigation = useNavigation()
  const { challengeId } = route.params
  const challenge = mockChallenges.find((c) => c.id === challengeId)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  if (!challenge) return null

  const currentQuestion = challenge.questions[currentQuestionIndex]

  const handleNext = () => {
    if (selectedOption === null) return

    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }

    if (currentQuestionIndex < challenge.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOption(null)
    } else {
      setIsFinished(true)
    }
  }

  if (isFinished) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultContainer}>
          <Ionicons name="trophy" size={80} color={colors.accent} />
          <Text style={styles.resultTitle}>Challenge Completed!</Text>
          <Text style={styles.resultScore}>
            Your Score: {score}/{challenge.questions.length}
          </Text>
          <TouchableOpacity style={styles.doneButton} onPress={() => navigation.goBack()}>
            <Text style={styles.doneButtonText}>Finish</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressLine,
            { width: `${((currentQuestionIndex + 1) / challenge.questions.length) * 100}%` },
          ]}
        />
      </View>

      <View style={styles.quizContent}>
        <Text style={styles.questionNumber}>
          Question {currentQuestionIndex + 1} of {challenge.questions.length}
        </Text>
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        <View style={styles.optionsList}>
          {currentQuestion.options.map((option: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={[styles.optionCard, selectedOption === index && styles.selectedOption]}
              onPress={() => setSelectedOption(index)}
            >
              <View style={[styles.radio, selectedOption === index && styles.radioSelected]}>
                {selectedOption === index && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.optionText, selectedOption === index && styles.selectedOptionText]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, selectedOption === null && styles.disabledButton]}
          onPress={handleNext}
          disabled={selectedOption === null}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex === challenge.questions.length - 1 ? "Submit" : "Next Question"}
          </Text>
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
  questionNumber: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: spacing.sm,
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.light.text,
    marginBottom: spacing.xl,
  },
  optionsList: {
    gap: spacing.md,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  selectedOption: {
    borderColor: colors.primary,
    backgroundColor: "#F5F3FF",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.light.textTertiary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  optionText: {
    fontSize: 16,
    color: colors.light.text,
  },
  selectedOptionText: {
    color: colors.primary,
    fontWeight: "bold",
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  nextButton: {
    backgroundColor: colors.primary,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#E0E0E0",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.light.text,
    marginTop: spacing.lg,
  },
  resultScore: {
    fontSize: 18,
    color: colors.light.textSecondary,
    marginVertical: spacing.md,
  },
  doneButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },
  doneButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
})
