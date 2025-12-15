// Core data models for the SmartSchool Connect parent app

export type UserRole = 'parent' | 'guardian' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  // Additional fields that might be specific to teachers
  subjects?: string[];
  classTeacherOf?: string; // Class ID if the teacher is a class teacher
  isAdmin?: boolean;
}

export interface Child {
  id: string;
  name: string;
  grade: string;
  class: string;
  school: string;
  avatar?: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  phone?: string;
  userType?: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  children?: Child[];  // Optional as teachers might not have children
  classes?: ClassInfo[]; // For teachers
  subjects?: string[];  // For teachers
}

export interface ClassInfo {
  id: string;
  name: string;
  grade: string;
  academicYear: string;
  studentCount: number;
  isClassTeacher: boolean;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  reason?: string;
  notes?: string;
  studentId: string;
  studentName: string;
  className?: string;
  markedBy?: string; // Teacher ID who marked the attendance
  markedAt?: string; // Timestamp
}

export interface AttendanceData {
  childId: string;
  month: string;
  year: number;
  records: AttendanceRecord[];
  summary: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    attendancePercentage: number;
  };
}

export type AssessmentType = 'exam' | 'assignment' | 'quiz' | 'project' | 'class_test' | 'homework';

export interface GradeRecord {
  id: string;
  subject: string;
  grade: string;
  score: number;
  maxScore: number;
  date: string;
  type: AssessmentType;
  teacher: string;
  teacherId: string;
  studentId: string;
  studentName: string;
  className: string;
  comments?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GradeData {
  childId: string;
  subject: string;
  currentGrade: string;
  records: GradeRecord[];
  trend: 'improving' | 'declining' | 'stable';
}

export type NotificationType = 'announcement' | 'grade' | 'attendance' | 'event' | 'message' | 'assignment' | 'reminder';

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: NotificationType;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  childId?: string;  // For parent notifications
  classId?: string;  // For class-specific notifications
  senderId?: string; // Who sent the notification
  actionUrl?: string; // Optional link for the notification
  metadata?: Record<string, any>; // Additional data
}

export interface ProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  gradeAlerts: boolean;
  attendanceAlerts: boolean;
  announcementAlerts: boolean;
  eventReminders: boolean;
}

// State interfaces
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  children: Child[];
  error: string | null;
}

export interface AttendanceState {
  data: { [childId: string]: AttendanceData };
  isLoading: boolean;
  error: string | null;
}

export interface GradesState {
  data: { [childId: string]: GradeData[] };
  isLoading: boolean;
  error: string | null;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface UIState {
  isOffline: boolean;
  selectedChild: Child | null;
  activeTab: string;
}

export interface AppState {
  auth: AuthState;
  attendance: AttendanceState;
  grades: GradesState;
  notifications: NotificationState;
  ui: UIState;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
}

// Payment and Results types
export interface PaymentMethod {
  id: string;
  type: 'mobile_money' | 'card' | 'bank_transfer';
  name: string;
  details: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentMethod: string;
  date: string;
  reference: string;
  resultPeriodId?: string;
}

export interface ResultPeriod {
  id: string;
  childId: string;
  title: string;
  academicYear: string;
  semester: 'First Semester' | 'Second Semester';
  type: 'terminal' | 'mock';
  price: number;
  currency: string;
  isPaid: boolean;
  isAvailable: boolean;
  dueDate?: string;
  publishedDate: string;
}

export interface PaymentRequest {
  resultPeriodId: string;
  paymentMethodId: string;
  amount: number;
  currency: string;
}

// Context types
export interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginCredentials, userType?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  handleSessionExpired: () => Promise<void>;
}

export interface ChildContextType {
  selectedChild: Child | null;
  setSelectedChild: (child: Child) => void;
  children: Child[];
}