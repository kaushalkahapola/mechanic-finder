import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { router } from 'expo-router';
import { Mail, ArrowLeft, CircleCheck as CheckCircle } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
});

export default function ForgotPasswordScreen() {
  const { colors, spacing, typography, isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (values: { email: string }) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, you would send a password reset email through your API
      setIsSuccess(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: isDark ? colors.gray[50] : colors.white }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Button
            variant="ghost"
            title="Back"
            leftIcon={<ArrowLeft color={colors.primary[500]} size={spacing.iconSize.medium} />}
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>

        {isSuccess ? (
          <View style={styles.successContainer}>
            <CheckCircle
              color={colors.success[500]}
              size={spacing.iconSize.large * 2}
              style={styles.successIcon}
            />
            <Text
              style={[
                styles.title,
                typography.h3,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              Check Your Email
            </Text>
            <Text
              style={[
                styles.subtitle,
                typography.body1,
                { color: isDark ? colors.gray[600] : colors.gray[600], textAlign: 'center' },
              ]}
            >
              We've sent password reset instructions to your email address.
            </Text>
            <Button
              title="Back to Login"
              variant="primary"
              onPress={() => router.replace('/auth/login')}
              style={styles.loginButton}
            />
          </View>
        ) : (
          <View style={styles.content}>
            <Text
              style={[
                styles.title,
                typography.h3,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              Forgot Password?
            </Text>
            <Text
              style={[
                styles.subtitle,
                typography.body1,
                { color: isDark ? colors.gray[600] : colors.gray[600] },
              ]}
            >
              Enter your email address to receive a password reset link.
            </Text>

            <Formik
              initialValues={{ email: '' }}
              validationSchema={forgotPasswordSchema}
              onSubmit={handleSubmit}
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

                  <Button
                    title="Send Reset Link"
                    onPress={() => handleSubmit()}
                    loading={isLoading}
                    fullWidth
                    style={styles.submitButton}
                  />
                </View>
              )}
            </Formik>
          </View>
        )}
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
    padding: 24,
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  submitButton: {
    marginTop: 8,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successIcon: {
    marginBottom: 24,
  },
  loginButton: {
    marginTop: 32,
    minWidth: 200,
  },
});