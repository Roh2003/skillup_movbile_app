import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, ActivityIndicator, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { colors } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../../context/AuthContext"
import { useNavigation } from "@react-navigation/native"
import { useState, useEffect } from "react"
import * as ImagePicker from 'expo-image-picker'
import authService from "@/services/auth.service"
import { uploadToCloudinary } from "@/utils/cloudinary"
import { CustomToast } from "@/components/CustomToast"
export default function ProfileScreen() {
  const { user, logout, refreshUser } = useAuth()
  const navigation = useNavigation<any>()

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNo: '',
    address: '',
    state: '',
    country: '',
    profileImage: '',
    currentStudyLevel: '',
    gender: '',
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await authService.getProfile()
      if (response.data) {
        setProfileData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
          phoneNo: response.data.phoneNo || '',
          address: response.data.address || '',
          state: response.data.state || '',
          country: response.data.country || '',
          profileImage: response.data.profileImage || '',
          currentStudyLevel: response.data.currentStudyLevel || '',
          gender: response.data.gender || '',
        })
        // Refresh user context
        if (refreshUser) {
          await refreshUser()
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      CustomToast.show({
        type: 'error',
        text1: 'Failed to load profile',
        text2: 'Please try again later'
      })
    } finally {
      setLoading(false)
    }
  }

  const pickImage = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to upload a profile picture.')
        return
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      })

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0]
        await uploadProfileImage(asset.uri, asset.fileName || 'profile.jpg', asset.mimeType || 'image/jpeg')
      }
    } catch (error) {
      console.error('Error picking image:', error)
      CustomToast.show({
        type: 'error',
        text1: 'Failed to pick image',
        text2: 'Please try again'
      })
    }
  }

  const uploadProfileImage = async (uri: string, fileName: string, mimeType: string) => {
    try {
      setUploading(true)
      CustomToast.show({
        type: 'info',
        text1: 'Uploading image...',
        text2: 'Please wait'
      })

      // Upload to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(uri, fileName, mimeType, 'profile_images')
      
      // Update profile with new image URL
      const response = await authService.updateProfile({
        profileImage: cloudinaryResult.url
      })

      if (response) {
        setProfileData(prev => ({ ...prev, profileImage: cloudinaryResult.url }))
        CustomToast.show({
          type: 'success',
          text1: 'Profile picture updated!',
          text2: 'Your new photo looks great'
        })
        // Refresh user context
        if (refreshUser) {
          await refreshUser()
        }
      }
    } catch (error) {
      console.error('Error uploading profile image:', error)
      CustomToast.show({
        type: 'error',
        text1: 'Upload failed',
        text2: 'Please try again later'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setLoading(true)
      
      const response = await authService.updateProfile(profileData)
      
      if (response) {
        CustomToast.show({
          type: 'success',
          text1: 'Profile updated!',
          text2: 'Your changes have been saved'
        })
        setIsEditing(false)
        // Refresh user context
        if (refreshUser) {
          await refreshUser()
        }
      } else {
        CustomToast.show({
          type: 'error',
          text1: 'Update failed',
          text2: response.message || 'Please try again'
        })
      }
    } catch (error: any) {
      console.error('Error updating profile:', error)
      CustomToast.show({
        type: 'error',
        text1: 'Update failed',
        text2: error.response?.data?.message || 'Please try again later'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive', 
          onPress: async () => {
            await logout()
            // Reset navigation stack and go to RoleSelection
            navigation.reset({
              index: 0,
              routes: [{ name: 'RoleSelection' }],
            })
          }
        }
      ]
    )
  }

  if (loading && !profileData.email) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={[colors.primary, '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Profile</Text>
            <TouchableOpacity 
              onPress={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              style={styles.editButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name={isEditing ? "checkmark" : "create-outline"} size={22} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>

          {/* Profile Picture */}
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageWrapper}>
              {profileData.profileImage ? (
                <Image source={{ uri: profileData.profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Ionicons name="person" size={60} color="#FFFFFF" />
                </View>
              )}
              {uploading && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator size="large" color="#FFFFFF" />
                </View>
              )}
            </View>
            <TouchableOpacity 
              style={styles.cameraButton} 
              onPress={pickImage}
              disabled={uploading}
            >
              <Ionicons name="camera" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>
            {profileData.firstName && profileData.lastName 
              ? `${profileData.firstName} ${profileData.lastName}`
              : profileData.email}
          </Text>
          <Text style={styles.userEmail}>{profileData.email}</Text>
        </LinearGradient>

        {/* Profile Form */}
        <View style={styles.formContainer}>
          {/* Personal Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profileData.firstName}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, firstName: text }))}
                  placeholder="Enter first name"
                  placeholderTextColor={colors.light.textTertiary}
                  editable={isEditing}
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profileData.lastName}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, lastName: text }))}
                  placeholder="Enter last name"
                  placeholderTextColor={colors.light.textTertiary}
                  editable={isEditing}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, styles.inputDisabled]}
                value={profileData.email}
                editable={false}
                placeholderTextColor={colors.light.textTertiary}
              />
              <Text style={styles.helperText}>Email cannot be changed</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={[styles.input, !isEditing && styles.inputDisabled]}
                value={profileData.phoneNo}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, phoneNo: text }))}
                placeholder="Enter phone number"
                placeholderTextColor={colors.light.textTertiary}
                keyboardType="phone-pad"
                editable={isEditing}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderContainer}>
                {['Male', 'Female', 'Other'].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.genderButton,
                      profileData.gender === gender && styles.genderButtonActive,
                      !isEditing && styles.genderButtonDisabled
                    ]}
                    onPress={() => isEditing && setProfileData(prev => ({ ...prev, gender }))}
                    disabled={!isEditing}
                  >
                    <Text style={[
                      styles.genderButtonText,
                      profileData.gender === gender && styles.genderButtonTextActive
                    ]}>
                      {gender}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Address Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, styles.textArea, !isEditing && styles.inputDisabled]}
                value={profileData.address}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, address: text }))}
                placeholder="Enter your address"
                placeholderTextColor={colors.light.textTertiary}
                multiline
                numberOfLines={3}
                editable={isEditing}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profileData.state}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, state: text }))}
                  placeholder="Enter state"
                  placeholderTextColor={colors.light.textTertiary}
                  editable={isEditing}
                />
              </View>
              <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Country</Text>
                <TextInput
                  style={[styles.input, !isEditing && styles.inputDisabled]}
                  value={profileData.country}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, country: text }))}
                  placeholder="Enter country"
                  placeholderTextColor={colors.light.textTertiary}
                  editable={isEditing}
                />
              </View>
            </View>
          </View>

          {/* Educational Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Educational Information</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Study Level</Text>
              <View style={styles.studyLevelContainer}>
                {[
                  { label: 'Primary', value: 'PRIMARY_SCHOOL' },
                  { label: 'Middle', value: 'MIDDLE_SCHOOL' },
                  { label: 'High', value: 'HIGH_SCHOOL' },
                  { label: 'College', value: 'COLLEGE' },
                ].map((level) => (
                  <TouchableOpacity
                    key={level.value}
                    style={[
                      styles.studyLevelButton,
                      profileData.currentStudyLevel === level.value && styles.studyLevelButtonActive,
                      !isEditing && styles.studyLevelButtonDisabled
                    ]}
                    onPress={() => isEditing && setProfileData(prev => ({ ...prev, currentStudyLevel: level.value }))}
                    disabled={!isEditing}
                  >
                    <Text style={[
                      styles.studyLevelButtonText,
                      profileData.currentStudyLevel === level.value && styles.studyLevelButtonTextActive
                    ]}>
                      {level.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          {isEditing && (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setIsEditing(false)
                  fetchProfile() // Reset to original data
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveProfile}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Menu Items */}
          {!isEditing && (
            <View style={styles.menuSection}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <Ionicons name="lock-closed-outline" size={22} color={colors.primary} />
                  <Text style={styles.menuLabel}>Change Password</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.light.textTertiary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <Ionicons name="notifications-outline" size={22} color={colors.primary} />
                  <Text style={styles.menuLabel}>Notifications</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.light.textTertiary} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuLeft}>
                  <Ionicons name="help-circle-outline" size={22} color={colors.primary} />
                  <Text style={styles.menuLabel}>Help & Support</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.light.textTertiary} />
              </TouchableOpacity>
            </View>
          )}

          {/* Logout Button */}
          {!isEditing && (
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.light.background 
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.light.textSecondary,
    fontFamily: typography.fontFamily.medium,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 32,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF30',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 60,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontFamily: typography.fontFamily.bold,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    color: '#FFFFFFCC',
    textAlign: 'center',
    marginTop: 4,
  },
  formContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.light.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.light.text,
    fontFamily: typography.fontFamily.regular,
  },
  inputDisabled: {
    backgroundColor: colors.light.background,
    color: colors.light.textSecondary,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: colors.light.textTertiary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    alignItems: 'center',
  },
  genderButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  genderButtonDisabled: {
    opacity: 0.6,
  },
  genderButtonText: {
    fontSize: 14,
    fontFamily: typography.fontFamily.medium,
    color: colors.light.text,
  },
  genderButtonTextActive: {
    color: '#FFFFFF',
  },
  studyLevelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  studyLevelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  studyLevelButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  studyLevelButtonDisabled: {
    opacity: 0.6,
  },
  studyLevelButtonText: {
    fontSize: 13,
    fontFamily: typography.fontFamily.medium,
    color: colors.light.text,
  },
  studyLevelButtonTextActive: {
    color: '#FFFFFF',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
    color: '#FFFFFF',
  },
  menuSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.light.surface,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  menuLeft: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  menuLabel: {
    fontSize: 15,
    color: colors.light.text,
    fontFamily: typography.fontFamily.medium,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
  },
})
