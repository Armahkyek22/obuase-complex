import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type AttendanceStatsProps = {
  total: number;
  present: number;
  absent: number;
};

const AttendanceStats: React.FC<AttendanceStatsProps> = ({ total, present, absent }) => {
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{total}</Text>
        <Text style={styles.statLabel}>Total</Text>
      </View>
      <View style={[styles.statItem, styles.presentStat]}>
        <Text style={[styles.statValue, styles.presentText]}>{present}</Text>
        <Text style={[styles.statLabel, styles.presentText]}>Present</Text>
      </View>
      <View style={[styles.statItem, styles.absentStat]}>
        <Text style={[styles.statValue, styles.absentText]}>{absent}</Text>
        <Text style={[styles.statLabel, styles.absentText]}>Absent</Text>
      </View>
      <View style={[styles.statItem, styles.percentageStat]}>
        <Text style={[styles.statValue, styles.percentageText]}>{percentage}%</Text>
        <Text style={[styles.statLabel, styles.percentageText]}>Present</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    padding: 8,
    borderRadius: 8,
  },
  presentStat: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  absentStat: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  percentageStat: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  presentText: {
    color: '#065F46',
  },
  absentText: {
    color: '#991B1B',
  },
  percentageText: {
    color: '#4F46E5',
  },
});

export default AttendanceStats;
