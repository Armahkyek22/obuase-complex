import React from 'react';
import { Text as RNText, StyleSheet, TextProps } from 'react-native';

type Props = TextProps & {
  variant?: 'regular' | 'medium' | 'semiBold' | 'bold';
};

const Text: React.FC<Props> = ({
  style,
  variant = 'regular',
  children,
  ...props
}) => {
  const getFontFamily = () => {
    switch (variant) {
      case 'medium':
        return 'LeagueSpartan-Medium';
      case 'semiBold':
        return 'LeagueSpartan-SemiBold';
      case 'bold':
        return 'LeagueSpartan-Bold';
      case 'regular':
      default:
        return 'LeagueSpartan-Regular';
    }
  };

  return (
    <RNText
      style={[styles.text, { fontFamily: getFontFamily() }, style]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    color: '#1F2937',
  },
});

export default Text;
