import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, Crown, ArrowLeft, CreditCard } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '@/components/ui/Button';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
}

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$9.99',
    period: 'month',
    features: [
      'Up to 5 repair requests per month',
      'Basic mechanic search',
      'Email notifications',
      'Standard support'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$19.99',
    period: 'month',
    features: [
      'Unlimited repair requests',
      'Priority mechanic matching',
      'Real-time notifications',
      'Priority support',
      'Emergency roadside assistance'
    ],
    popular: true
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '$199.99',
    period: 'year',
    features: [
      'All Premium features',
      '2 months free',
      'Exclusive discounts',
      'VIP support',
      'Annual vehicle inspection reminder'
    ]
  }
];

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  userType: 'mechanic' | 'vehicle_owner';
  subscription?: {
    planId: string;
    planName: string;
    price: string;
    startDate: string;
    endDate: string;
  };
  createdAt: string;
}

export default function SubscriptionScreen() {
  const { colors, spacing, typography, isDark } = useTheme();
  const [selectedSubscription, setSelectedSubscription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  
  const params = useLocalSearchParams();
  const userData = params.userData ? JSON.parse(params.userData as string) : null;

  const handleBack = () => {
    router.back();
  };

  const handleSubscriptionSelect = (planId: string) => {
    setSelectedSubscription(planId);
  };

  const handleCompleteRegistration = async () => {
    if (!selectedSubscription) {
      Alert.alert('Error', 'Please select a subscription plan to continue');
      return;
    }

    setIsLoading(true);

    try {
      const selectedPlan = subscriptionPlans.find(plan => plan.id === selectedSubscription);
      if (!selectedPlan) {
        throw new Error('Selected plan not found');
      }

      // Create the complete user data with subscription
      const completeUserData: UserData = {
        ...userData,
        subscription: {
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          price: selectedPlan.price,
          startDate: new Date().toISOString(),
          endDate: (() => {
            const endDate = new Date();
            if (selectedPlan.period === 'month') {
              endDate.setMonth(endDate.getMonth() + 1);
            } else if (selectedPlan.period === 'year') {
              endDate.setFullYear(endDate.getFullYear() + 1);
            }
            return endDate.toISOString();
          })(),
        },
      };

      // Save user to storage
      const existingUsers = await AsyncStorage.getItem('users');
      const users: UserData[] = existingUsers ? JSON.parse(existingUsers) : [];
      
      // Check if user already exists
      const existingUser = users.find(user => user.email === completeUserData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
      
      users.push(completeUserData);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      
      // Set current user session
      await AsyncStorage.setItem('userToken', 'fake-auth-token');
      await AsyncStorage.setItem('userRole', completeUserData.userType);
      await AsyncStorage.setItem('currentUser', JSON.stringify(completeUserData));
      
      // Navigate to dashboard
      if (completeUserData.userType === 'mechanic') {
        router.replace('/mechanic/dashboard');
      } else {
        router.replace('/vehicle/dashboard');
      }

    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert('Error', error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.gray[900] : colors.gray[50] }]}>
      <View style={[styles.header, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.gray[500]} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, typography.h2, { color: isDark ? colors.white : colors.gray[900] }]}>
          Choose Your Plan
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeTitle, typography.h1, { color: isDark ? colors.white : colors.gray[900] }]}>
            Welcome, {userData?.name}!
          </Text>
          <Text style={[styles.welcomeSubtitle, typography.body1, { color: colors.gray[600] }]}>
            Choose a subscription plan that best fits your needs
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {subscriptionPlans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                { backgroundColor: isDark ? colors.gray[800] : colors.white },
                selectedSubscription === plan.id && {
                  borderColor: colors.primary[500],
                  borderWidth: 2,
                },
                plan.popular && {
                  borderColor: colors.warning[500],
                  borderWidth: 2,
                }
              ]}
              onPress={() => handleSubscriptionSelect(plan.id)}
            >
              {plan.popular && (
                <View style={[styles.popularBadge, { backgroundColor: colors.warning[500] }]}>
                  <Crown size={12} color={colors.white} />
                  <Text style={[styles.popularText, typography.caption, { color: colors.white }]}>
                    MOST POPULAR
                  </Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <Text style={[styles.planName, typography.h3, { color: isDark ? colors.white : colors.gray[900] }]}>
                  {plan.name}
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={[styles.price, typography.h1, { color: colors.primary[500] }]}>
                    {plan.price}
                  </Text>
                  <Text style={[styles.period, typography.body1, { color: colors.gray[600] }]}>
                    /{plan.period}
                  </Text>
                </View>
              </View>

              <View style={styles.featuresList}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Check size={18} color={colors.success[500]} />
                    <Text style={[styles.featureText, typography.body1, { color: colors.gray[600] }]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>

              {selectedSubscription === plan.id && (
                <View style={[styles.selectedIndicator, { backgroundColor: colors.primary[500] }]}>
                  <Check size={18} color={colors.white} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoSection}>
          <Text style={[styles.infoTitle, typography.h4, { color: isDark ? colors.white : colors.gray[900] }]}>
            What's included in all plans:
          </Text>
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Check size={16} color={colors.success[500]} />
              <Text style={[styles.infoText, typography.body2, { color: colors.gray[600] }]}>
                Access to verified mechanics
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Check size={16} color={colors.success[500]} />
              <Text style={[styles.infoText, typography.body2, { color: colors.gray[600] }]}>
                Secure payment processing
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Check size={16} color={colors.success[500]} />
              <Text style={[styles.infoText, typography.body2, { color: colors.gray[600] }]}>
                Customer support
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
        <Button
          title="Complete Registration"
          onPress={handleCompleteRegistration}
          loading={isLoading}
          disabled={!selectedSubscription}
          fullWidth
          style={{
            ...styles.completeButton,
            backgroundColor: selectedSubscription ? colors.primary[500] : colors.gray[300]
          }}
          textStyle={{ color: colors.white }}
          leftIcon={<CreditCard color={colors.white} size={20} />}
        />
        <Text style={[styles.termsText, typography.caption, { color: colors.gray[500] }]}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  welcomeTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    textAlign: 'center',
    maxWidth: 300,
  },
  plansContainer: {
    gap: 16,
    marginBottom: 32,
  },
  planCard: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  planName: {
    fontWeight: '600',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontWeight: '700',
  },
  period: {
    marginLeft: 4,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    marginLeft: 12,
    flex: 1,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  popularText: {
    fontWeight: '600',
    fontSize: 10,
  },
  infoSection: {
    marginBottom: 32,
  },
  infoTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  infoList: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 12,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  completeButton: {
    marginBottom: 12,
  },
  termsText: {
    textAlign: 'center',
    lineHeight: 16,
  },
}); 