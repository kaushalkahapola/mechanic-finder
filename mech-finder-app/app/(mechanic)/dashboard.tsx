import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { bookingsData, Booking } from '../../mock/bookingsData';
import {
  Calendar,
  Clock,
  Wrench,
  Car,
  Star,
  CheckCircle,
  XCircle,
  Clock as PendingIcon,
  ChevronRight,
  Settings,
  Bell,
  HelpCircle,
  FileText,
} from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { router } from 'expo-router';
import { useData } from '@/context/DataContext';
import { Mechanic } from '@/mock/mechanicsData';

export default function MechanicDashboard() {
  const { user } = useAuth();
  const { mechanics, getMechanicById } = useData();
  const [mechanic, setMechanic] = useState<Mechanic | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { colors, spacing, typography, isDark } = useTheme();

  useEffect(() => {
    if (user && user.id) {
      const mechanicProfile = getMechanicById(user.id);
      if (mechanicProfile) {
        setMechanic(mechanicProfile);
        const mechanicBookings = bookingsData.filter(
          (booking) => booking.mechanicId === user.id
        );
        setBookings(mechanicBookings);
      }
    }
  }, [user, getMechanicById]);

  if (!mechanic) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle color={colors.success[500]} size={20} />;
      case 'cancelled':
        return <XCircle color={colors.error[500]} size={20} />;
      default:
        return <PendingIcon color={colors.warning[500]} size={20} />;
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? colors.gray[50] : colors.gray[50] },
      ]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View
          style={[
            styles.profileSection,
            { backgroundColor: isDark ? colors.gray[100] : colors.white },
          ]}
        >
          <Image
            source={{
              uri:
                mechanic.profileImage ||
                'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
            }}
            style={styles.profileImage}
          />
          <Text
            style={[
              styles.name,
              typography.h3,
              { color: isDark ? colors.white : colors.gray[900] },
            ]}
          >
            {mechanic.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Star
              color={colors.warning[500]}
              size={16}
              fill={colors.warning[500]}
            />
            <Text
              style={[
                styles.ratingText,
                typography.body1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              {mechanic.rating} (12 reviews)
            </Text>
          </View>
          <View style={styles.availabilityContainer}>
            <View
              style={[
                styles.availabilityDot,
                {
                  backgroundColor: mechanic.availability
                    ? colors.success[500]
                    : colors.error[500],
                },
              ]}
            />
            <Text
              style={[
                styles.availabilityText,
                typography.body2,
                { color: isDark ? colors.gray[400] : colors.gray[600] },
              ]}
            >
              {mechanic.availability
                ? 'Available now'
                : 'Currently unavailable'}
            </Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View
          style={[
            styles.statsContainer,
            { backgroundColor: isDark ? colors.gray[100] : colors.white },
          ]}
        >
          <View style={styles.statItem}>
            <Text
              style={[
                styles.statValue,
                typography.h4,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              {bookings.filter((b) => b.status === 'completed').length}
            </Text>
            <Text
              style={[
                styles.statLabel,
                typography.body2,
                { color: isDark ? colors.gray[400] : colors.gray[600] },
              ]}
            >
              Completed
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text
              style={[
                styles.statValue,
                typography.h4,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              {bookings.filter((b) => b.status === 'in_progress').length}
            </Text>
            <Text
              style={[
                styles.statLabel,
                typography.body2,
                { color: isDark ? colors.gray[400] : colors.gray[600] },
              ]}
            >
              Pending
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text
              style={[
                styles.statValue,
                typography.h4,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              {mechanic.services.length}
            </Text>
            <Text
              style={[
                styles.statLabel,
                typography.body2,
                { color: isDark ? colors.gray[400] : colors.gray[600] },
              ]}
            >
              Services
            </Text>
          </View>
        </View>

        {/* Services Section */}
        <View
          style={[
            styles.section,
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
            My Services
          </Text>
          <View style={styles.servicesContainer}>
            {mechanic.services.map(
              (
                service:
                  | string
                  | number
                  | bigint
                  | boolean
                  | React.ReactElement<
                      unknown,
                      string | React.JSXElementConstructor<any>
                    >
                  | Iterable<React.ReactNode>
                  | React.ReactPortal
                  | Promise<
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactPortal
                      | React.ReactElement<
                          unknown,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | null
                      | undefined
                    >
                  | null
                  | undefined,
                index: React.Key | null | undefined
              ) => (
                <View
                  key={index}
                  style={[
                    styles.servicePill,
                    { backgroundColor: colors.primary[100] },
                  ]}
                >
                  <Wrench color={colors.primary[500]} size={16} />
                  <Text
                    style={[
                      styles.serviceText,
                      typography.body2,
                      { color: colors.primary[600] },
                    ]}
                  >
                    {service}
                  </Text>
                </View>
              )
            )}
          </View>
        </View>

        {/* Bookings Section */}
        <View
          style={[
            styles.section,
            { backgroundColor: isDark ? colors.gray[100] : colors.white },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                typography.subtitle1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              Upcoming Bookings
            </Text>
            <TouchableOpacity>
              <Text
                style={[
                  styles.seeAllText,
                  typography.body2,
                  { color: colors.primary[500] },
                ]}
              >
                See all
              </Text>
            </TouchableOpacity>
          </View>

          {bookings.length === 0 ? (
            <View style={styles.emptyBookings}>
              <Text
                style={[
                  typography.body1,
                  { color: isDark ? colors.gray[400] : colors.gray[600] },
                ]}
              >
                No upcoming bookings
              </Text>
            </View>
          ) : (
            bookings.slice(0, 3).map((booking) => (
              <TouchableOpacity
                key={booking.id}
                style={styles.bookingCard}
                onPress={() =>
                  router.push({
                    pathname: '/(mechanic)/booking/[id]',
                    params: { id: booking.id },
                  })
                }
              >
                <View style={styles.bookingHeader}>
                  <Car color={colors.primary[500]} size={20} />
                  <Text
                    style={[
                      styles.bookingService,
                      typography.body1,
                      { color: isDark ? colors.white : colors.gray[900] },
                    ]}
                  >
                    {booking.service}
                  </Text>
                  {getStatusIcon(booking.status)}
                </View>
                <View style={styles.bookingDetails}>
                  <View style={styles.bookingDetailRow}>
                    <Calendar color={colors.gray[500]} size={16} />
                    <Text
                      style={[
                        styles.bookingDetailText,
                        typography.body2,
                        { color: isDark ? colors.gray[400] : colors.gray[600] },
                      ]}
                    >
                      {booking.date}
                    </Text>
                  </View>
                  <View style={styles.bookingDetailRow}>
                    <Clock color={colors.gray[500]} size={16} />
                    <Text
                      style={[
                        styles.bookingDetailText,
                        typography.body2,
                        { color: isDark ? colors.gray[400] : colors.gray[600] },
                      ]}
                    >
                      {booking.time}
                    </Text>
                  </View>
                </View>
                <View style={styles.bookingFooter}>
                  <Text
                    style={[
                      styles.bookingCustomer,
                      typography.body2,
                      { color: isDark ? colors.gray[400] : colors.gray[600] },
                    ]}
                  >
                    Customer: {booking.price}
                  </Text>
                  <ChevronRight color={colors.gray[500]} size={16} />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Quick Actions */}
        <View
          style={[
            styles.section,
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
            Quick Actions
          </Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: colors.primary[100] },
                ]}
              >
                <Settings color={colors.primary[500]} size={24} />
              </View>
              <Text
                style={[
                  styles.actionText,
                  typography.body2,
                  { color: isDark ? colors.white : colors.gray[900] },
                ]}
              >
                Settings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: colors.warning[100] },
                ]}
              >
                <Bell color={colors.warning[500]} size={24} />
              </View>
              <Text
                style={[
                  styles.actionText,
                  typography.body2,
                  { color: isDark ? colors.white : colors.gray[900] },
                ]}
              >
                Notifications
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: colors.success[100] },
                ]}
              >
                <HelpCircle color={colors.success[500]} size={24} />
              </View>
              <Text
                style={[
                  styles.actionText,
                  typography.body2,
                  { color: isDark ? colors.white : colors.gray[900] },
                ]}
              >
                Help
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <View
                style={[
                  styles.actionIconContainer,
                  { backgroundColor: colors.primary[100] },
                ]}
              >
                <FileText color={colors.primary[500]} size={24} />
              </View>
              <Text
                style={[
                  styles.actionText,
                  typography.body2,
                  { color: isDark ? colors.white : colors.gray[900] },
                ]}
              >
                Documents
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Edit Services */}
        <View
          style={[
            styles.section,
            { backgroundColor: isDark ? colors.gray[100] : colors.white },
          ]}
        >
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => router.push('/(mechanic)/edit-services')}
          >
            <Text
              style={[
                styles.sectionTitle,
                typography.subtitle1,
                { color: isDark ? colors.white : colors.gray[900] },
              ]}
            >
              Edit Services
            </Text>
            <ChevronRight color={colors.gray[500]} size={20} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileSection: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 16,
    marginHorizontal: 16,
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
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  availabilityText: {},
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {},
  statLabel: {},
  section: {
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {},
  seeAllText: {},
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  servicePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
  },
  serviceText: {},
  emptyBookings: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  bookingCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.02)',
    marginBottom: 12,
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  bookingService: {
    flex: 1,
  },
  bookingDetails: {
    gap: 8,
    marginBottom: 12,
  },
  bookingDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookingDetailText: {},
  bookingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingCustomer: {},
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionButton: {
    width: '45%',
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    textAlign: 'center',
  },
});
