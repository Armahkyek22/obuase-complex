import React, { useEffect } from 'react';

interface AttendanceAnalyticsProps {
  screenName: string;
  className: string;
  onAttendanceToggled?: (studentId: string, newStatus: 'present' | 'absent') => void;
  onAttendanceSaved?: (students: Array<{id: string; status: 'present' | 'absent'}>) => void;
  onError?: (error: Error) => void;
  children: React.ReactNode;
}

export const AttendanceAnalytics: React.FC<AttendanceAnalyticsProps> = ({
  screenName,
  className,
  onAttendanceToggled,
  onAttendanceSaved,
  onError,
  children
}) => {
  // Log screen view when component mounts
  useEffect(() => {
    logEvent('screen_view', {
      screen_name: screenName,
      class_name: className,
      timestamp: new Date().toISOString()
    });
  }, [screenName, className]);

  // Function to log events to your analytics service
  const logEvent = (eventName: string, params: Record<string, any> = {}) => {
    try {
      // In a real app, you would integrate with your analytics service here
      // For example: Firebase Analytics, Mixpanel, etc.
      console.log(`[Analytics] ${eventName}`, params);
      
      // Here's an example of how you might integrate with Firebase Analytics:
      // import analytics from '@react-native-firebase/analytics';
      // await analytics().logEvent(eventName, params);
    } catch (error) {
      console.error('Error logging analytics event:', error);
      onError?.(error as Error);
    }
  };

  // Provide the logEvent function and other analytics methods to children
  const contextValue = {
    logEvent,
    logAttendanceToggle: (studentId: string, newStatus: 'present' | 'absent') => {
      const eventParams = {
        student_id: studentId,
        new_status: newStatus,
        class_name: className,
        timestamp: new Date().toISOString()
      };
      logEvent('attendance_toggled', eventParams);
      onAttendanceToggled?.(studentId, newStatus);
    },
    logAttendanceSave: (students: Array<{id: string; status: 'present' | 'absent'}>) => {
      const presentCount = students.filter(s => s.status === 'present').length;
      const absentCount = students.filter(s => s.status === 'absent').length;
      
      const eventParams = {
        total_students: students.length,
        present_count: presentCount,
        absent_count: absentCount,
        class_name: className,
        timestamp: new Date().toISOString()
      };
      
      logEvent('attendance_saved', eventParams);
      onAttendanceSaved?.(students);
    }
  };

  // Clone children and pass down the analytics context
  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { analytics: contextValue } as any);
    }
    return child;
  });

  return <>{childrenWithProps}</>;
};

// Create a hook for easy access to analytics in child components
export const useAttendanceAnalytics = () => {
  const context = React.useContext(AttendanceAnalyticsContext);
  if (!context) {
    throw new Error('useAttendanceAnalytics must be used within an AttendanceAnalytics provider');
  }
  return context;
};

// Create a context for the analytics
const AttendanceAnalyticsContext = React.createContext<any>(null);
