import React from 'react';
import { Tabs } from 'expo-router';
import { Chrome as Home, Car, Calendar, User } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';

export default function TabLayout() {
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
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          headerTitle: 'Mechanic Finder',
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          title: 'Vehicles',
          tabBarIcon: ({ color, size }) => <Car color={color} size={size} />,
          headerTitle: 'My Vehicles',
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
          headerTitle: 'My Bookings',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          headerTitle: 'My Profile',
        }}
      />
    </Tabs>
  );
}