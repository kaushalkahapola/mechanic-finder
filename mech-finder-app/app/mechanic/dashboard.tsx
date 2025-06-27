import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  Settings,
  Star,
  Wrench,
  Clock,
  MapPin,
  Phone,
  Mail,
  Edit,
  Plus,
  Check,
  X,
  LogOut,
  Bell,
  Calendar,
  DollarSign,
} from 'lucide-react-native';
import { Button } from '@/components/ui/Button';

interface MechanicProfile {
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
  price?: string;
  selectedMechanic?: string;
  mechanicName?: string;
}

interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export default function MechanicDashboard() {
  const { colors, spacing, typography, isDark } = useTheme();
  const [profile, setProfile] = useState<MechanicProfile | null>(null);
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'reviews' | 'profile'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load mechanic profile
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        const mechanicProfile: MechanicProfile = {
          ...userData,
          location: userData.location || 'New York, NY',
          experience: userData.experience || '5 years',
          hourlyRate: userData.hourlyRate || '$50/hour',
          skills: userData.skills || ['Engine Repair', 'Brake System', 'Electrical'],
          certifications: userData.certifications || ['ASE Certified', 'BMW Certified'],
          rating: userData.rating || 4.5,
          totalReviews: userData.totalReviews || 12,
          isAvailable: userData.isAvailable !== false,
        };
        setProfile(mechanicProfile);

        // Load repair requests for this mechanic
        const storedRequests = await AsyncStorage.getItem('repairRequests');
        if (storedRequests) {
          const allRequests = JSON.parse(storedRequests);
          // Filter requests assigned to this mechanic
          const mechanicRequests = allRequests.filter((request: RepairRequest) => 
            request.selectedMechanic === mechanicProfile.id
          );
          setRepairRequests(mechanicRequests);
        }
      }

      // Load reviews
      const storedReviews = await AsyncStorage.getItem('mechanicReviews');
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['userToken', 'userRole', 'currentUser']);
            router.push('/auth/signin');
          },
        },
      ]
    );
  };

  const handleRequestAction = async (requestId: string, action: 'accept' | 'decline') => {
    try {
      const updatedRequests = repairRequests.map(request => {
        if (request.id === requestId) {
          return {
            ...request,
            status: action === 'accept' ? 'accepted' : 'declined' as 'pending' | 'accepted' | 'declined' | 'completed',
          };
        }
        return request;
      });

      setRepairRequests(updatedRequests);
      await AsyncStorage.setItem('repairRequests', JSON.stringify(updatedRequests));

      // Create notification for customer
      const request = repairRequests.find(r => r.id === requestId);
      if (request) {
        const notifications = await AsyncStorage.getItem('notifications') || '[]';
        const existingNotifications = JSON.parse(notifications);
        const newNotification = {
          id: Date.now().toString(),
          userId: request.customerName, // In real app, this would be customer ID
          title: `Request ${action === 'accept' ? 'Accepted' : 'Declined'}`,
          message: `Your repair request for ${request.vehicleInfo} has been ${action === 'accept' ? 'accepted' : 'declined'} by ${profile?.name}`,
          type: action === 'accept' ? 'success' : 'info',
          createdAt: new Date().toISOString(),
          read: false,
        };
        
        existingNotifications.push(newNotification);
        await AsyncStorage.setItem('notifications', JSON.stringify(existingNotifications));
      }

      Alert.alert(
        'Success',
        `Request ${action === 'accept' ? 'accepted' : 'declined'} successfully`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update request status');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        fill={index < Math.floor(rating) ? colors.warning[400] : 'transparent'}
        color={index < Math.floor(rating) ? colors.warning[400] : colors.gray[300]}
      />
    ));
  };

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
          <View style={[styles.statIcon, { backgroundColor: colors.primary[100] }]}>
            <Clock color={colors.primary[500]} size={24} />
          </View>
          <Text style={[styles.statNumber, typography.h2, { color: isDark ? colors.white : colors.gray[900] }]}>
            {repairRequests.filter(r => r.status === 'pending').length}
          </Text>
          <Text style={[styles.statLabel, typography.body2, { color: colors.gray[600] }]}>
            Pending Requests
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
          <View style={[styles.statIcon, { backgroundColor: colors.success[100] }]}>
            <Check color={colors.success[500]} size={24} />
          </View>
          <Text style={[styles.statNumber, typography.h2, { color: isDark ? colors.white : colors.gray[900] }]}>
            {repairRequests.filter(r => r.status === 'completed').length}
          </Text>
          <Text style={[styles.statLabel, typography.body2, { color: colors.gray[600] }]}>
            Completed Jobs
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
          <View style={[styles.statIcon, { backgroundColor: colors.warning[100] }]}>
            <Star color={colors.warning[500]} size={24} />
          </View>
          <Text style={[styles.statNumber, typography.h2, { color: isDark ? colors.white : colors.gray[900] }]}>
            {profile?.rating || 0}
          </Text>
          <Text style={[styles.statLabel, typography.body2, { color: colors.gray[600] }]}>
            Average Rating
          </Text>
        </View>
      </View>

      <View style={[styles.profileCard, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, typography.h3, { color: isDark ? colors.white : colors.gray[900] }]}>
              {profile?.name}
            </Text>
            <Text style={[styles.profileLocation, typography.body2, { color: colors.gray[600] }]}>
              <MapPin size={16} color={colors.gray[500]} /> {profile?.location}
            </Text>
            <View style={styles.ratingContainer}>
              {renderStars(profile?.rating || 0)}
              <Text style={[styles.ratingText, typography.body2, { color: colors.gray[600] }]}>
                ({profile?.totalReviews} reviews)
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.profileDetails}>
          <View style={styles.detailRow}>
            <Clock size={16} color={colors.gray[500]} />
            <Text style={[styles.detailText, typography.body2, { color: colors.gray[600] }]}>
              Experience: {profile?.experience}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <DollarSign size={16} color={colors.gray[500]} />
            <Text style={[styles.detailText, typography.body2, { color: colors.gray[600] }]}>
              Rate: {profile?.hourlyRate}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Wrench size={16} color={colors.gray[500]} />
            <Text style={[styles.detailText, typography.body2, { color: colors.gray[600] }]}>
              Available: {profile?.isAvailable ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderRequests = () => (
    <View style={styles.tabContent}>
      {repairRequests.length === 0 ? (
        <View style={styles.emptyState}>
          <Clock size={48} color={colors.gray[400]} />
          <Text style={[styles.emptyText, typography.h3, { color: colors.gray[600] }]}>
            No repair requests yet
          </Text>
          <Text style={[styles.emptySubtext, typography.body2, { color: colors.gray[500] }]}>
            New requests will appear here
          </Text>
        </View>
      ) : (
        repairRequests.map((request) => (
          <View key={request.id} style={[styles.requestCard, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
            <View style={styles.requestHeader}>
              <Text style={[styles.requestTitle, typography.h4, { color: isDark ? colors.white : colors.gray[900] }]}>
                {request.vehicleInfo}
              </Text>
              <View style={[
                styles.urgencyBadge,
                {
                  backgroundColor: request.urgency === 'high' ? colors.error[100] : 
                                   request.urgency === 'medium' ? colors.warning[100] : colors.success[100]
                }
              ]}>
                <Text style={[
                  styles.urgencyText,
                  typography.caption,
                  {
                    color: request.urgency === 'high' ? colors.error[600] : 
                           request.urgency === 'medium' ? colors.warning[600] : colors.success[600]
                  }
                ]}>
                  {request.urgency.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={[styles.requestIssue, typography.body2, { color: colors.gray[600] }]}>
              {request.issue}
            </Text>

            <View style={styles.requestDetails}>
              <View style={styles.detailRow}>
                <User size={14} color={colors.gray[500]} />
                <Text style={[styles.detailText, typography.body2, { color: colors.gray[600] }]}>
                  {request.customerName}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <MapPin size={14} color={colors.gray[500]} />
                <Text style={[styles.detailText, typography.body2, { color: colors.gray[600] }]}>
                  {request.location}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Calendar size={14} color={colors.gray[500]} />
                <Text style={[styles.detailText, typography.body2, { color: colors.gray[600] }]}>
                  {new Date(request.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>

            {request.status === 'pending' && (
              <View style={styles.requestActions}>
                <Button
                  title="Accept"
                  onPress={() => handleRequestAction(request.id, 'accept')}
                  style={{ ...styles.actionButton, backgroundColor: colors.success[500] }}
                  textStyle={{ color: colors.white }}
                />
                <Button
                  title="Decline"
                  onPress={() => handleRequestAction(request.id, 'decline')}
                  style={{ ...styles.actionButton, backgroundColor: colors.error[500] }}
                  textStyle={{ color: colors.white }}
                />
              </View>
            )}

            {request.status !== 'pending' && (
              <View style={[
                styles.statusBadge,
                {
                  backgroundColor: request.status === 'accepted' ? colors.success[100] : 
                                   request.status === 'declined' ? colors.error[100] : colors.primary[100]
                }
              ]}>
                <Text style={[
                  styles.statusText,
                  typography.caption,
                  {
                    color: request.status === 'accepted' ? colors.success[600] : 
                           request.status === 'declined' ? colors.error[600] : colors.primary[600]
                  }
                ]}>
                  {request.status.toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );

  const renderReviews = () => (
    <View style={styles.tabContent}>
      {reviews.length === 0 ? (
        <View style={styles.emptyState}>
          <Star size={48} color={colors.gray[400]} />
          <Text style={[styles.emptyText, typography.h3, { color: colors.gray[600] }]}>
            No reviews yet
          </Text>
          <Text style={[styles.emptySubtext, typography.body2, { color: colors.gray[500] }]}>
            Customer reviews will appear here
          </Text>
        </View>
      ) : (
        reviews.map((review) => (
          <View key={review.id} style={[styles.reviewCard, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
            <View style={styles.reviewHeader}>
              <Text style={[styles.reviewerName, typography.h4, { color: isDark ? colors.white : colors.gray[900] }]}>
                {review.customerName}
              </Text>
              <Text style={[styles.reviewDate, typography.caption, { color: colors.gray[500] }]}>
                {new Date(review.date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              {renderStars(review.rating)}
            </View>
            <Text style={[styles.reviewComment, typography.body2, { color: colors.gray[600] }]}>
              {review.comment}
            </Text>
          </View>
        ))
      )}
    </View>
  );

  const renderProfile = () => (
    <View style={styles.tabContent}>
      <View style={[styles.profileSection, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, typography.h3, { color: isDark ? colors.white : colors.gray[900] }]}>
            Personal Information
          </Text>
          <TouchableOpacity style={styles.editButton}>
            <Edit size={16} color={colors.primary[500]} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileField}>
          <Text style={[styles.fieldLabel, typography.body2, { color: colors.gray[600] }]}>Name</Text>
          <Text style={[styles.fieldValue, typography.body1, { color: isDark ? colors.white : colors.gray[900] }]}>
            {profile?.name}
          </Text>
        </View>

        <View style={styles.profileField}>
          <Text style={[styles.fieldLabel, typography.body2, { color: colors.gray[600] }]}>Email</Text>
          <Text style={[styles.fieldValue, typography.body1, { color: isDark ? colors.white : colors.gray[900] }]}>
            {profile?.email}
          </Text>
        </View>

        <View style={styles.profileField}>
          <Text style={[styles.fieldLabel, typography.body2, { color: colors.gray[600] }]}>Phone</Text>
          <Text style={[styles.fieldValue, typography.body1, { color: isDark ? colors.white : colors.gray[900] }]}>
            {profile?.phone}
          </Text>
        </View>

        <View style={styles.profileField}>
          <Text style={[styles.fieldLabel, typography.body2, { color: colors.gray[600] }]}>Location</Text>
          <Text style={[styles.fieldValue, typography.body1, { color: isDark ? colors.white : colors.gray[900] }]}>
            {profile?.location}
          </Text>
        </View>
      </View>

      <View style={[styles.profileSection, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, typography.h3, { color: isDark ? colors.white : colors.gray[900] }]}>
            Skills & Certifications
          </Text>
          <TouchableOpacity style={styles.editButton}>
            <Plus size={16} color={colors.primary[500]} />
          </TouchableOpacity>
        </View>

        <View style={styles.skillsContainer}>
          {profile?.skills.map((skill, index) => (
            <View key={index} style={[styles.skillTag, { backgroundColor: colors.primary[100] }]}>
              <Text style={[styles.skillText, typography.caption, { color: colors.primary[600] }]}>
                {skill}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.certificationsContainer}>
          {profile?.certifications.map((cert, index) => (
            <View key={index} style={[styles.certificationTag, { backgroundColor: colors.success[100] }]}>
              <Text style={[styles.certificationText, typography.caption, { color: colors.success[600] }]}>
                {cert}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Button
        title="Logout"
        onPress={handleLogout}
        style={{ ...styles.logoutButton, backgroundColor: colors.error[500] }}
        textStyle={{ color: colors.white }}
        leftIcon={<LogOut color={colors.white} size={20} />}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? colors.gray[900] : colors.gray[50] }]}>
      <View style={[styles.header, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, typography.h2, { color: isDark ? colors.white : colors.gray[900] }]}>
            Dashboard
          </Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color={colors.gray[500]} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'requests' && renderRequests()}
        {activeTab === 'reviews' && renderReviews()}
        {activeTab === 'profile' && renderProfile()}
      </ScrollView>

      <View style={[styles.bottomTabBar, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
        {[
          { key: 'overview', label: 'Overview', icon: User },
          { key: 'requests', label: 'Requests', icon: Clock },
          { key: 'reviews', label: 'Reviews', icon: Star },
          { key: 'profile', label: 'Profile', icon: Settings },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.bottomTabButton,
              activeTab === tab.key && { backgroundColor: colors.primary[100] }
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <tab.icon
              size={24}
              color={activeTab === tab.key ? colors.primary[500] : colors.gray[500]}
            />
            <Text
              style={[
                styles.bottomTabLabel,
                typography.caption,
                { color: activeTab === tab.key ? colors.primary[500] : colors.gray[500] }
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '600',
  },
  notificationButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 80,
  },
  tabContent: {
    gap: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    textAlign: 'center',
  },
  profileCard: {
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    marginBottom: 4,
  },
  profileLocation: {
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    marginLeft: 4,
  },
  profileDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
  },
  requestCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requestTitle: {
    flex: 1,
  },
  urgencyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    fontWeight: '600',
  },
  requestIssue: {
    marginBottom: 12,
  },
  requestDetails: {
    gap: 6,
    marginBottom: 12,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontWeight: '600',
  },
  reviewCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    flex: 1,
  },
  reviewDate: {
    color: '#6b7280',
  },
  reviewComment: {
    marginTop: 8,
  },
  profileSection: {
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: '600',
  },
  editButton: {
    padding: 8,
  },
  profileField: {
    marginBottom: 16,
  },
  fieldLabel: {
    marginBottom: 4,
    fontWeight: '500',
  },
  fieldValue: {
    fontWeight: '400',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  skillTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontWeight: '600',
  },
  certificationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  certificationTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  certificationText: {
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bottomTabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
  },
  bottomTabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  bottomTabLabel: {
    fontWeight: '600',
    fontSize: 12,
  },
}); 