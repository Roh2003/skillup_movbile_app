import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, TextInput, ActivityIndicator, RefreshControl } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../../../context/AuthContext"
import { colors } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { useState, useEffect } from "react"
import courseService from "@/services/course.service"
import counselorService from "@/services/counselor.service"
import contestService from "@/services/contest.service"
import Toast from "react-native-toast-message"

export default function HomeScreen() {
  const { user } = useAuth()
  const navigation = useNavigation<any>()
  const insets = useSafeAreaInsets()

  const [courses, setCourses] = useState([])
  const [counselors, setCounselors] = useState([])
  const [contests, setContests] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [coursesRes, counselorsRes, contestsRes] = await Promise.all([
        courseService.getAllCourses().catch(() => ({ success: false, data: [] })),
        counselorService.getActiveCounselors().catch(() => ({ success: false, data: [] })),
        contestService.getAllContests().catch(() => ({ success: false, data: [] })),
      ])

      setCourses(coursesRes.data.slice(0, 6))
      setCounselors(counselorsRes.data.slice(0, 5))
      setContests(contestsRes.data.slice(0, 3))
      
    } catch (error) {
      console.error('Fetch home data error:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchHomeData()
  }

  const quickActions = [
    { id: '1', icon: 'book', label: 'Courses', color: '#6366F1', screen: 'Courses' },
    { id: '2', icon: 'trophy', label: 'Contests', color: '#F59E0B', screen: 'Challenges' },
    { id: '3', icon: 'document-text', label: 'Resources', color: '#10B981', screen: 'FreeResources' },
    { id: '4', icon: 'chatbubbles', label: 'Consult', color: '#EC4899', screen: 'Consultation' },
  ]

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {/* Top bar with gradient */}
        <LinearGradient
          colors={[colors.primary, '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.topBar}
        >
          <TouchableOpacity style={styles.profileCircle} onPress={() => navigation.navigate("Profile")}>
            <Ionicons name="person-circle" size={45} color="#FFFFFF" style={styles.profileIcon} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.welcome}>Welcome back,</Text>
            <Text style={styles.tagline}>{user?.firstName || user?.username || "Learner"}</Text>
          </View>
          <View style={styles.topActions}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Notifications")}>
              <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Options")}>
              <Ionicons name="menu-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={colors.light.textTertiary} />
          <TextInput 
            placeholder="Search courses, mentors, topics" 
            style={styles.searchInput} 
            placeholderTextColor={colors.light.textTertiary} 
          />
          <Ionicons name="options-outline" size={20} color={colors.light.textTertiary} />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              onPress={() => navigation.navigate(action.screen)}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[action.color, `${action.color}CC`]}
                style={styles.quickActionGradient}
              >
                <Ionicons name={action.icon as any} size={28} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="book" size={24} color={colors.primary} />
            <Text style={styles.statNumber}>{courses.length}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color={colors.accent} />
            <Text style={styles.statNumber}>{contests.length}</Text>
            <Text style={styles.statLabel}>Contests</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="people" size={24} color={colors.success} />
            <Text style={styles.statNumber}>{counselors.length}</Text>
            <Text style={styles.statLabel}>Active Counselors</Text>
          </View>
        </View>

        {/* Trending Courses */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Courses</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Courses")}>
            <Text style={styles.link}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={courses}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.courseCard} 
              onPress={() => navigation.navigate("CourseDetail", { courseId: item.id })}
              activeOpacity={0.8}
            >
              <Image source={{ uri: item.thumbnailUrl || 'https://via.placeholder.com/240x120' }} style={styles.courseImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.courseGradient}
              >
                <Text style={styles.courseTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.courseInstructor}>{item.instructor || 'Instructor'}</Text>
              </LinearGradient>
              {item.price && (
                <View style={styles.priceTag}>
                  <Text style={styles.priceText}>₹{item.price}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No courses available</Text>
          }
        />

        {/* Active Contests */}
        {contests.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Active Contests</Text>
              <TouchableOpacity onPress={() => navigation.navigate("Challenges")}>
                <Text style={styles.link}>View all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.contestsContainer}>
              {contests.map((contest: any) => (
                <TouchableOpacity
                  key={contest.id}
                  style={styles.contestCard}
                  onPress={() => navigation.navigate("ChallengeDetail", { contestId: contest.id })}
                  activeOpacity={0.8}
                >
                  <View style={styles.contestIcon}>
                    <Ionicons name="trophy" size={24} color={colors.accent} />
                  </View>
                  <View style={styles.contestInfo}>
                    <Text style={styles.contestTitle} numberOfLines={1}>{contest.title}</Text>
                    <Text style={styles.contestMeta}>{contest.totalMarks || 0} Points • {contest.durationMinutes || 30} mins</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.light.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Top Counsellors */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Counsellors</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Consultation")}>
            <Text style={styles.link}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={counselors}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.counsellorCard}
              onPress={() => navigation.navigate("Consultation")}
              activeOpacity={0.8}
            >
              {item.profileImage ? (
                <Image source={{ uri: item.profileImage }} style={styles.counselorAvatar} />
              ) : (
                <View style={styles.avatar}>
                  <Ionicons name="person" size={28} color={colors.primary} />
                </View>
              )}
              {item.isActive && <View style={styles.activeDot} />}
              <Text style={styles.counsellorName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.counsellorSpec} numberOfLines={1}>{item.specialization}</Text>
              {item.rating && (
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={12} color="#FBBF24" />
                  <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No counselors available</Text>
          }
        />
      </ScrollView>
      <Toast />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.light.textSecondary,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF50",
  },
  profileIcon: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
    marginBottom: 40
  },
  profileImage: { width: "100%", height: "100%" },
  welcome: {
    fontSize: 13,
    color: "#FFFFFFCC",
  },
  tagline: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: "#FFFFFF",
  },
  topActions: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF20",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    marginHorizontal: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.light.border,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.light.text },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  quickActionGradient: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.text,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.light.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: colors.light.textSecondary,
    marginTop: 2,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
  },
  link: {
    color: colors.primary,
    fontFamily: typography.fontFamily.bold,
    fontSize: 13,
  },
  courseCard: {
    width: 240,
    height: 140,
    marginRight: 12,
    borderRadius: 16,
    overflow: "hidden",
    position: 'relative',
  },
  courseImage: { 
    width: "100%", 
    height: "100%",
    resizeMode: 'cover',  // Scales image to fill container while maintaining aspect ratio
  },
  courseGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  courseTitle: {
    fontSize: 14,
    fontFamily: typography.fontFamily.bold,
    color: "#FFFFFF",
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 11,
    color: "#FFFFFFCC",
  },
  priceTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contestsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  contestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  contestIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contestInfo: {
    flex: 1,
  },
  contestTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.light.text,
    marginBottom: 2,
  },
  contestMeta: {
    fontSize: 11,
    color: colors.light.textSecondary,
  },
  counsellorCard: {
    width: 120,
    marginRight: 12,
    backgroundColor: colors.light.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.light.border,
    padding: 12,
    alignItems: "center",
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.green[50],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  counselorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 8,
  },
  activeDot: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: "#fff",
  },
  counsellorName: {
    fontSize: 13,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
    textAlign: "center",
  },
  counsellorSpec: {
    fontSize: 11,
    color: colors.light.textSecondary,
    textAlign: "center",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 11,
    color: colors.light.text,
  },
  emptyText: {
    fontSize: 14,
    color: colors.light.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
})
