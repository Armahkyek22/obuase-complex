import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { COLORS } from "../../constants/colors";

type TeacherProfileScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

const TeacherProfileScreen = ({ navigation }: TeacherProfileScreenProps) => {
  const { state, logout } = useAuth();
  const user = state.user;

  // Sample data - replace with actual data from your API
  const [profile] = useState({
    name: user?.name || "Sarah Johnson",
    email: user?.email || "sarah.johnson@smartschool.edu",
    phone: "+1 (555) 123-4567",
    subjects: ["Mathematics", "Physics"],
    classTeacherOf: "Grade 7A",
    joinDate: "January 2020",
    bio: "Dedicated educator with a passion for inspiring students to love learning and reach their full potential.",
  });

  type MenuItem = {
    id: string;
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    onPress: () => void;
  };

  // Menu items can be uncommented and used when needed
  // const menuItems: MenuItem[] = [
  //   {
  //     id: '1',
  //     icon: 'settings-outline' as const,
  //     title: 'Settings',
  //     onPress: () => navigation.navigate('Settings')
  //   },
  //   {
  //     id: '2',
  //     icon: 'notifications-outline' as const,
  //     title: 'Notification Preferences',
  //     onPress: () => navigation.navigate('NotificationSettings')
  //   },
  //   {
  //     id: '3',
  //     icon: 'help-circle-outline' as const,
  //     title: 'Help & Support',
  //     onPress: () => navigation.navigate('HelpSupport')
  //   },
  //   {
  //     id: '4',
  //     icon: 'information-circle-outline' as const,
  //     title: 'About',
  //     onPress: () => navigation.navigate('About')
  //   },
  // ];

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          navigation.reset({
            index: 0,
            routes: [{ name: "Welcome" }],
          });
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Static Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.role}>{profile.classTeacherOf} Class Teacher</Text>
      </View>

      <View style={styles.contentContainer}>
        {/* Profile Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text
                  style={styles.infoValue}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {profile.email}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{profile.phone}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Subjects Taught</Text>
                <Text style={styles.infoValue} numberOfLines={2}>
                  {profile.subjects.join(", ")}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />
          </View>
        </View>

        {/* School Information */}
        <View style={[styles.section, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>School Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>School Name</Text>
                <Text
                  style={styles.infoValue}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Greenwood High School
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>School Address</Text>
                <Text style={styles.infoValue} numberOfLines={2}>
                  123 Education St, Learning City, 10001
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>(555) 123-4567</Text>
              </View>
            </View>

            <View style={styles.divider} />
          </View>
        </View>

        {/* Support Section */}
        <View style={[styles.section, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Support</Text>

          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={styles.rowItem}
              onPress={() => navigation.navigate("HelpCenter")}
            >
              <View
                style={[
                  styles.rowIconContainer,
                  { backgroundColor: "rgba(59, 130, 246, 0.1)" },
                ]}
              >
                <Ionicons
                  name="help-circle-outline"
                  size={24}
                  color={COLORS.primary}
                />
              </View>
              <Text style={styles.rowItemText}>Help Center</Text>
            </TouchableOpacity>

            <View style={styles.rowDivider} />

            <TouchableOpacity
              style={styles.rowItem}
              onPress={() => navigation.navigate("ContactAdmin")}
            >
              <View
                style={[
                  styles.rowIconContainer,
                  { backgroundColor: "rgba(16, 185, 129, 0.1)" },
                ]}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={24}
                  color="#10B981"
                />
              </View>
              <Text style={styles.rowItemText}>Contact Admin</Text>
            </TouchableOpacity>

            <View style={styles.rowDivider} />

            <TouchableOpacity
              style={styles.rowItem}
              onPress={() => navigation.navigate("AboutApp")}
            >
              <View
                style={[
                  styles.rowIconContainer,
                  { backgroundColor: "rgba(139, 92, 246, 0.1)" },
                ]}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color="#8B5CF6"
                />
              </View>
              <Text style={styles.rowItemText}>About App</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutButtonContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
            <Ionicons
              name="log-out-outline"
              size={24}
              color="rgba(185, 28, 28, 0.9)"
              style={styles.logoutIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 0,
    paddingBottom: 100,
  },
  logoutButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  header: {
    alignItems: "center",
    padding: 24,
    paddingTop: 60,
    paddingBottom: 32,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    marginTop: -10,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#FFFFFF",
    elevation: 5,
  },

  name: {
    fontSize: 28,
    fontFamily: "LeagueSpartan-Bold",
    color: "#FFFFFF",
    marginTop: 8,
    marginBottom: 8,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  role: {
    fontSize: 18,
    fontFamily: "LeagueSpartan-Bold",
    color: "rgba(255, 255, 255, 0.95)",
    marginBottom: 16,
    letterSpacing: 0.2,
    textAlign: "center",
    opacity: 0.9,
  },

  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: "LeagueSpartan-Bold",
    paddingLeft: 12,
    marginTop: 16,
    color: COLORS.text.primary,
    marginBottom: 16,
    paddingHorizontal: 4,
    letterSpacing: -0.3,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: "hidden",
  },
  infoItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  infoItemLast: {
    padding: 20,
    borderBottomWidth: 0,
  },
  infoTextContainer: {
    // No changes needed
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: "LeagueSpartan-SemiBold",
    color: "#6B7280",
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  infoValue: {
    fontSize: 16,
    fontFamily: "LeagueSpartan-Regular",
    color: "#111827",
    lineHeight: 24,
  },
  menuIcon: {
    width: 24,
    marginRight: 16,
  },
  rowContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rowItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
  },
  rowIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  rowItemText: {
    fontSize: 12,
    fontFamily: "LeagueSpartan-SemiBold",
    color: COLORS.text.primary,
    textAlign: "center",
  },
  rowDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  versionText: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 12,
    color: COLORS.text.secondary,
    fontFamily: "LeagueSpartan-Regular",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 0,
  },
  bioContainer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 8,
  },
  bioText: {
    fontSize: 16,
    color: COLORS.text.primary,
    lineHeight: 24,
    fontFamily: "LeagueSpartan-Regular",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 0,
    padding: 16,
    paddingHorizontal: 24,
    backgroundColor: "rgba(255, 200, 200, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(220, 38, 38, 0.1)",
    borderRadius: 100,
  },
  logoutButtonText: {
    color: "rgba(185, 28, 28, 0.9)",
    fontSize: 18,
    fontFamily: "LeagueSpartan-SemiBold",
    textAlign: "left",
    paddingLeft: 16,
  },
  logoutIcon: {
    marginRight: 8,
  },
  versionContainer: {
    padding: 20,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
});

export default TeacherProfileScreen;
