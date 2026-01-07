import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { mockResources } from "@/data/mockData"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"

export default function FreeResourcesScreen() {
  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Free Resources</Text>
        <Text style={styles.subtitle}>Unlock your potential with premium materials</Text>
      </View>

      <FlatList
        data={mockResources}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.resourceCard}>
            <View style={styles.thumbnailContainer}>
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              <View style={styles.typeBadge}>
                <Ionicons
                  name={item.type === "video" ? "play" : item.type === "pdf" ? "document-text" : "image"}
                  size={12}
                  color="#FFFFFF"
                />
                <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.info}>
              <Text style={styles.resourceCategory}>{item.category}</Text>
              <Text style={styles.resourceTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <TouchableOpacity style={styles.downloadBtn}>
                <Ionicons name="download-outline" size={16} color={colors.primary} />
                <Text style={styles.downloadText}>Download</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.light.text,
    fontFamily: typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: 14,
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamily.regular,
  },
  listContent: {
    padding: spacing.md,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  resourceCard: {
    width: "48%",
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
    overflow: "hidden",
  },
  thumbnailContainer: {
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: 100,
  },
  typeBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  typeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  info: {
    padding: spacing.sm,
  },
  resourceCategory: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 2,
  },
  resourceTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: colors.light.text,
    height: 40,
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    gap: 4,
  },
  downloadText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "600",
  },
})
