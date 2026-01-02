
import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, SafeAreaView } from "react-native"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { mockCourses } from "@/data/mockData"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"

export default function CoursesScreen() {
  const navigation = useNavigation<any>()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const categories = ["All", "Programming", "Web Development", "Data Science", "Design"]

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "All" || course.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Courses</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.light.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for courses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryBadge, activeCategory === item && styles.activeCategoryBadge]}
              onPress={() => setActiveCategory(item)}
            >
              <Text style={[styles.categoryText, activeCategory === item && styles.activeCategoryText]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.courseCard}
            onPress={() => navigation.navigate("CourseDetail", { courseId: item.id })}
          >
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <View style={styles.info}>
              <Text style={styles.category}>{item.category}</Text>
              <Text style={styles.courseTitle}>{item.title}</Text>
              <View style={styles.meta}>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color={colors.light.textSecondary} />
                  <Text style={styles.metaText}>{item.duration}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="stats-chart-outline" size={14} color={colors.light.textSecondary} />
                  <Text style={styles.metaText}>{item.level}</Text>
                </View>
              </View>
              <View style={styles.instructorBox}>
                <Ionicons name="person-circle" size={20} color={colors.primary} />
                <Text style={styles.instructorName}>{item.instructor}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.light.text,
    fontFamily: typography.fontFamily.bold,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.surface,
    paddingHorizontal: spacing.md,
    height: 50,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: 16,
    color: colors.light.text,
  },
  categoriesContainer: {
    marginBottom: spacing.md,
  },
  categoryList: {
    paddingHorizontal: spacing.lg,
  },
  categoryBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light.surface,
    marginRight: spacing.sm,
  },
  activeCategoryBadge: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.light.textSecondary,
  },
  activeCategoryText: {
    color: "#FFFFFF",
  },
  listContent: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  courseCard: {
    backgroundColor: colors.light.surface,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    ...shadows.md,
    borderWidth: 1,
    borderColor: colors.light.border,
    overflow: "hidden",
  },
  thumbnail: {
    width: "100%",
    height: 180,
  },
  info: {
    padding: spacing.md,
  },
  category: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  meta: {
    flexDirection: "row",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.light.textSecondary,
  },
  instructorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    paddingTop: spacing.sm,
  },
  instructorName: {
    fontSize: 14,
    color: colors.light.text,
    fontWeight: "500",
  },
})
