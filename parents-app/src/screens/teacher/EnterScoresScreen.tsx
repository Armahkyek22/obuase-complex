import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AssessmentStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { LeagueSpartan_500Medium } from '@expo-google-fonts/league-spartan';


type EnterScoresScreenRouteProp = RouteProp<AssessmentStackParamList, 'EnterScores'>;

interface ScoreEntryParams {
  class: string;
  subject: string;
  term: string;
  studentId: string;
  studentName: string;
  score?: string;
  remarks?: string;
  maxScore: number;
}

const assessmentTypes = [
  { id: 'test1', name: 'Test 1', maxScore: 15 },
  { id: 'test2', name: 'Test 2', maxScore: 15 },
  { id: 'project', name: 'Project Work', maxScore: 15 },
  { id: 'group', name: 'Group Work', maxScore: 15 },
  { id: 'exam', name: 'Examination', maxScore: 100 }
];

const EnterScoresScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<AssessmentStackParamList>>();
  const route = useRoute<EnterScoresScreenRouteProp>();
  const { 
    class: selectedClass, 
    subject, 
    term, 
    studentId, 
    studentName, 
    score: initialScore = '', 
    remarks: initialRemarks = '',
    maxScore 
  } = route.params as ScoreEntryParams;

  const [scores, setScores] = useState<Record<string, string>>(() => {
    const initialScores: Record<string, string> = {};
    assessmentTypes.forEach(type => {
      initialScores[type.id] = '';
    });
    return initialScores;
  });

  const [remarks, setRemarks] = useState(initialRemarks);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScoreChange = (type: string, value: string) => {
    // Allow only numbers and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      const maxScore = assessmentTypes.find(t => t.id === type)?.maxScore || 0;
      if (value === '' || (Number.parseFloat(value) >= 0 && Number.parseFloat(value) <= maxScore)) {
        setScores(prev => ({
          ...prev,
          [type]: value
        }));
      }
    }
  };

  const handleSaveDraft = async () => {
    try {
      // In a real app, save to local storage or API
      await new Promise(resolve => setTimeout(resolve, 500));
      Alert.alert('Success', 'Score draft saved successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save draft';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleSubmitScore = async () => {
    // Check if all required scores are entered
    const missingScores = assessmentTypes
      .filter(type => !scores[type.id])
      .map(type => type.name);

    if (missingScores.length > 0) {
      Alert.alert('Missing Scores', `Please enter scores for: ${missingScores.join(', ')}`);
      return;
    }

    // Validate all scores are within range
    for (const type of assessmentTypes) {
      const scoreValue = Number.parseFloat(scores[type.id]);
      if (isNaN(scoreValue) || scoreValue < 0 || scoreValue > type.maxScore) {
        Alert.alert('Invalid Score', `${type.name} score must be between 0 and ${type.maxScore}`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // In a real app, submit to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to student selection with success
      navigation.navigate('StudentSelection', {
        class: selectedClass,
        subject,
        term,
      });
      
      const totalScores = calculateTotalScore();
      Alert.alert(
        'Success',
        `Scores submitted successfully!\n\n` +
        `Total Raw Score: ${totalScores.raw}\n` +
        `Total Scaled Score: ${totalScores.scaled}/100\n\n` +
        'Scores have been saved.'
      );
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit score';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate scaled score based on assessment type
  const calculateScaledScore = (type: string, rawScore: string): number => {
    const score = Number.parseFloat(rawScore) || 0;
    const maxScore = assessmentTypes.find(t => t.id === type)?.maxScore || 0;
    
    if (type === 'exam') {
      // Scale exam (100 → 50)
      return Math.round((score / maxScore) * 50 * 100) / 100;
    } else {
      // Scale CA components (60 → 50)
      return Math.round((score / maxScore) * (50 / 4) * 100) / 100;
    }
  };

  // Calculate total scaled score
  const calculateTotalScore = (): { raw: number; scaled: number } => {
    let totalRaw = 0;
    let totalScaled = 0;

    Object.entries(scores).forEach(([type, score]) => {
      const rawScore = Number.parseFloat(score) || 0;
      totalRaw += rawScore;
      totalScaled += calculateScaledScore(type, score);
    });

    return {
      raw: Math.round(totalRaw * 100) / 100,
      scaled: Math.round(totalScaled * 100) / 100
    };
  };

  // Generate a consistent color based on student name
  const getStudentColor = (name: string) => {
    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const studentInitials = studentName
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Assessment Scores</Text>
          <View style={{ width: 40 }} />
        </View>
      </SafeAreaView>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.studentCard}>
          <Text style={styles.studentName}>{studentName}</Text>
          <View style={[styles.avatarContainer, { backgroundColor: getStudentColor(studentName) }]}>
            <Text style={styles.avatarText}>{studentInitials}</Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Enter Assessment Scores</Text>
        
        {assessmentTypes.map((type) => (
          <View key={type.id} style={styles.assessmentRow}>
            <Text style={styles.assessmentLabel}>
              {type.name}
            </Text>
            <View style={styles.scoreInputContainer}>
              <TextInput
                style={styles.scoreInput}
                value={scores[type.id]}
                onChangeText={(value) => handleScoreChange(type.id, value)}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#9CA3AF"
              />

            </View>
            {scores[type.id] && (
              <Text style={styles.scaledScoreText}>
                {calculateScaledScore(type.id, scores[type.id]).toFixed(2)}
              </Text>
            )}
          </View>
        ))}
            
        <View style={styles.totalScoreContainer}>
          <Text style={styles.totalScoreLabel}>Total Score:</Text>
          <Text style={styles.totalScoreValue}>
            {calculateTotalScore().scaled.toFixed(2)} / 100
          </Text>
        </View>

        <View style={styles.remarksContainer}>
          <Text style={styles.sectionTitle}>Remarks (Optional)</Text>
          <TextInput
            style={styles.remarksInput}
            value={remarks}
            onChangeText={setRemarks}
            placeholder="Add any remarks about this score"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
          />
        </View>
     

      <View style={styles.footerContainer}>
        <View style={styles.buttonColumn}>
          <TouchableOpacity 
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmitScore}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Text style={styles.submitButtonText}>Submitting...</Text>
            ) : (
              <Text style={styles.submitButtonText}>Submit Score</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.draftButton]}
            onPress={handleSaveDraft}
            disabled={isSubmitting}
          >
            <Text style={styles.draftButtonText}>Save as Draft</Text>
          </TouchableOpacity>
        </View>
      </View>
              </ScrollView>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  scrollViewContent: {
    padding: 16,
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  studentName: {
    fontSize: 24,
    fontFamily: 'LeagueSpartan_Medium',
    fontWeight: '600',
    color: '#111827',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: COLORS.primary,
    fontFamily: 'LeagueSpartan-Bold',
    letterSpacing: -0.8,
    marginBottom: 16,
    marginTop: 8,
    paddingLeft: 14,
  },
  assessmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.background.light,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  assessmentLabel: {
    fontSize: 20,
    fontWeight: '500',
    color: '#374151',
    fontFamily: 'LeagueSpartan-Regular',
    flex: 1,
    marginRight: 16,
  },
  scoreInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 100,
    marginLeft: 'auto',
  },
  scoreInput: {
    width: 60,
    fontSize: 20,
    fontFamily: 'LeagueSpartan-Regular',
    fontWeight: '500',
    color: '#111827',
    textAlign: 'right',
    padding: 0,
    margin: 0,
    backgroundColor: 'transparent',
  },
  scaledScoreText: {
    fontSize: 20,
    color: COLORS.text.primary,
    fontFamily: 'LeagueSpartan-Regular',
    textAlign: 'right',
    marginTop: 4,
  },
  maxScoreText: {
    fontSize: 20,
    color: COLORS.text.primary,
    fontFamily: 'LeagueSpartan-Regular',
    marginLeft: 4,
    fontWeight: 'normal',
  },
  totalScoreContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalScoreLabel: {
    fontSize: 20,
    paddingLeft: 14,
    fontFamily: 'LeagueSpartan-Bold',
    color: '#111827',
  },
  totalScoreValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  remarksContainer: {
    marginTop: 24,
  },
  remarksInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    color: COLORS.text.primary,
    backgroundColor: COLORS.background.light,
    fontFamily: 'LeagueSpartan-Regular',
  },
  safeArea: {
    backgroundColor: COLORS.background.light,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 32,
    letterSpacing: -0.8,
    fontWeight: '600',
    color: COLORS.primary,
    fontFamily: 'LeagueSpartan-Bold',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContainer: {
    marginTop: 16,
    padding: 16,
    paddingBottom: 24,
  },
  buttonColumn: {
    flexDirection: 'column',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  draftButton: {
    backgroundColor: 'rgba(55, 52, 52, 0.1)',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    elevation: 2,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
  },
  draftButtonText: {
    color: COLORS.text.primary,
    fontFamily: 'LeagueSpartan-Bold',
    fontSize: 16,
    fontWeight: '700',
  },
  submitButtonText: {
    color: COLORS.background.light,
    fontFamily: 'LeagueSpartan-Bold',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  buttonIcon: {
    marginRight: 4,
  },
});

export default EnterScoresScreen;
