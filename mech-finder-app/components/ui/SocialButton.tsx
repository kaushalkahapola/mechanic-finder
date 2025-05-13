import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface SocialButtonProps {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  title,
  icon,
  onPress,
  style,
  textStyle,
}) => {
  const { colors, spacing, typography, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isDark ? colors.gray[100] : colors.white,
          borderColor: isDark ? colors.gray[300] : colors.gray[300],
          paddingVertical: spacing.md,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon}
      <Text
        style={[
          styles.text,
          typography.button,
          {
            color: isDark ? colors.gray[900] : colors.gray[900],
            marginLeft: spacing.md,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    width: '100%',
  },
  text: {
    textAlign: 'center',
  },
});