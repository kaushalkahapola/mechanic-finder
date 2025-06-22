import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme/ThemeProvider';
import { router } from 'expo-router';
import {
  User,
  Mail,
  Phone,
  Settings,
  Bell,
  Moon,
  LogOut,
  ChevronRight,
  Key,
  ShieldCheck,
  CircleHelp as HelpCircle,
  FileText,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useData } from '@/context/DataContext'; // Import useData

export default function ProfileScreen() {
  const { colors, spacing, typography, isDark, setTheme, theme } = useTheme();
  const { user } = useData(); // Get user from context
  const [notificationsEnabled, setNotificationsEnabled] = useState(true); // Keep as local UI state

  const handleDarkModeToggle = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const navigateToStaticPage = (path: string) => {
    router.push(path as any);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userRole');
              router.replace('/auth/login');
            } catch (error) {
              console.error('Error logging out:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? colors.gray[50] : colors.gray[50] },
      ]}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View
            style={[
              styles.profileSection,
              { backgroundColor: isDark ? colors.gray[100] : colors.white },
            ]}
          >
            <Image
              source={{
                uri:
                  user.profileImage ||
                  'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
              }} // Use user.profileImage
              style={styles.profileImage}
            />
            <Text
              style={[
                styles.name,
                typography.h3,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              {user.name} {/* Use user.name */}
            </Text>
            <TouchableOpacity
              style={[
                styles.editButton,
                { backgroundColor: colors.primary[500] },
              ]}
              onPress={handleEditProfile}
            >
              <Text style={[typography.button, { color: colors.white }]}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.infoSection,
            { backgroundColor: isDark ? colors.gray[100] : colors.white },
          ]}
        >
          <View style={styles.infoRow}>
            <User color={colors.gray[500]} size={spacing.iconSize.medium} />
            <Text
              style={[
                styles.infoLabel,
                typography.body2,
                { color: isDark ? colors.gray[600] : colors.gray[600] },
              ]}
            >
              Name
            </Text>
            <Text
              style={[
                styles.infoValue,
                typography.body1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              {user.name} {/* Use user.name */}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Mail color={colors.gray[500]} size={spacing.iconSize.medium} />
            <Text
              style={[
                styles.infoLabel,
                typography.body2,
                { color: isDark ? colors.gray[600] : colors.gray[600] },
              ]}
            >
              Email
            </Text>
            <Text
              style={[
                styles.infoValue,
                typography.body1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              {user.email} {/* Use user.email */}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Phone color={colors.gray[500]} size={spacing.iconSize.medium} />
            <Text
              style={[
                styles.infoLabel,
                typography.body2,
                { color: isDark ? colors.gray[600] : colors.gray[600] },
              ]}
            >
              Phone
            </Text>
            <Text
              style={[
                styles.infoValue,
                typography.body1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              {user.phone} {/* Use user.phone */}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.settingsSection,
            { backgroundColor: isDark ? colors.gray[100] : colors.white },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              typography.subtitle1,
              { color: isDark ? colors.white : colors.gray[900] },
            ]}
          >
            Settings
          </Text>

          <View style={styles.settingRow}>
            <Bell color={colors.primary[500]} size={spacing.iconSize.medium} />
            <Text
              style={[
                styles.settingLabel,
                typography.body1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              Notifications
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{
                false: colors.gray[300],
                true: colors.primary[400],
              }}
              thumbColor={
                notificationsEnabled ? colors.primary[500] : colors.gray[100]
              }
            />
          </View>

          <View style={styles.settingRow}>
            <Moon color={colors.primary[500]} size={spacing.iconSize.medium} />
            <Text
              style={[
                styles.settingLabel,
                typography.body1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              Dark Mode
            </Text>
            <Switch
              value={isDark}
              onValueChange={handleDarkModeToggle}
              trackColor={{
                false: colors.gray[300],
                true: colors.primary[400],
              }}
              thumbColor={isDark ? colors.primary[500] : colors.gray[100]}
            />
          </View>
        </View>

        <View
          style={[
            styles.menuSection,
            { backgroundColor: isDark ? colors.gray[100] : colors.white },
          ]}
        >
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              Alert.alert(
                'Feature not implemented',
                'Changing password is not yet available.'
              )
            }
          >
            <View style={styles.menuIconContainer}>
              <Key color={colors.primary[500]} size={spacing.iconSize.medium} />
            </View>
            <Text
              style={[
                styles.menuText,
                typography.body1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              Change Password
            </Text>
            <ChevronRight
              color={colors.gray[500]}
              size={spacing.iconSize.medium}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateToStaticPage('/profile/privacy')}
          >
            <View style={styles.menuIconContainer}>
              <ShieldCheck
                color={colors.primary[500]}
                size={spacing.iconSize.medium}
              />
            </View>
            <Text
              style={[
                styles.menuText,
                typography.body1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              Privacy Policy
            </Text>
            <ChevronRight
              color={colors.gray[500]}
              size={spacing.iconSize.medium}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateToStaticPage('/profile/help')}
          >
            <View style={styles.menuIconContainer}>
              <HelpCircle
                color={colors.primary[500]}
                size={spacing.iconSize.medium}
              />
            </View>
            <Text
              style={[
                styles.menuText,
                typography.body1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              Help & Support
            </Text>
            <ChevronRight
              color={colors.gray[500]}
              size={spacing.iconSize.medium}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigateToStaticPage('/profile/terms')}
          >
            <View style={styles.menuIconContainer}>
              <FileText
                color={colors.primary[500]}
                size={spacing.iconSize.medium}
              />
            </View>
            <Text
              style={[
                styles.menuText,
                typography.body1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              Terms & Conditions
            </Text>
            <ChevronRight
              color={colors.gray[500]}
              size={spacing.iconSize.medium}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: isDark ? colors.gray[100] : colors.white },
          ]}
          onPress={handleLogout}
        >
          <LogOut color={colors.error[500]} size={spacing.iconSize.medium} />
          <Text
            style={[
              styles.logoutText,
              typography.body1,
              { color: colors.error[500] },
            ]}
          >
            Logout
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.versionText,
            typography.caption,
            { color: isDark ? colors.gray[600] : colors.gray[600] },
          ]}
        >
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  profileSection: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    marginBottom: 16,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  infoSection: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    marginLeft: 16,
    width: 60,
  },
  infoValue: {
    flex: 1,
    marginLeft: 16,
  },
  settingsSection: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLabel: {
    flex: 1,
    marginLeft: 16,
  },
  menuSection: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIconContainer: {
    width: 40,
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    marginVertical: 16,
  },
});
