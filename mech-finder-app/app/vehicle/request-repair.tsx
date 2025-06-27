import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { router } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Car,
  Wrench,
  MapPin,
  AlertTriangle,
  Clock,
  User,
  Phone,
  ArrowLeft,
  Star,
  Check,
} from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const requestSchema = Yup.object().shape({
  vehicleInfo: Yup.string().required('Vehicle information is required'),
  issue: Yup.string().required('Issue description is required'),
  location: Yup.string().required('Location is required'),
  urgency: Yup.string().oneOf(['low', 'medium', 'high']).required('Urgency level is required'),
  selectedMechanic: Yup.string().required('Please select a mechanic'),
  additionalNotes: Yup.string(),
});

interface Mechanic {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'mechanic';
  location: string;
  experience: string;
  hourlyRate: string;
  skills: string[];
  certifications: string[];
  rating: number;
  totalReviews: number;
  isAvailable: boolean;
}

interface RepairRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  vehicleInfo: string;
  issue: string;
  location: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
  additionalNotes?: string;
  selectedMechanic?: string;
  mechanicName?: string;
}

export default function RequestRepairScreen() {
  const { colors, spacing, typography, isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [availableMechanics, setAvailableMechanics] = useState<Mechanic[]>([]);

  useEffect(() => {
    loadCurrentUser();
    loadAvailableMechanics();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('currentUser');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadAvailableMechanics = async () => {
    try {
      const usersData = await AsyncStorage.getItem('users');
      if (usersData) {
        const users = JSON.parse(usersData);
        const mechanics = users.filter((user: any) => 
          user.userType === 'mechanic' && user.isAvailable !== false
        );
        setAvailableMechanics(mechanics);
      }
    } catch (error) {
      console.error('Error loading mechanics:', error);
    }
  };

  const handleSubmitRequest = async (values: {
    vehicleInfo: string;
    issue: string;
    location: string;
    urgency: 'low' | 'medium' | 'high';
    selectedMechanic: string;
    additionalNotes?: string;
  }) => {
    setIsLoading(true);

    try {
      const selectedMechanic = availableMechanics.find(m => m.id === values.selectedMechanic);
      
      const newRequest: RepairRequest = {
        id: Date.now().toString(),
        customerName: currentUser?.name || 'Unknown',
        customerPhone: currentUser?.phone || '',
        vehicleInfo: values.vehicleInfo,
        issue: values.issue,
        location: values.location,
        urgency: values.urgency,
        status: 'pending',
        createdAt: new Date().toISOString(),
        additionalNotes: values.additionalNotes,
        selectedMechanic: values.selectedMechanic,
        mechanicName: selectedMechanic?.name || 'Unknown',
      };

      // Get existing requests
      const existingRequests = await AsyncStorage.getItem('repairRequests');
      const requests: RepairRequest[] = existingRequests ? JSON.parse(existingRequests) : [];
      
      // Add new request
      requests.push(newRequest);
      await AsyncStorage.setItem('repairRequests', JSON.stringify(requests));

      Alert.alert(
        'Success',
        `Your repair request has been submitted successfully! ${selectedMechanic?.name} will be notified and you will receive updates.`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return colors.error[500];
      case 'medium':
        return colors.warning[500];
      case 'low':
        return colors.success[500];
      default:
        return colors.gray[500];
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <AlertTriangle size={20} color={colors.error[500]} />;
      case 'medium':
        return <Clock size={20} color={colors.warning[500]} />;
      case 'low':
        return <Clock size={20} color={colors.success[500]} />;
      default:
        return <Clock size={20} color={colors.gray[500]} />;
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: isDark ? colors.gray[50] : colors.white }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.header, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={colors.gray[500]} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, typography.h2, { color: isDark ? colors.white : colors.gray[900] }]}>
            Request Repair
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.infoCard, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
            <View style={styles.infoHeader}>
              <User size={20} color={colors.primary[500]} />
              <Text style={[styles.infoTitle, typography.h3, { color: isDark ? colors.white : colors.gray[900] }]}>
                Customer Information
              </Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoText, typography.body2, { color: colors.gray[600] }]}>
                Name: {currentUser?.name || 'Not available'}
              </Text>
              <Text style={[styles.infoText, typography.body2, { color: colors.gray[600] }]}>
                Phone: {currentUser?.phone || 'Not available'}
              </Text>
            </View>
          </View>

          <Formik
            initialValues={{
              vehicleInfo: '',
              issue: '',
              location: '',
              urgency: 'medium' as 'low' | 'medium' | 'high',
              selectedMechanic: '',
              additionalNotes: '',
            }}
            validationSchema={requestSchema}
            onSubmit={handleSubmitRequest}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.form}>
                <Input
                  label="Vehicle Information"
                  placeholder="e.g., 2020 Toyota Camry, Engine making strange noise"
                  value={values.vehicleInfo}
                  onChangeText={handleChange('vehicleInfo')}
                  onBlur={handleBlur('vehicleInfo')}
                  error={touched.vehicleInfo && errors.vehicleInfo ? errors.vehicleInfo : undefined}
                  leftIcon={<Car color={colors.gray[500]} size={spacing.iconSize.medium} />}
                  multiline
                  numberOfLines={3}
                />

                <Input
                  label="Issue Description"
                  placeholder="Describe the problem in detail..."
                  value={values.issue}
                  onChangeText={handleChange('issue')}
                  onBlur={handleBlur('issue')}
                  error={touched.issue && errors.issue ? errors.issue : undefined}
                  leftIcon={<Wrench color={colors.gray[500]} size={spacing.iconSize.medium} />}
                  multiline
                  numberOfLines={4}
                />

                <Input
                  label="Location"
                  placeholder="Where is your vehicle located?"
                  value={values.location}
                  onChangeText={handleChange('location')}
                  onBlur={handleBlur('location')}
                  error={touched.location && errors.location ? errors.location : undefined}
                  leftIcon={<MapPin color={colors.gray[500]} size={spacing.iconSize.medium} />}
                />

                <View style={styles.mechanicSection}>
                  <Text style={[styles.mechanicLabel, typography.body2, { color: colors.gray[600] }]}>
                    Select Mechanic
                  </Text>
                  {availableMechanics.length === 0 ? (
                    <View style={[styles.noMechanicsCard, { backgroundColor: colors.warning[50] }]}>
                      <Text style={[styles.noMechanicsText, typography.body2, { color: colors.warning[700] }]}>
                        No mechanics available at the moment. Please try again later.
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.mechanicButtons}>
                      {availableMechanics.map((mechanic) => (
                        <TouchableOpacity
                          key={mechanic.id}
                          style={[
                            styles.mechanicButton,
                            {
                              borderColor: values.selectedMechanic === mechanic.id ? colors.primary[500] : colors.gray[300],
                              backgroundColor: values.selectedMechanic === mechanic.id ? colors.primary[50] : 'transparent',
                            },
                          ]}
                          onPress={() => setFieldValue('selectedMechanic', mechanic.id)}
                        >
                          <View style={styles.mechanicButtonContent}>
                            <View style={styles.mechanicAvatar}>
                              <Text style={[styles.mechanicInitial, typography.h4, { color: colors.primary[500] }]}>
                                {mechanic.name.charAt(0)}
                              </Text>
                            </View>
                            <View style={styles.mechanicButtonText}>
                              <Text
                                style={[
                                  styles.mechanicButtonLabel,
                                  typography.body1,
                                  {
                                    color: values.selectedMechanic === mechanic.id ? colors.primary[600] : colors.gray[700],
                                    fontWeight: '600',
                                  },
                                ]}
                              >
                                {mechanic.name}
                              </Text>
                              <View style={styles.mechanicDetails}>
                                <View style={styles.mechanicDetailRow}>
                                  <Star size={14} color={colors.warning[500]} />
                                  <Text style={[styles.mechanicDetailText, typography.caption, { color: colors.gray[600] }]}>
                                    {mechanic.rating} ({mechanic.totalReviews} reviews)
                                  </Text>
                                </View>
                                <View style={styles.mechanicDetailRow}>
                                  <MapPin size={14} color={colors.gray[500]} />
                                  <Text style={[styles.mechanicDetailText, typography.caption, { color: colors.gray[600] }]}>
                                    {mechanic.location}
                                  </Text>
                                </View>
                                <View style={styles.mechanicDetailRow}>
                                  <Clock size={14} color={colors.gray[500]} />
                                  <Text style={[styles.mechanicDetailText, typography.caption, { color: colors.gray[600] }]}>
                                    {mechanic.experience} • {mechanic.hourlyRate}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            {values.selectedMechanic === mechanic.id && (
                              <View style={[styles.selectedIndicator, { backgroundColor: colors.primary[500] }]}>
                                <Check size={16} color={colors.white} />
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  {touched.selectedMechanic && errors.selectedMechanic && (
                    <Text style={[styles.errorText, typography.caption, { color: colors.error[500] }]}>
                      {errors.selectedMechanic}
                    </Text>
                  )}
                </View>

                <View style={styles.urgencySection}>
                  <Text style={[styles.urgencyLabel, typography.body2, { color: colors.gray[600] }]}>
                    Urgency Level
                  </Text>
                  <View style={styles.urgencyButtons}>
                    {[
                      { key: 'low', label: 'Low', description: 'Can wait a few days' },
                      { key: 'medium', label: 'Medium', description: 'Need within 24-48 hours' },
                      { key: 'high', label: 'High', description: 'Emergency - need immediately' },
                    ].map((urgency) => (
                      <TouchableOpacity
                        key={urgency.key}
                        style={[
                          styles.urgencyButton,
                          {
                            borderColor: values.urgency === urgency.key ? getUrgencyColor(urgency.key) : colors.gray[300],
                            backgroundColor: values.urgency === urgency.key ? getUrgencyColor(urgency.key) + '20' : 'transparent',
                          },
                        ]}
                        onPress={() => setFieldValue('urgency', urgency.key)}
                      >
                        <View style={styles.urgencyButtonContent}>
                          {getUrgencyIcon(urgency.key)}
                          <View style={styles.urgencyButtonText}>
                            <Text
                              style={[
                                styles.urgencyButtonLabel,
                                typography.body2,
                                {
                                  color: values.urgency === urgency.key ? getUrgencyColor(urgency.key) : colors.gray[600],
                                  fontWeight: '600',
                                },
                              ]}
                            >
                              {urgency.label}
                            </Text>
                            <Text
                              style={[
                                styles.urgencyButtonDescription,
                                typography.caption,
                                {
                                  color: values.urgency === urgency.key ? getUrgencyColor(urgency.key) : colors.gray[500],
                                },
                              ]}
                            >
                              {urgency.description}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <Input
                  label="Additional Notes (Optional)"
                  placeholder="Any additional information that might help the mechanic..."
                  value={values.additionalNotes}
                  onChangeText={handleChange('additionalNotes')}
                  onBlur={handleBlur('additionalNotes')}
                  multiline
                  numberOfLines={3}
                />

                <Button
                  title="Submit Request"
                  onPress={() => handleSubmit()}
                  loading={isLoading}
                  fullWidth
                  style={styles.submitButton}
                />
              </View>
            )}
          </Formik>
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
    paddingVertical: 16,
  },
  infoCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoTitle: {
    fontWeight: '600',
  },
  infoContent: {
    gap: 4,
  },
  infoText: {
    fontWeight: '500',
  },
  form: {
    gap: 20,
  },
  mechanicSection: {
    gap: 12,
  },
  mechanicLabel: {
    fontWeight: '600',
  },
  mechanicButtons: {
    gap: 8,
  },
  mechanicButton: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
  },
  mechanicButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mechanicButtonText: {
    flex: 1,
  },
  mechanicButtonLabel: {
    marginBottom: 2,
  },
  mechanicAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mechanicInitial: {
    fontSize: 20,
    fontWeight: '600',
  },
  mechanicDetails: {
    gap: 8,
  },
  mechanicDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mechanicDetailText: {
    fontWeight: '500',
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMechanicsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noMechanicsText: {
    fontWeight: '500',
  },
  urgencySection: {
    gap: 12,
  },
  urgencyLabel: {
    fontWeight: '600',
  },
  urgencyButtons: {
    gap: 8,
  },
  urgencyButton: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
  },
  urgencyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  urgencyButtonText: {
    flex: 1,
  },
  urgencyButtonLabel: {
    marginBottom: 2,
  },
  urgencyButtonDescription: {
    lineHeight: 16,
  },
  submitButton: {
    marginTop: 8,
  },
  errorText: {
    marginTop: 8,
  },
}); 