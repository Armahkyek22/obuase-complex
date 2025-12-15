import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ViewStyle, Platform, Vibration } from 'react-native';
import { COLORS } from '../constants/colors';

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 3;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

interface CustomWheelPickerProps<T> {
  items: { label: string; value: T }[];
  selectedValue: T | null;
  onValueChange: (value: T) => void;
  placeholder?: string;
  style?: ViewStyle;
  enabled?: boolean;
}

const CustomWheelPicker = <T extends string | number>({
  items,
  selectedValue,
  onValueChange,
  placeholder = 'Select an option',
  style,
  enabled = true,
}: CustomWheelPickerProps<T>) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollViewRef = useRef<any>(null);

  // Update selected index when selectedValue changes
  useEffect(() => {
    if (selectedValue !== null) {
      const index = items.findIndex(item => item.value === selectedValue);
      if (index !== -1) {
        setSelectedIndex(index);
        scrollToIndex(index);
      }
    }
  }, [selectedValue, items]);

  const scrollToIndex = (index: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: index * ITEM_HEIGHT,
        animated: true,
      });
    }
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const triggerHaptic = useCallback(() => {
    if (Platform.OS === 'ios') {
      Vibration.vibrate(5); // Short vibration for iOS
    } else {
      Vibration.vibrate(50); // Slightly longer vibration for Android
    }
  }, []);

  const handleScrollEnd = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.min(Math.max(0, index), items.length - 1);
    
    if (clampedIndex >= 0 && clampedIndex < items.length) {
      setSelectedIndex(clampedIndex);
      onValueChange(items[clampedIndex].value);
      triggerHaptic();
    }
  };

  const handleMomentumScrollBegin = () => {
    triggerHaptic();
  };

  const inputRange = items.map((_, i) => i * ITEM_HEIGHT);
  const opacityOutputRange = items.map((_, i) => (i === 0 || i === items.length - 1 ? 0.3 : 1));
  const scaleOutputRange = items.map((_, i) => (i === 0 || i === items.length - 1 ? 0.9 : 1));

  return (
    <View style={[styles.container, style]}>
      <View style={styles.wheelContainer}>
        <Animated.ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
          onMomentumScrollBegin={handleMomentumScrollBegin}
          onMomentumScrollEnd={handleScrollEnd}
          onScrollBeginDrag={handleMomentumScrollBegin}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate={0.9}
          scrollEnabled={enabled}
        >
          {items.map((item, index) => {
            const inputRange = [
              (index - 2) * ITEM_HEIGHT,
              (index - 1) * ITEM_HEIGHT,
              index * ITEM_HEIGHT,
              (index + 1) * ITEM_HEIGHT,
              (index + 2) * ITEM_HEIGHT,
            ];

            const opacity = scrollY.interpolate({
              inputRange,
              outputRange: [0.3, 0.7, 1, 0.7, 0.3],
              extrapolate: 'clamp',
            });

            const scale = scrollY.interpolate({
              inputRange,
              outputRange: [0.8, 0.9, 1, 0.9, 0.8],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={`${item.value}-${index}`}
                style={[
                  styles.item,
                  {
                    opacity,
                    transform: [{ scale }],
                    height: ITEM_HEIGHT,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.itemText,
                    selectedValue === item.value && styles.selectedItemText,
                  ]}
                >
                  {item.label}
                </Text>
              </Animated.View>
            );
          })}
        </Animated.ScrollView>
        <View style={styles.selector} pointerEvents="none" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: WHEEL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelContainer: {
    position: 'relative',
    width: '100%',
    height: WHEEL_HEIGHT,
    overflow: 'hidden',
  },
  scrollView: {
    width: '100%',
    height: WHEEL_HEIGHT,
  },
  scrollViewContent: {
    paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 24,
    color: '#6B7280', // Gray color for unselected items
    fontFamily: 'LeagueSpartan-Regular',
  },
  selectedItemText: {
    color: COLORS.primary, // Blue color for selected item
    fontFamily: 'LeagueSpartan-Regular',
    fontSize: 26,
  },
  selector: {
    position: 'absolute',
    top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: 'rgba(61, 62, 63, 0.1)',
  },
});

export default CustomWheelPicker;
