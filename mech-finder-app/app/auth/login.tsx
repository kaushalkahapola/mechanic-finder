import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Link, router } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Mail, Lock, LogIn } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SocialButton } from '@/components/ui/SocialButton';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function LoginScreen() {
  const { colors, spacing, typography, isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(async () => {
      try {
        // In a real app, you would validate credentials with your API
        // For demo purposes, we'll just store a fake token
        await AsyncStorage.setItem('userToken', 'fake-auth-token');
        await AsyncStorage.setItem('userRole', 'customer');
        router.replace('/(tabs)');
      } catch (error) {
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleGoogleLogin = () => {
    // Implement Google login logic
    console.log('Google login');
  };

  const handleAppleLogin = () => {
    // Implement Apple login logic
    console.log('Apple login');
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
            <Image
              source={{ uri: 'https://images.pexels.com/photos/3807386/pexels-photo-3807386.jpeg' }}
              style={styles.logo}
            />
            <Text
              style={[
                styles.title,
                typography.h1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              Mechanic Finder
            </Text>
            <Text
              style={[
                styles.subtitle,
                typography.body1,
                { color: isDark ? colors.gray[600] : colors.gray[600] },
              ]}
            >
              Sign in to your account
            </Text>
          </View>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.form}>
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
                  label="Password"
                  placeholder="Enter your password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={touched.password && errors.password ? errors.password : undefined}
                  leftIcon={<Lock color={colors.gray[500]} size={spacing.iconSize.medium} />}
                  isPassword
                />

                <TouchableOpacity
                  onPress={() => router.push('/auth/forgot-password')}
                  style={styles.forgotPassword}
                >
                  <Text
                    style={[
                      typography.body2,
                      { color: colors.primary[500] },
                    ]}
                  >
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                <Button
                  title="Login"
                  onPress={() => handleSubmit()}
                  loading={isLoading}
                  fullWidth
                  style={styles.loginButton}
                  rightIcon={<LogIn color={colors.white} size={spacing.iconSize.medium} />}
                />
              </View>
            )}
          </Formik>

          <View style={styles.divider}>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: isDark ? colors.gray[700] : colors.gray[300] },
              ]}
            />
            <Text
              style={[
                styles.dividerText,
                typography.body2,
                { color: isDark ? colors.gray[600] : colors.gray[600] },
              ]}
            >
              OR
            </Text>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: isDark ? colors.gray[700] : colors.gray[300] },
              ]}
            />
          </View>

          <View style={styles.socialButtons}>
            <SocialButton
              title="Continue with Google"
              icon={
                <Image
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                  style={styles.socialIcon}
                />
              }
              onPress={handleGoogleLogin}
              style={styles.socialButton}
            />

            <SocialButton
              title="Continue with Apple"
              icon={
                <Image
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' }}
                  style={styles.socialIcon}
                />
              }
              onPress={handleAppleLogin}
              style={styles.socialButton}
            />
          </View>

          <View style={styles.footer}>
            <Text
              style={[
                typography.body2,
                { color: isDark ? colors.gray[600] : colors.gray[600] },
              ]}
            >
              Don't have an account?{' '}
            </Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity>
                <Text
                  style={[
                    typography.body2,
                    { color: colors.primary[500], fontFamily: 'Inter-SemiBold' },
                  ]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Link>
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
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 16,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
  },
  socialButtons: {
    gap: 16,
    marginBottom: 24,
  },
  socialButton: {
    marginBottom: 0,
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
});