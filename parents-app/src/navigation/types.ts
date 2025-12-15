import { NavigatorScreenParams } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Root Stack

export type RootStackParamList = {
  Welcome: undefined;
  ParentLogin: undefined;
  TeacherLogin: undefined;
  App: NavigatorScreenParams<ParentTabParamList>;
  TeacherApp: NavigatorScreenParams<TeacherTabParamList>;
  Results: undefined;
  Payment: undefined;
  TransactionHistory: undefined;
};

// Parent Tabs

export type ParentTabParamList = {
  Home: undefined;
  Attendance: undefined;
  Results: undefined;
  Payments: undefined;
  Profile: undefined;
};

// Teacher Tabs

export type TeacherTabParamList = {
  TeacherHome: undefined;
  Assessments: NavigatorScreenParams<AssessmentStackParamList>;
  ClassAttendance: undefined;
  TeacherProfile: undefined;
};

// Assessment Stack

export type AssessmentStackParamList = {
  AssessmentDashboard: undefined;
  StudentSelection: {
    class: string;
    subject: string;
    term: string;
  };
  AssessmentTypeSelection: {
    class: string;
    subject: string;
    term: string;
    studentId: string;
    studentName: string;
  };
  EnterScores: {
    class: string;
    subject: string;
    term: string;
    assessmentType: string;
    studentId: string;
    studentName: string;
    score: string;
    remarks: string;
    maxScore: number;
  };
  AssessmentSummary: {
    class: string;
    subject: string;
    term: string;
    assessmentType: string;
    maxScore: number;
    scores: Array<{
      studentId: string;
      studentName: string;
      score: number;
    }>;
  };
};

// Navigation Props

export type WelcomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

export type AssessmentDashboardNavigationProp = StackNavigationProp<
  AssessmentStackParamList,
  'AssessmentDashboard'
>;

export type AssessmentTypeSelectionNavigationProp = StackNavigationProp<
  AssessmentStackParamList,
  'AssessmentTypeSelection'
>;

export type EnterScoresNavigationProp = StackNavigationProp<
  AssessmentStackParamList,
  'EnterScores'
>;

export type AssessmentSummaryNavigationProp = StackNavigationProp<
  AssessmentStackParamList,
  'AssessmentSummary'
>;
