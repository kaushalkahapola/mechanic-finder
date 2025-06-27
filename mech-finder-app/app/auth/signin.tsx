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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Link, router } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Mail, Lock, LogIn, User, Phone, Wrench, Car, UserPlus } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SocialButton } from '@/components/ui/SocialButton';
import { initializeSampleData } from '@/mock/sampleData';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

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
});

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  userType: 'mechanic' | 'vehicle_owner';
  createdAt: string;
}

export default function SignInScreen() {
  const { colors, spacing, typography, isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [selectedUserType, setSelectedUserType] = useState<'mechanic' | 'vehicle_owner'>('vehicle_owner');

  // Initialize sample data on component mount
  React.useEffect(() => {
    initializeSampleData();
  }, []);

  const saveUserToFile = async (userData: UserData) => {
    try {
      const existingUsers = await AsyncStorage.getItem('users');
      const users: UserData[] = existingUsers ? JSON.parse(existingUsers) : [];
      
      // Check if user already exists
      const existingUser = users.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      users.push(userData);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  };

  const validateUser = async (email: string, password: string) => {
    try {
      const existingUsers = await AsyncStorage.getItem('users');
      const users: UserData[] = existingUsers ? JSON.parse(existingUsers) : [];
      
      const user = users.find(u => u.email === email && u.password === password);
      return user;
    } catch (error) {
      console.error('Error validating user:', error);
      return null;
    }
  };

  const handleLogin = async (values: { email: string; password: string }) => {
    setIsLoading(true);
    
    try {
      const user = await validateUser(values.email, values.password);
      
      if (user) {
        await AsyncStorage.setItem('userToken', 'fake-auth-token');
        await AsyncStorage.setItem('userRole', user.userType);
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
        
        if (user.userType === 'mechanic') {
          router.navigate({
            pathname: '/mechanic/dashboard'
          });
        } else {
          router.navigate({
            pathname: '/vehicle/dashboard'
          });
        }
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (values: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    userType: 'mechanic' | 'vehicle_owner';
  }) => {
    setIsLoading(true);

    try {
      console.log('Starting registration for user type:', values.userType);
      
      const userData: UserData = {
        id: Date.now().toString(),
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
        userType: values.userType,
        createdAt: new Date().toISOString(),
      };

      console.log('User data created:', userData);

      // For vehicle owners, navigate to subscription page
      if (values.userType === 'vehicle_owner') {
        console.log('Navigating to subscription page for vehicle owner');
        router.push({
          pathname: '/auth/subscription',
          params: { userData: JSON.stringify(userData) }
        });
      } else {
        // For mechanics, complete registration directly
        console.log('Completing registration for mechanic');
        await saveUserToFile(userData);
        
        await AsyncStorage.setItem('userToken', 'fake-auth-token');
        await AsyncStorage.setItem('userRole', values.userType);
        await AsyncStorage.setItem('currentUser', JSON.stringify(userData));
        
        console.log('User data saved to storage, navigating to dashboard...');
        
        // Add a small delay to ensure storage operations complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('Navigating to mechanic dashboard');
        router.navigate({
          pathname: '/mechanic/dashboard'
        });
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Error', error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Coming Soon', 'Google login will be implemented soon');
  };

  const handleAppleLogin = () => {
    Alert.alert('Coming Soon', 'Apple login will be implemented soon');
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
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </Text>
          </View>

          {/* Toggle between Login and Register */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                isLogin && { backgroundColor: colors.primary[500] }
              ]}
              onPress={() => setIsLogin(true)}
            >
              <Text
                style={[
                  styles.toggleText,
                  typography.body2,
                  { color: isLogin ? colors.white : colors.gray[600] }
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                !isLogin && { backgroundColor: colors.primary[500] }
              ]}
              onPress={() => setIsLogin(false)}
            >
              <Text
                style={[
                  styles.toggleText,
                  typography.body2,
                  { color: !isLogin ? colors.white : colors.gray[600] }
                ]}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {isLogin ? (
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
          ) : (
            <Formik
              initialValues={{
                name: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={registerSchema}
              onSubmit={(values) => handleRegister({ ...values, userType: selectedUserType })}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View style={styles.form}>
                  {/* User Type Selection */}
                  <View style={styles.userTypeContainer}>
                    <Text
                      style={[
                        styles.userTypeLabel,
                        typography.body2,
                        { color: isDark ? colors.gray[600] : colors.gray[600] },
                      ]}
                    >
                      I am a:
                    </Text>
                    <View style={styles.userTypeButtons}>
                      <TouchableOpacity
                        style={[
                          styles.userTypeButton,
                          selectedUserType === 'vehicle_owner' && {
                            backgroundColor: colors.primary[500],
                            borderColor: colors.primary[500],
                          },
                        ]}
                        onPress={() => {
                          setSelectedUserType('vehicle_owner');
                        }}
                      >
                        <Car
                          color={selectedUserType === 'vehicle_owner' ? colors.white : colors.gray[500]}
                          size={spacing.iconSize.medium}
                        />
                        <Text
                          style={[
                            styles.userTypeText,
                            typography.body2,
                            {
                              color: selectedUserType === 'vehicle_owner' ? colors.white : colors.gray[600],
                            },
                          ]}
                        >
                          Vehicle Owner
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.userTypeButton,
                          selectedUserType === 'mechanic' && {
                            backgroundColor: colors.primary[500],
                            borderColor: colors.primary[500],
                          },
                        ]}
                        onPress={() => {
                          setSelectedUserType('mechanic');
                        }}
                      >
                        <Wrench
                          color={selectedUserType === 'mechanic' ? colors.white : colors.gray[500]}
                          size={spacing.iconSize.medium}
                        />
                        <Text
                          style={[
                            styles.userTypeText,
                            typography.body2,
                            {
                              color: selectedUserType === 'mechanic' ? colors.white : colors.gray[600],
                            },
                          ]}
                        >
                          Mechanic
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

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
                    error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
                    leftIcon={<Lock color={colors.gray[500]} size={spacing.iconSize.medium} />}
                    isPassword
                  />

                  <Button
                    title="Create Account"
                    onPress={() => handleSubmit()}
                    loading={isLoading}
                    fullWidth
                    style={styles.registerButton}
                    rightIcon={<UserPlus color={colors.white} size={spacing.iconSize.medium} />}
                  />
                </View>
              )}
            </Formik>
          )}

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
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleText: {
    fontWeight: '600',
  },
  form: {
    marginBottom: 24,
  },
  userTypeContainer: {
    marginBottom: 20,
  },
  userTypeLabel: {
    marginBottom: 12,
    fontWeight: '600',
  },
  userTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  userTypeText: {
    fontWeight: '600',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 8,
  },
  registerButton: {
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontWeight: '600',
  },
  socialButtons: {
    gap: 12,
  },
  socialButton: {
    marginBottom: 0,
  },
  socialIcon: {
    width: 20,
    height: 20,
  },
}); 