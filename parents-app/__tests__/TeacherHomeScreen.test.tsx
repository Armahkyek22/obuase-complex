import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import TeacherHomeScreen from '../src/screens/teacher/TeacherHomeScreen';
import { mockTeacherClasses, mockTeacherProfile, mockUpcomingTasks } from '../src/mocks/teacherData';

// Mock the API call
jest.mock('../src/services/api', () => ({
  api: {
    get: jest.fn(() => Promise.resolve({ data: mockTeacherClasses })),
  },
}));

// Mock the useAuth hook
jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockTeacherProfile,
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));
describe('TeacherHomeScreen', () => {
  it('renders loading state initially', async () => {
    render(<TeacherHomeScreen />);
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  it('displays teacher name when loaded', async () => {
    render(<TeacherHomeScreen />);
    // Wait for loading to finish
    const teacherName = await screen.findByText(mockTeacherProfile.name);
    expect(teacherName).toBeTruthy();
  });

  it('displays list of classes', async () => {
    render(<TeacherHomeScreen />);
    // Wait for classes to load
    const classItems = await screen.findAllByTestId('class-item');
    expect(classItems.length).toBe(mockTeacherClasses.length);
  });

  it('shows subjects for each class', async () => {
    render(<TeacherHomeScreen />);
    // Check first class subjects
    const firstClass = mockTeacherClasses[0];
    const firstSubject = await screen.findByText(firstClass.subjects[0]);
    expect(firstSubject).toBeTruthy();
  });

  it('displays error message when API call fails', async () => {
    // Mock API failure
    const errorMessage = 'Failed to load classes';
    require('../src/services/api').api.get.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<TeacherHomeScreen />);
    
    // Check if error message is displayed
    const errorElement = await screen.findByText(/failed to load/i);
    expect(errorElement).toBeTruthy();
    
    // Test retry button
    const retryButton = await screen.findByText('Retry');
    expect(retryButton).toBeTruthy();
  });

  it('shows empty state when no classes are available', async () => {
    // Mock empty response
    require('../src/services/api').api.get.mockResolvedValueOnce({ data: [] });
    
    render(<TeacherHomeScreen />);
    
    const emptyState = await screen.findByText('No classes assigned yet');
    expect(emptyState).toBeTruthy();
  });
});
