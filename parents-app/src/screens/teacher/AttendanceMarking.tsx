import React, { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";
import { AttendanceAnalytics } from "../../components/analytics/AttendanceAnalytics";
import CustomCalendar from "../../components/CustomCalendar";

type Student = {
  id: string;
  name: string;
  rollNumber: string;
  status: "present" | "absent";
};

const AttendanceMarking = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();

    // Function to get ordinal suffix
    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
  };

  const currentDate = formatDate(selectedDate);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // Calendar will stay open after selection
  };

  const [students, setStudents] = useState<Student[]>([
    { id: "1", name: "John Doe", rollNumber: "001", status: "present" },
    { id: "2", name: "Jane Smith", rollNumber: "002", status: "present" },
    { id: "3", name: "Robert Johnson", rollNumber: "003", status: "present" },
    { id: "4", name: "Emily Davis", rollNumber: "004", status: "present" },
    { id: "5", name: "Michael Brown", rollNumber: "005", status: "present" },
  ]);

  const handleAttendanceToggled = useCallback(
    (studentId: string, newStatus: "present" | "absent") => {
      console.log(`[Analytics] Student ${studentId} marked as ${newStatus}`);
      // This will be called by the AttendanceAnalytics component
    },
    []
  );

  const toggleAttendance = useCallback(
    (studentId: string) => {
      setStudents((prevStudents) => {
        return prevStudents.map((student) => {
          if (student.id === studentId) {
            const newStatus =
              student.status === "present" ? "absent" : "present";
            // Call the analytics handler after state update
            setTimeout(() => handleAttendanceToggled(studentId, newStatus), 0);
            return { ...student, status: newStatus };
          }
          return student;
        });
      });
    },
    [handleAttendanceToggled]
  );

  const handleAttendanceSaved = useCallback(
    (savedStudents: Array<{ id: string; status: "present" | "absent" }>) => {
      console.log("[Analytics] Attendance saved:", savedStudents);
      // This will be called by the AttendanceAnalytics component
    },
    []
  );

  const handleAnalyticsError = useCallback((error: Error) => {
    console.error("Analytics error:", error);
  }, []);

  const saveAttendance = useCallback(async () => {
    try {
      // TODO: Replace with actual API call
      console.log("Saving attendance:", students);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Trigger the save analytics event
      handleAttendanceSaved(students);

      // Update submission status and show success message
      setIsSubmitted(true);
      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Error saving attendance:", error);
      handleAnalyticsError(error as Error);
      alert("Failed to save attendance. Please try again.");
    }
  }, [students, handleAttendanceSaved]);

  const className = "Grade 5A"; // Replace with dynamic class name from props or context

  // Memoize the handlers to prevent unnecessary re-renders
  const analyticsHandlers = useMemo(
    () => ({
      onAttendanceToggled: handleAttendanceToggled,
      onAttendanceSaved: handleAttendanceSaved,
      onError: handleAnalyticsError,
    }),
    [handleAttendanceToggled, handleAttendanceSaved, handleAnalyticsError]
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title}>Daily Attendance</Text>
      <View style={styles.dateRow}>
        <View style={styles.dateSelector}>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            <Text style={styles.dateText}>{currentDate}</Text>
            <Ionicons 
              name={isCalendarOpen ? "chevron-up" : "chevron-down"}
              size={26} 
              color={COLORS.primary} 
            />
          </TouchableOpacity>
          
          {isCalendarOpen && (
            <View style={styles.calendarContainer}>
              <CustomCalendar 
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
                maxDate={new Date().toISOString().split('T')[0]}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderStudentItem = ({ item: student }: { item: Student }) => (
    <View style={styles.studentItem}>
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{student.name}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.statusButton,
          student.status === "present" ? styles.present : styles.absent,
        ]}
        onPress={() => toggleAttendance(student.id)}
      >
        <Ionicons
          name={
            student.status === "present" ? "checkmark-circle" : "close-circle"
          }
          size={24}
          color={student.status === "present" ? "#10B981" : "#EF4444"}
        />
        <Text style={styles.statusButtonText}>
          {student.status === "present" ? "Present" : "Absent"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryDot, { backgroundColor: "#10B981" }]} />
          <Text style={styles.summaryText}>
            {students.filter((s) => s.status === "present").length} Present
          </Text>
        </View>
        <View style={[styles.summaryItem, { marginLeft: 20 }]}>
          <View style={[styles.summaryDot, { backgroundColor: "#EF4444" }]} />
          <Text style={styles.summaryText}>
            {students.filter((s) => s.status === "absent").length} Absent
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveAttendance}>
        <Text style={styles.saveButtonText}>Save Attendance</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <AttendanceAnalytics
      screenName="AttendanceMarking"
      className={className}
      {...analyticsHandlers}
    >
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <View style={styles.container}>
          {renderHeader()}
          <FlatList
            data={students}
            keyExtractor={(item) => item.id}
            style={styles.studentsList}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            bounces={false}
            ListHeaderComponent={
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="people-outline"
                      size={16}
                      color="#4B5563"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.infoText}>
                      {students.length} Students
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      isSubmitted
                        ? styles.statusCompleted
                        : styles.statusNotTaken,
                    ]}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "600" }}>
                      {isSubmitted ? "✓ Completed" : "Pending"}
                    </Text>
                  </View>
                </View>
              </View>
            }
            ListFooterComponent={renderFooter()}
            renderItem={renderStudentItem}
          />
        </View>
      </SafeAreaView>
    </AttendanceAnalytics>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 0,
  },
  footerContainer: {
    marginTop: 16,
    paddingBottom: 24,
  },
  header: {
    padding: 16,
    backgroundColor: COLORS.background.light,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dateRow: {
    width: '100%',
    marginTop: 24,
    paddingBottom: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: "LeagueSpartan-Bold",
    color: COLORS.primary,
    marginBottom: 8,
    letterSpacing: -0.8,
  },
  classText: {
    fontSize: 18,
    fontFamily: "LeagueSpartan-Medium",
    color: COLORS.text.primary,
  },
  dateSelector: {
    position: 'relative',
    zIndex: 100,
    width: '100%',
    maxWidth: 400,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 50,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    width: '100%',
  },
  dateText: {
    fontSize: 20,
    color: COLORS.primary,
    fontFamily: "LeagueSpartan-Regular",
    marginRight: 4,
  },
  calendarContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
    borderColor: COLORS.border,
    zIndex: 1000,
    width: '100%',
    minWidth: 300,
  },
  infoContainer: {
    backgroundColor: "#F5F5F5",
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  infoText: {
    color: "#4B5563",
    fontSize: 14,
    fontFamily: "LeagueSpartan-Regular",
  },
  statusBadge: {
    fontSize: 13,
    fontFamily: "LeagueSpartan-Bold",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusNotTaken: {
    backgroundColor: "#FFF3E9",
    color: "#EA580C",
  },
  statusCompleted: {
    backgroundColor: "#ECFDF5",
    color: "#059669",
  },
  studentsList: {
    flex: 1,
    marginBottom: 0,
    paddingBottom: 0,
    marginTop: 0,
    backgroundColor: "#F5F5F5",
  },
  studentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(168, 169, 171, 0.1)",
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    color: COLORS.text.primary,
    fontFamily: "LeagueSpartan-SemiBold",
  },
  statusButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 140,
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "transparent",
  },
  present: {
    backgroundColor: "#ECFDF5",
    borderColor: "#D1FAE5",
  },
  absent: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FEE2E2",
  },
  statusButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "LeagueSpartan-SemiBold",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#92400E",
  },
  statusCompletedText: {
    color: "#065F46",
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  summaryItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  summaryDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  summaryText: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "600",
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontFamily: "LeagueSpartan-Bold",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});

export default AttendanceMarking;
