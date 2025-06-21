import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/theme/ThemeProvider';
import { router } from 'expo-router';
import { ArrowLeft, Check, User, Mail, Phone } from 'lucide-react-native';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useData } from '@/context/DataContext'; // Import useData

export default function EditProfileScreen() {
  const { colors, spacing, typography, isDark } = useTheme();
  const { user, updateUser: contextUpdateUser } = useData(); // Get user and updateUser from context

  // Initialize form state with user data from context
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  // Profile image editing is not handled in this iteration

  const handleSaveChanges = () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Missing Information', 'Name and Email are required.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return;
    }

    contextUpdateUser({ // Use context function
      name,
      email,
      phone,
      // profileImage is not changed here, context will merge
    });

    Alert.alert('Profile Updated', 'Your profile information has been saved.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  // Effect to update form fields if user data changes in context (e.g., from another source, though unlikely in this app)
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
  }, [user]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.gray[50] : colors.white }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={[styles.header, { backgroundColor: isDark ? colors.gray[100] : colors.primary[500], borderBottomColor: isDark ? colors.gray[200] : colors.primary[600] }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color={isDark ? colors.primary[500] : colors.white} size={spacing.iconSize.large} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, typography.h3, { color: isDark ? colors.primary[500] : colors.white }]}>
          Edit Profile
        </Text>
        <View style={{ width: spacing.iconSize.large }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          {/* <Image source={{ uri: user.profileImage }} style={styles.profileImage} /> */}

          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            containerStyle={styles.inputContainer}
            leftIcon={<User color={colors.gray[500]} size={spacing.iconSize.medium} />}
          />
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            containerStyle={styles.inputContainer}
            leftIcon={<Mail color={colors.gray[500]} size={spacing.iconSize.medium} />}
          />
          <Input
            label="Phone Number (Optional)"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            containerStyle={styles.inputContainer}
            leftIcon={<Phone color={colors.gray[500]} size={spacing.iconSize.medium} />}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: isDark ? colors.gray[100] : colors.white, borderTopColor: isDark ? colors.gray[200] : colors.gray[100] }]}>
        <Button
          title="Save Changes"
          onPress={handleSaveChanges}
          variant="primary"
          fullWidth
          leftIcon={<Check color={colors.white} size={spacing.iconSize.medium} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    // borderBottomColor: '#eee', // Will be set in component style directly
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 100, // Space for footer
  },
  formContainer: {
    padding: 20,
  },
  profileImage: { // If you add an image view
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    // borderTopColor: '#eee', // Will be set in component style directly
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
