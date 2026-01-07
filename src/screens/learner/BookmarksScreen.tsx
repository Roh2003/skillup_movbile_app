import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { colors } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { mockCourses } from "@/data/mockData"
import { SafeAreaView } from "react-native-safe-area-context"

export default function BookmarksScreen() {
  const navigation = useNavigation<any>()
  const bookmarked = mockCourses

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bookmark</Text>
        <Ionicons name="bookmarks-outline" size={22} color={colors.primary} />
      </View>

      <FlatList
        data={bookmarked}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("CourseDetail", { courseId: item.id })}>
            <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.meta}>{item.instructor}</Text>
              <View style={styles.bottomRow}>
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{item.level}</Text>
                </View>
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{item.duration}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="star" size={12} color="#FBBF24" />
                  <Text style={styles.meta}>{item.rating?.toFixed(1) ?? "4.8"}</Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.light.textTertiary} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 22,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
  },
  list: { paddingHorizontal: 16, paddingBottom: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.light.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
    marginBottom: 12,
  },
  thumb: { width: 70, height: 70, borderRadius: 12, backgroundColor: colors.green[50] },
  cardTitle: {
    fontSize: 15,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
  },
  meta: { fontSize: 12, color: colors.light.textSecondary },
  bottomRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: colors.green[50],
    borderWidth: 1,
    borderColor: colors.green[200],
  },
  pillText: {
    fontSize: 11,
    color: colors.primary,
    fontFamily: typography.fontFamily.medium,
  },
})

