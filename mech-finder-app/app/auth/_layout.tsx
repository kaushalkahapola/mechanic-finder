import { Stack } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

export default function AuthLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary[500],
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
        },
        headerBackTitleVisible: false,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          headerShown: false,
          title: 'Create Account',
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          title: 'Reset Password',
        }}
      />
    </Stack>
  );
}