import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutDashboard, UserCog } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';

export default function MechanicTabLayout() {
  const { colors, spacing, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: isDark ? colors.gray[600] : colors.gray[500],
        tabBarStyle: {
          backgroundColor: isDark ? colors.gray[50] : colors.white,
          borderTopColor: isDark ? colors.gray[200] : colors.gray[200],
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60,
          paddingBottom: spacing.sm,
          paddingTop: spacing.sm,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: colors.primary[500],
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontFamily: 'Inter-SemiBold',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          href: '/dashboard',
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard color={color} size={size} />
          ),
          headerTitle: 'Mechanic Dashboard',
        }}
      />
      <Tabs.Screen
        name="edit-profile"
        options={{
          title: 'Edit Profile',
          href: '/edit-profile',
          tabBarIcon: ({ color, size }) => (
            <UserCog color={color} size={size} />
          ),
          headerTitle: 'Edit Profile',
        }}
      />
    </Tabs>
  );
}
