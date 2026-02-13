
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from "react-native"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import courseService from "@/services/course.service"
import { CustomToast } from "@/components/CustomToast"

export default function CoursesScreen() {
  const navigation = useNavigation<any>()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const categories = ["All", "BEGINNER", "INTERMEDIATE", "ADVANCED"]

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await courseService.getAllCourses()
      console.log(response)
      setCourses(response.data)

    } catch (error: any) {
      console.error('Fetch courses error:', error)
      CustomToast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to fetch courses'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchCourses()
  }

  const filteredCourses = courses.filter((course: any) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "All" || course.level === activeCategory
    return matchesSearch && matchesCategory
  })

  const renderCourseCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => navigation.navigate("CourseDetail", { courseId: item.id })}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.thumbnailUrl || 'https://via.placeholder.com/400x180' }} 
        style={styles.thumbnail} 
      />
      <View style={styles.info}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category || 'General'}</Text>
        </View>
        <Text style={styles.courseTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={colors.light.textSecondary} />
            <Text style={styles.metaText}>{item.duration || 'N/A'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="stats-chart-outline" size={14} color={colors.light.textSecondary} />
            <Text style={styles.metaText}>{item.level}</Text>
          </View>
        </View>
        <View style={styles.instructorBox}>
          <Ionicons name="person-circle" size={20} color={colors.primary} />
          <Text style={styles.instructorName}>{item.instructor || 'Instructor'}</Text>
        </View>
        {item.price && (
          <View style={styles.priceBox}>
            <Text style={styles.priceText}>₹{item.price}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading courses...</Text>
        </View>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Courses</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.light.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for courses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.light.textTertiary}
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
              style={[styles.categoryChip, activeCategory === item && styles.activeCategoryChip]}
              onPress={() => setActiveCategory(item)}
              activeOpacity={0.7}
            >
              <Text style={[styles.categoryChipText, activeCategory === item && styles.activeCategoryChipText]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredCourses}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={renderCourseCard}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="school-outline" size={64} color={colors.light.textTertiary} />
            <Text style={styles.emptyText}>No courses found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
    paddingTop: 20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.light.textSecondary,
  },
  header: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    fontSize: 28,
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
    ...shadows.sm,
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
  categoryChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light.surface,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  activeCategoryChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.light.textSecondary,
  },
  activeCategoryChipText: {
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
    backgroundColor: colors.light.border,
  },
  info: {
    padding: spacing.md,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.primary,
    textTransform: 'uppercase',
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
  priceBox: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: colors.success,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.light.text,
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginTop: spacing.xs,
  },
})
