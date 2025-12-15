import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";
import { RootStackParamList } from "../navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";
import LoadingSpinner from "../components/LoadingSpinner";

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const { state } = useAuth();
  const { isAuthenticated, isLoading, user } = state;

  useEffect(() => {
    // If user is already authenticated, navigate to the appropriate screen
    if (isAuthenticated && user) {
      if (user.role === 'teacher') {
        navigation.navigate('TeacherApp' as never);
      } else {
        navigation.navigate('App' as never);
      }
    }
  }, [isAuthenticated, user, navigation]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner 
          size="large" 
          color="#3B82F6" 
          text="Loading..."
          fullScreen
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="school" size={60} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>SmartSchool Connect</Text>
            <Text style={styles.subtitle}>
              Connecting schools, teachers, and parents
            </Text>
          </View>

          <View style={styles.content}>
            <View style={styles.card}>
              <View style={styles.iconContainer}>
                <Ionicons name="people-outline" size={40} color="#3B82F6" />
              </View>
              <Text style={styles.cardTitle}>Parent Portal</Text>

              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={() => navigation.navigate('ParentLogin')}
              >
                <Text style={styles.buttonText}>Login as Parent</Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#FFFFFF"
                  style={styles.buttonIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.card, styles.teacherCard]}>
              <View style={[styles.iconContainer, styles.teacherIconContainer]}>
                <Ionicons name="school-outline" size={40} color="#3B82F6" />
              </View>
              <Text style={[styles.cardTitle, styles.teacherTitle]}>
                Teacher Portal
              </Text>

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => navigation.navigate('TeacherLogin')}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Login as Teacher
                </Text>
                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#3B82F6"
                  style={styles.buttonIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              2025 SmartSchool Connect. All rights reserved.
            </Text>
          </View>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontFamily: 'LeagueSpartan-Bold',
    fontWeight: '700',
    color: "#black",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'LeagueSpartan-Regular',
    color: "#gray/500",
    textAlign: "center",
    marginBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  teacherCard: {
    backgroundColor: "#F5F3F5",
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  teacherIconContainer: {
    backgroundColor: "#EEF2FF",
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: 'LeagueSpartan-Bold',
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 12,
  },
  teacherTitle: {
    color: "#1F2937",
  },
  cardText: {
    fontSize: 15,
    fontFamily: 'LeagueSpartan-Regular',
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  teacherText: {
    color: "#6B7280",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: "auto",
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
  },
  secondaryButton: {
    backgroundColor: "#3B82F6",
    borderWidth: 1,
    borderColor: "#93C5FD",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: 'LeagueSpartan-Bold',
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontFamily: 'LeagueSpartan-Bold',
  },
  buttonIcon: {
    marginLeft: 8,
    color: "#FFFFFF",
  },
  footer: {
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    color: "gray/500",
    fontSize: 12,
    fontFamily: 'LeagueSpartan-Regular',
  },
});

export default WelcomeScreen;
