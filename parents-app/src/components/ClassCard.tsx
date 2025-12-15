import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from './Text';

export interface ClassCardProps {
  id: string;
  name: string;
  time?: string;
  subject: string;
  onPress?: () => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ 
  name, 
  time, 
  subject,
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.classInfo}>
        <View style={styles.classHeader}>
          <Text style={styles.className} numberOfLines={1} ellipsizeMode="tail">
            {name}
          </Text>
          {time && (
            <Text style={styles.classTime}>
              {time}
            </Text>
          )}
        </View>
        <Text style={styles.subjectText} numberOfLines={1} ellipsizeMode="tail">
          {subject || 'No subject assigned'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  classInfo: {
    flex: 1,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    marginRight: 8,
  },
  classTime: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  subjectText: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
});

export default ClassCard;
