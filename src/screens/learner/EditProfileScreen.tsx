import { useState } from "react"
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { colors } from "@/theme/colors"
import { typography } from "@/theme/typography"
import { useNavigation } from "@react-navigation/native"
import { useAuth } from "../../../context/AuthContext"

export default function EditProfileScreen() {
  const navigation = useNavigation<any>()
  const { user } = useAuth()

  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [mobile, setMobile] = useState("")
  const [avatarUrl, setAvatarUrl] = useState(
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200",
  )

  const handleSave = () => {
    // Here you would call your API / context update
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.avatarSection}>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          <TouchableOpacity style={styles.changePhotoButton}>
            <Ionicons name="camera-outline" size={16} color={colors.primary} />
            <Text style={styles.changePhotoText}>Change photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
            placeholderTextColor={colors.light.textTertiary}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="name123@gmail.com"
            placeholderTextColor={colors.light.textTertiary}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={mobile}
            onChangeText={setMobile}
            placeholder="+91 98765 43210"
            placeholderTextColor={colors.light.textTertiary}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Profile Image URL</Text>
          <TextInput
            style={styles.input}
            value={avatarUrl}
            onChangeText={setAvatarUrl}
            placeholder="https://..."
            placeholderTextColor={colors.light.textTertiary}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 4,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: typography.fontFamily.bold,
    color: colors.light.text,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.green[50],
  },
  changePhotoText: {
    fontSize: 12,
    color: colors.primary,
    fontFamily: typography.fontFamily.medium,
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: colors.light.textSecondary,
    marginTop: 4,
  },
  input: {
    backgroundColor: colors.light.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.light.text,
    borderWidth: 1,
    borderColor: colors.green[200],
    marginBottom: 4,
  },
  saveButton: {
    marginTop: 24,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: typography.fontFamily.bold,
  },
})


