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
  Car,
  Clock,
  MapPin,
  Phone,
  Mail,
  Plus,
  Check,
  X,
  LogOut,
  Bell,
  Calendar,
  AlertTriangle,
  Wrench,
} from 'lucide-react-native';
import { Button } from '@/components/ui/Button';

interface VehicleOwnerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'vehicle_owner';
  subscription?: {
    planId: string;
    planName: string;
    price: string;
    startDate: string;
    endDate: string;
  };
  createdAt: string;
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
  mechanicName?: string;
}

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
}

export default function VehicleOwnerDashboard() {
  const { colors, spacing, typography, isDark } = useTheme();
  const [profile, setProfile] = useState<VehicleOwnerProfile | null>(null);
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'notifications' | 'profile'>('overview');

  useEffect(() => {
    console.log('VehicleOwnerDashboard mounted');
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('Loading vehicle owner data...');
      
      // Load vehicle owner profile
      const currentUser = await AsyncStorage.getItem('currentUser');
      console.log('Current user from storage:', currentUser);
      
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        console.log('Parsed user data:', userData);
        setProfile(userData);
        
        // Load repair requests for this user after profile is set
        const storedRequests = await AsyncStorage.getItem('repairRequests');
        if (storedRequests) {
          const allRequests: RepairRequest[] = JSON.parse(storedRequests);
          const userRequests = allRequests.filter(request => request.customerName === userData.name);
          console.log('Filtered requests for user:', userRequests);
          setRepairRequests(userRequests);
        }

        // Load notifications for this user after profile is set
        const storedNotifications = await AsyncStorage.getItem('notifications');
        if (storedNotifications) {
          const allNotifications: Notification[] = JSON.parse(storedNotifications);
          const userNotifications = allNotifications.filter(
            notification => notification.userId === userData.name
          );
          console.log('Filtered notifications for user:', userNotifications);
          setNotifications(userNotifications.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ));
        }
      } else {
        console.log('No current user found in storage');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return colors.warning[500];
      case 'accepted':
        return colors.success[500];
      case 'declined':
        return colors.error[500];
      case 'completed':
        return colors.primary[500];
      default:
        return colors.gray[500];
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

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
          <View style={[styles.statIcon, { backgroundColor: colors.primary[100] }]}>
            <Car color={colors.primary[500]} size={24} />
          </View>
          <Text style={[styles.statNumber, typography.h2, { color: isDark ? colors.white : colors.gray[900] }]}>
            {repairRequests.length}
          </Text>
          <Text style={[styles.statLabel, typography.body2, { color: colors.gray[600] }]}>
            Total Requests
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
            Completed
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
          <View style={[styles.statIcon, { backgroundColor: colors.warning[100] }]}>
            <Bell color={colors.warning[500]} size={24} />
          </View>
          <Text style={[styles.statNumber, typography.h2, { color: isDark ? colors.white : colors.gray[900] }]}>
            {notifications.filter(n => !n.read).length}
          </Text>
          <Text style={[styles.statLabel, typography.body2, { color: colors.gray[600] }]}>
            New Notifications
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
            <Text style={[styles.profileEmail, typography.body2, { color: colors.gray[600] }]}>
              {profile?.email}
            </Text>
            <Text style={[styles.profilePhone, typography.body2, { color: colors.gray[600] }]}>
              {profile?.phone}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.quickActionsCard, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
        <Text style={[styles.sectionTitle, typography.h3, { color: isDark ? colors.white : colors.gray[900] }]}>
          Quick Actions
        </Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: colors.primary[100] }]}
            onPress={() => router.push('/vehicle/request-repair')}
          >
            <Plus size={24} color={colors.primary[500]} />
            <Text style={[styles.quickActionText, typography.body2, { color: colors.primary[600] }]}>
              New Request
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: colors.success[100] }]}
            onPress={() => router.push('/vehicle/find-mechanics')}
          >
            <Wrench size={24} color={colors.success[500]} />
            <Text style={[styles.quickActionText, typography.body2, { color: colors.success[600] }]}>
              Find Mechanics
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.quickActionButton, { backgroundColor: colors.warning[100] }]}
            onPress={() => setActiveTab('notifications')}
          >
            <Bell size={24} color={colors.warning[500]} />
            <Text style={[styles.quickActionText, typography.body2, { color: colors.warning[600] }]}>
              Notifications
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {profile?.subscription && (
        <View style={[styles.subscriptionCard, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
          <View style={styles.subscriptionCardHeader}>
            <Text style={[styles.subscriptionCardTitle, typography.h3, { color: isDark ? colors.white : colors.gray[900] }]}>
              Current Subscription
            </Text>
            <View style={[styles.subscriptionBadge, { backgroundColor: colors.success[100] }]}>
              <Text style={[styles.subscriptionBadgeText, typography.caption, { color: colors.success[600] }]}>
                ACTIVE
              </Text>
            </View>
          </View>
          <Text style={[styles.subscriptionPlanName, typography.h4, { color: colors.primary[500] }]}>
            {profile.subscription.planName} Plan
          </Text>
          <Text style={[styles.subscriptionPrice, typography.body1, { color: colors.gray[600] }]}>
            {profile.subscription.price} per {profile.subscription.planId === 'annual' ? 'year' : 'month'}
          </Text>
          <Text style={[styles.subscriptionExpiry, typography.body2, { color: colors.gray[500] }]}>
            Expires on {new Date(profile.subscription.endDate).toLocaleDateString()}
          </Text>
        </View>
      )}
    </View>
  );

  const renderRequests = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, typography.h3, { color: isDark ? colors.white : colors.gray[900] }]}>
          My Repair Requests
        </Text>
        <TouchableOpacity
            style={[styles.newRequestButton, { backgroundColor: colors.primary[500] }]}
            onPress={() => router.push('/vehicle/request-repair')}
        >
            <Plus size={16} color={colors.white} />
        </TouchableOpacity>
      </View>

      {repairRequests.length === 0 ? (
        <View style={styles.emptyState}>
          <Car size={48} color={colors.gray[400]} />
          <Text style={[styles.emptyText, typography.h3, { color: colors.gray[600] }]}>
            No repair requests yet
          </Text>
          <Text style={[styles.emptySubtext, typography.body2, { color: colors.gray[500] }]}>
            Submit your first repair request to get started
          </Text>
          <TouchableOpacity
            style={[styles.newRequestButton, { backgroundColor: colors.primary[500] }]}
            onPress={() => router.push('/vehicle/request-repair')}
            >
            <Plus size={16} color={colors.white} />
            <Text style={[styles.newRequestText, typography.body2, { color: colors.white }]}>
                New Request
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        repairRequests.map((request) => (
          <View key={request.id} style={[styles.requestCard, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
            <View style={styles.requestHeader}>
              <Text style={[styles.requestTitle, typography.h4, { color: isDark ? colors.white : colors.gray[900] }]}>
                {request.vehicleInfo}
              </Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(request.status) + '20' }
              ]}>
                <Text style={[
                  styles.statusText,
                  typography.caption,
                  { color: getStatusColor(request.status) }
                ]}>
                  {request.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={[styles.requestIssue, typography.body2, { color: colors.gray[600] }]}>
              {request.issue}
            </Text>

            <View style={styles.requestDetails}>
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
              <View style={styles.detailRow}>
                <AlertTriangle size={14} color={colors.gray[500]} />
                <Text style={[styles.detailText, typography.body2, { color: colors.gray[600] }]}>
                  Urgency: {request.urgency}
                </Text>
              </View>
              {request.mechanicName && (
                <View style={styles.detailRow}>
                  <User size={14} color={colors.gray[500]} />
                  <Text style={[styles.detailText, typography.body2, { color: colors.gray[600] }]}>
                    Mechanic: {request.mechanicName}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))
      )}
    </View>
  );

  const renderNotifications = () => (
    <View style={styles.tabContent}>
      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Bell size={48} color={colors.gray[400]} />
          <Text style={[styles.emptyText, typography.h3, { color: colors.gray[600] }]}>
            No notifications yet
          </Text>
          <Text style={[styles.emptySubtext, typography.body2, { color: colors.gray[500] }]}>
            You'll see updates about your repair requests here
          </Text>
        </View>
      ) : (
        notifications.map((notification) => (
          <View key={notification.id} style={[styles.notificationCard, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
            <View style={styles.notificationHeader}>
              <Text style={[styles.notificationTitle, typography.h4, { color: isDark ? colors.white : colors.gray[900] }]}>
                {notification.title}
              </Text>
              <Text style={[styles.notificationTime, typography.caption, { color: colors.gray[500] }]}>
                {new Date(notification.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Text style={[styles.notificationMessage, typography.body2, { color: colors.gray[600] }]}>
              {notification.message}
            </Text>
            {!notification.read && (
              <View style={[styles.unreadDot, { backgroundColor: colors.primary[500] }]} />
            )}
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

        {profile?.subscription && (
          <>
            <View style={styles.profileField}>
              <Text style={[styles.fieldLabel, typography.body2, { color: colors.gray[600] }]}>Subscription Plan</Text>
              <Text style={[styles.fieldValue, typography.body1, { color: isDark ? colors.white : colors.gray[900] }]}>
                {profile.subscription.planName} - {profile.subscription.price}
              </Text>
            </View>

            <View style={styles.profileField}>
              <Text style={[styles.fieldLabel, typography.body2, { color: colors.gray[600] }]}>Subscription Status</Text>
              <View style={styles.subscriptionStatus}>
                <Text style={[styles.fieldValue, typography.body1, { color: isDark ? colors.white : colors.gray[900] }]}>
                  Active until {new Date(profile.subscription.endDate).toLocaleDateString()}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: colors.success[100] }]}>
                  <Text style={[styles.statusText, typography.caption, { color: colors.success[600] }]}>
                    ACTIVE
                  </Text>
                </View>
              </View>
            </View>
          </>
        )}
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
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={24} color={colors.gray[500]} />
            {notifications.filter(n => !n.read).length > 0 && (
              <View style={[styles.notificationBadge, { backgroundColor: colors.error[500] }]}>
                <Text style={[styles.notificationBadgeText, typography.caption, { color: colors.white }]}>
                  {notifications.filter(n => !n.read).length}
                </Text>
              </View>
            )}
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
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'profile' && renderProfile()}
      </ScrollView>

      <View style={[styles.bottomTabBar, { backgroundColor: isDark ? colors.gray[800] : colors.white }]}>
        {[
          { key: 'overview', label: 'Overview', icon: User },
          { key: 'requests', label: 'Requests', icon: Car },
          { key: 'notifications', label: 'Notifications', icon: Bell },
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
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  tabLabel: {
    fontWeight: '600',
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
    alignItems: 'center',
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
  profileEmail: {
    marginBottom: 2,
  },
  profilePhone: {
    marginBottom: 0,
  },
  quickActionsCard: {
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  quickActionText: {
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  newRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  newRequestText: {
    fontWeight: '600',
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
    marginBottom: 24,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontWeight: '600',
  },
  requestIssue: {
    marginBottom: 12,
  },
  requestDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    flex: 1,
  },
  notificationCard: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  notificationTitle: {
    flex: 1,
  },
  notificationTime: {
    color: '#6b7280',
  },
  notificationMessage: {
    lineHeight: 20,
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
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
  subscriptionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subscriptionCard: {
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subscriptionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subscriptionCardTitle: {
    fontWeight: '600',
  },
  subscriptionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  subscriptionBadgeText: {
    fontWeight: '600',
  },
  subscriptionPlanName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  subscriptionPrice: {
    marginBottom: 4,
  },
  subscriptionExpiry: {
    fontStyle: 'italic',
  },
}); 