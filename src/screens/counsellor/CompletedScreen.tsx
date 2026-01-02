import { View, Text, StyleSheet, SafeAreaView } from "react-native"
import { colors, spacing } from "@/theme/colors"
import { typography } from "@/theme/typography"

export default function CompletedScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Completed Consultations</Text>
        <Text style={styles.subtitle}>No completed consultations yet</Text>
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
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.light.text,
    fontFamily: typography.fontFamily.bold,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamily.regular,
  },
})

