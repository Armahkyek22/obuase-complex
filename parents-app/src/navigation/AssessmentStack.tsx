import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AssessmentDashboard from '../screens/teacher/AssessmentDashboard';
import StudentSelection from '../screens/teacher/StudentSelection';
import EnterScoresScreen from '../screens/teacher/EnterScoresScreen';
import AssessmentSummaryScreen from '../screens/teacher/AssessmentSummaryScreen';
import { AssessmentStackParamList } from './types';

const Stack = createStackNavigator<AssessmentStackParamList>();

const AssessmentStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AssessmentDashboard" component={AssessmentDashboard} />
      <Stack.Screen name="StudentSelection" component={StudentSelection} />
      <Stack.Screen name="EnterScores" component={EnterScoresScreen} />
      <Stack.Screen name="AssessmentSummary" component={AssessmentSummaryScreen} />
    </Stack.Navigator>
  );
};

export default AssessmentStack;
