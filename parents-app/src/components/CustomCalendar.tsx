import React from 'react';
import { Calendar as CalendarComponent, LocaleConfig } from 'react-native-calendars';
import { COLORS } from '../constants/colors';

// Configure calendar text
LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  monthNamesShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
  dayNames: [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ],
  dayNamesShort: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
  today: 'Today'
};

LocaleConfig.defaultLocale = 'en';

interface CustomCalendarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
  minDate?: string;
  maxDate?: string;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  onDateSelect,
  selectedDate = new Date(),
  minDate,
  maxDate
}) => {
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const markedDates = {
    [formatDate(selectedDate)]: {
      selected: true,
      selectedColor: COLORS.primary,
      selectedTextColor: '#FFFFFF'
    }
  };

  return (
    <CalendarComponent
      current={formatDate(selectedDate)}
      minDate={minDate}
      maxDate={maxDate || formatDate(new Date())}
      onDayPress={(day) => {
        const selectedDate = new Date(day.timestamp);
        onDateSelect?.(selectedDate);
        // Don't close the calendar automatically
      }}
      markedDates={markedDates}
      theme={{
        // Calendar styles
        backgroundColor: '#f5f5f5',
        calendarBackground: '#f5f5f5',
        textSectionTitleColor: COLORS.text.secondary,
        
        // Selected day styles
        selectedDayBackgroundColor: COLORS.primary,
        selectedDayTextColor: '#FFFFFF',
        selectedDotColor: '#FFFFFF',
        
        // Text styles
        todayTextColor: COLORS.primary,
        dayTextColor: COLORS.text.primary,
        textDisabledColor: COLORS.text.secondary + '80',
        
        // Font styles
        textDayFontFamily: 'LeagueSpartan-Regular',
        textMonthFontFamily: 'LeagueSpartan-Regular',
        textDayHeaderFontFamily: 'LeagueSpartan-Regular',
        
        // Font sizes
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 12,
        
        // Month header styles
        monthTextColor: COLORS.primary,
        textMonthFontWeight: 'normal',
        
        // Arrow styles
        arrowColor: COLORS.primary,
        
        // Dot styles
        dotColor: COLORS.primary,
      }}
      style={{
        borderRadius: 12,
        padding: 8,
      }}
    />
  );
};

export default CustomCalendar;
