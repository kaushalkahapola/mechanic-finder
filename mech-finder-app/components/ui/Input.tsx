import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  isPassword = false,
  containerStyle,
  ...props
}) => {
  const { colors, spacing, typography, isDark } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const inputStyles = [
    styles.input,
    {
      backgroundColor: isDark ? colors.gray[100] : colors.white,
      color: isDark ? colors.gray[900] : colors.gray[900],
      borderColor: error ? colors.error[500] : isDark ? colors.gray[300] : colors.gray[300],
      height: spacing.inputHeight,
      paddingLeft: leftIcon ? spacing.xl : spacing.md,
      paddingRight: (isPassword || rightIcon) ? spacing.xl : spacing.md,
      fontFamily: typography.body1.fontFamily,
      fontSize: typography.body1.fontSize,
    },
  ];

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: isDark ? colors.gray[700] : colors.gray[700],
              marginBottom: spacing.xs,
              ...typography.body2,
            },
          ]}
        >
          {label}
        </Text>
      )}
      <View style={styles.inputContainer}>
        {leftIcon && <View style={[styles.leftIcon, { left: spacing.sm }]}>{leftIcon}</View>}
        <TextInput
          style={inputStyles}
          placeholderTextColor={isDark ? colors.gray[500] : colors.gray[500]}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...props}
        />
        {isPassword ? (
          <TouchableOpacity
            style={[styles.rightIcon, { right: spacing.sm }]}
            onPress={togglePasswordVisibility}
          >
            {isPasswordVisible ? (
              <EyeOff color={colors.gray[500]} size={spacing.iconSize.medium} />
            ) : (
              <Eye color={colors.gray[500]} size={spacing.iconSize.medium} />
            )}
          </TouchableOpacity>
        ) : rightIcon ? (
          <View style={[styles.rightIcon, { right: spacing.sm }]}>{rightIcon}</View>
        ) : null}
      </View>
      {error && (
        <Text
          style={[
            styles.error,
            {
              color: colors.error[500],
              marginTop: spacing.xs,
              ...typography.caption,
            },
          ]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontWeight: '500',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
  },
  leftIcon: {
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  rightIcon: {
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  error: {
    marginTop: 4,
  },
});