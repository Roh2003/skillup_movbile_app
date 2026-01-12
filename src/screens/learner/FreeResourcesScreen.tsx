import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator, RefreshControl, Linking } from "react-native"
import { colors, spacing, borderRadius, shadows } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useState, useEffect } from "react"
import resourceService from "@/services/resource.service"
import Toast from "react-native-toast-message"

export default function FreeResourcesScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const categories = [
    { value: "all", label: "All", icon: "document-text" },
    { value: "document", label: "Documents", icon: "document" },
    { value: "video", label: "Videos", icon: "videocam" },
    { value: "image", label: "Images", icon: "image" },
  ]

  useEffect(() => {
    fetchResources()
  }, [activeCategory])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const params: any = {}
      
      if (activeCategory !== "all") {
        params.category = activeCategory
      }
      
      if (searchQuery) {
        params.search = searchQuery
      }

      const response = await resourceService.getAllResources(params)
    
      setResources(response.data)

    } catch (error: any) {
      console.error('Fetch resources error:', error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to fetch resources'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    fetchResources()
  }

  const handleSearch = () => {
    fetchResources()
  }

  const handleResourcePress = async (resource: any) => {
    try {
      // Increment download count
      await resourceService.incrementDownload(resource.id)
      
      // Open URL
      const supported = await Linking.canOpenURL(resource.url)
      if (supported) {
        await Linking.openURL(resource.url)
        Toast.show({
          type: 'success',
          text1: 'Opening Resource',
          text2: `Opening ${resource.title}...`
        })
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Cannot open this resource'
        })
      }
    } catch (error) {
      console.error('Open resource error:', error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to open resource'
      })
    }
  }

  const getFileIcon = (type: string) => {
    const upperType = type.toUpperCase()
    if (upperType.includes('PDF') || upperType.includes('DOC')) return 'document-text'
    if (upperType.includes('MP4') || upperType.includes('VIDEO')) return 'videocam'
    if (upperType.includes('PNG') || upperType.includes('JPG') || upperType.includes('IMAGE')) return 'image'
    return 'document'
  }

  const getFileColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'document': return { bg: '#DBEAFE', icon: colors.primary }
      case 'video': return { bg: '#FEE2E2', icon: colors.error }
      case 'image': return { bg: '#D1FAE5', icon: colors.success }
      default: return { bg: '#F3F4F6', icon: colors.light.textTertiary }
    }
  }

  const renderResourceCard = ({ item }: any) => {
    const fileColors = getFileColor(item.category)
    
    return (
      <TouchableOpacity
        style={styles.resourceCard}
        onPress={() => handleResourcePress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconBox, { backgroundColor: fileColors.bg }]}>
          <Ionicons name={getFileIcon(item.type) as any} size={28} color={fileColors.icon} />
        </View>
        <View style={styles.resourceInfo}>
          <Text style={styles.resourceTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.resourceDesc} numberOfLines={1}>
            {item.description || 'No description'}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="document-outline" size={12} color={colors.light.textSecondary} />
              <Text style={styles.metaText}>{item.type}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="cloud-download-outline" size={12} color={colors.light.textSecondary} />
              <Text style={styles.metaText}>{item.downloads || 0} downloads</Text>
            </View>
            {item.size && (
              <View style={styles.metaItem}>
                <Ionicons name="resize-outline" size={12} color={colors.light.textSecondary} />
                <Text style={styles.metaText}>{item.size}</Text>
              </View>
            )}
          </View>
        </View>
        <Ionicons name="download-outline" size={20} color={colors.primary} />
      </TouchableOpacity>
    )
  }

  if (loading && !refreshing) {
    return (
      <SafeAreaProvider style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading resources...</Text>
        </View>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Free Resources</Text>
        <Text style={styles.subtitle}>Access learning materials anytime</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.light.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search resources..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            placeholderTextColor={colors.light.textTertiary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchQuery(''); fetchResources(); }}>
              <Ionicons name="close-circle" size={20} color={colors.light.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item.value}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryChip, activeCategory === item.value && styles.activeCategoryChip]}
              onPress={() => setActiveCategory(item.value)}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={item.icon as any} 
                size={16} 
                color={activeCategory === item.value ? "#FFFFFF" : colors.light.textSecondary} 
              />
              <Text style={[styles.categoryChipText, activeCategory === item.value && styles.activeCategoryChipText]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={resources}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={renderResourceCard}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={64} color={colors.light.textTertiary} />
            <Text style={styles.emptyText}>No resources found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />
      <Toast />
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
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.light.textSecondary,
  },
  header: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.light.text,
    fontFamily: typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginBottom: spacing.md,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
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
  resourceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.light.text,
    marginBottom: spacing.xs,
  },
  resourceDesc: {
    fontSize: 12,
    color: colors.light.textSecondary,
    marginBottom: spacing.xs,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: colors.light.textSecondary,
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
