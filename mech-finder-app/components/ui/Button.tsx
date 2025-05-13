import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
  View,
} from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...props
}) => {
  const { colors, spacing, typography, isDark } = useTheme();
  
  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: spacing.sm,
      paddingVertical: size === 'small' ? spacing.sm : size === 'large' ? spacing.lg : spacing.md,
      paddingHorizontal: size === 'small' ? spacing.md : size === 'large' ? spacing.xl : spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: size === 'small' ? 80 : size === 'large' ? 160 : 120,
      ...(fullWidth && { width: '100%' }),
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: colors.primary[500],
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.secondary[500],
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primary[500],
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: colors.error[500],
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...typography.button,
      textAlign: 'center',
    };

    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return {
          ...baseStyle,
          color: colors.white,
        };
      case 'outline':
        return {
          ...baseStyle,
          color: colors.primary[500],
        };
      case 'ghost':
        return {
          ...baseStyle,
          color: colors.primary[500],
        };
      default:
        return baseStyle;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      disabled={loading || props.disabled}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? colors.primary[500] : colors.white}
        />
      ) : (
        <>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={[getTextStyles(), textStyle]}>{title}</Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});