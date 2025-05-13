import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import { Mail, Lock, User, Phone, UserCog } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const registerSchema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string().oneOf(['user', 'mechanic']).required('Role is required'),
});

interface RegisterValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'mechanic';
}

export default function RegisterScreen() {
  const { colors, spacing, typography, isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (values: RegisterValues) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(async () => {
      try {
        // In a real app, you would register the user with your API
        // For demo purposes, we'll just store a fake token
        await AsyncStorage.setItem('userToken', 'fake-auth-token');
        await AsyncStorage.setItem('userRole', values.role);
        router.replace('/(tabs)');
      } catch (error) {
        console.error('Registration error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: isDark ? colors.gray[50] : colors.white }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                typography.h2,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              Create Your Account
            </Text>
            <Text
              style={[
                styles.subtitle,
                typography.body1,
                { color: isDark ? colors.gray[600] : colors.gray[600] },
              ]}
            >
              Sign up to find mechanics near you
            </Text>
          </View>

          <Formik
            initialValues={{
              name: '',
              email: '',
              phone: '',
              password: '',
              confirmPassword: '',
              role: 'user' as const,
            }}
            validationSchema={registerSchema}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
              <View style={styles.form}>
                <Input
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  error={touched.name && errors.name ? errors.name : undefined}
                  leftIcon={<User color={colors.gray[500]} size={spacing.iconSize.medium} />}
                />

                <Input
                  label="Email"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={touched.email && errors.email ? errors.email : undefined}
                  leftIcon={<Mail color={colors.gray[500]} size={spacing.iconSize.medium} />}
                />

                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  error={touched.phone && errors.phone ? errors.phone : undefined}
                  leftIcon={<Phone color={colors.gray[500]} size={spacing.iconSize.medium} />}
                />

                <Input
                  label="Password"
                  placeholder="Create a password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={touched.password && errors.password ? errors.password : undefined}
                  leftIcon={<Lock color={colors.gray[500]} size={spacing.iconSize.medium} />}
                  isPassword
                />

                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  error={
                    touched.confirmPassword && errors.confirmPassword
                      ? errors.confirmPassword
                      : undefined
                  }
                  leftIcon={<Lock color={colors.gray[500]} size={spacing.iconSize.medium} />}
                  isPassword
                />

                <Text
                  style={[
                    styles.sectionTitle,
                    typography.subtitle2,
                    { color: isDark ? colors.white : colors.gray[900], marginTop: 8 },
                  ]}
                >
                  I am a:
                </Text>
                
                <View style={styles.roleSelector}>
                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      {
                        backgroundColor: values.role === 'user' ? colors.primary[500] : (isDark ? colors.gray[100] : colors.white),
                        borderColor: values.role === 'user' ? colors.primary[500] : colors.gray[300],
                      },
                    ]}
                    onPress={() => setFieldValue('role', 'user')}
                  >
                    <User
                      color={values.role === 'user' ? colors.white : colors.gray[500]}
                      size={spacing.iconSize.medium}
                    />
                    <Text
                      style={[
                        typography.button,
                        {
                          color: values.role === 'user' ? colors.white : (isDark ? colors.gray[700] : colors.gray[700]),
                          marginLeft: spacing.sm,
                        },
                      ]}
                    >
                      Vehicle Owner
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      {
                        backgroundColor: values.role === 'mechanic' ? colors.primary[500] : (isDark ? colors.gray[100] : colors.white),
                        borderColor: values.role === 'mechanic' ? colors.primary[500] : colors.gray[300],
                      },
                    ]}
                    onPress={() => setFieldValue('role', 'mechanic')}
                  >
                    <UserCog
                      color={values.role === 'mechanic' ? colors.white : colors.gray[500]}
                      size={spacing.iconSize.medium}
                    />
                    <Text
                      style={[
                        typography.button,
                        {
                          color: values.role === 'mechanic' ? colors.white : (isDark ? colors.gray[700] : colors.gray[700]),
                          marginLeft: spacing.sm,
                        },
                      ]}
                    >
                      Mechanic
                    </Text>
                  </TouchableOpacity>
                </View>

                <Button
                  title="Create Account"
                  onPress={() => handleSubmit()}
                  loading={isLoading}
                  fullWidth
                  style={styles.registerButton}
                />
              </View>
            )}
          </Formik>

          <View style={styles.footer}>
            <Text
              style={[
                typography.body2,
                { color: isDark ? colors.gray[600] : colors.gray[600] },
              ]}
            >
              Already have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text
                style={[
                  typography.body2,
                  { color: colors.primary[500], fontFamily: 'Inter-SemiBold' },
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    width: '48%',
  },
  registerButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});